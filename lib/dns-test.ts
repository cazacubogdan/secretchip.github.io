export type CheckState = 'pass' | 'fail' | 'info' | 'inconclusive';

export type DnsCheckResult = {
  title: string;
  state: CheckState;
  message: string;
  details?: string;
  technical?: Record<string, unknown>;
};

const FILTERED_ENDPOINT = process.env.NEXT_PUBLIC_DOH_FILTERED || 'https://dns.secretchip.net/dns-query';
const OPEN_ENDPOINT = process.env.NEXT_PUBLIC_DOH_OPEN || 'https://nofilter.dns.secretchip.net/dns-query';
const ALLOWED_ENDPOINTS = new Set([FILTERED_ENDPOINT, OPEN_ENDPOINT]);

export const DNS_TEST_QUERY_DOMAIN = process.env.DNS_TEST_QUERY_DOMAIN || 'example.com';
export const BLOCK_TEST_DOMAIN = process.env.BLOCK_TEST_DOMAIN || 'dns-block-test.secretchip.net';

type DnsJsonAnswer = { name?: string; type?: number; TTL?: number; data?: string };
type DnsJsonResponse = { Status?: number; TC?: boolean; RD?: boolean; RA?: boolean; AD?: boolean; CD?: boolean; Question?: Array<{ name?: string; type?: number }>; Answer?: DnsJsonAnswer[] };

function summarize(response: DnsJsonResponse): string {
  const parts = [
    `Status: ${response.Status ?? 'unknown'}`,
    `Answers: ${response.Answer?.length ?? 0}`,
    `AD: ${response.AD ? 'true' : 'false'}`,
    `RA: ${response.RA ? 'true' : 'false'}`
  ];
  return parts.join(' | ');
}

export function resolveEndpoint(input: unknown): { endpoint: string; mode: 'filtered' | 'open' | 'custom' } {
  const endpoint = typeof input === 'string' ? input : '';

  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    throw new Error('Endpoint is not allowed for testing.');
  }

  if (endpoint === FILTERED_ENDPOINT) return { endpoint, mode: 'filtered' };
  if (endpoint === OPEN_ENDPOINT) return { endpoint, mode: 'open' };
  return { endpoint, mode: 'custom' };
}

export async function runReachability(endpoint: string): Promise<DnsCheckResult> {
  const started = Date.now();
  try {
    const response = await fetch(endpoint, {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });

    const elapsedMs = Date.now() - started;
    const state: CheckState = response.ok ? 'pass' : 'inconclusive';

    return {
      title: 'Reachability',
      state,
      message: response.ok
        ? 'Resolver endpoint accepted an HTTPS request from the server.'
        : 'Resolver endpoint responded but returned a non-success HTTP status.',
      details: `HTTP ${response.status} in ${elapsedMs}ms`,
      technical: { status: response.status, elapsedMs }
    };
  } catch (error) {
    return {
      title: 'Reachability',
      state: 'fail',
      message: 'Server-side request to the resolver endpoint failed.',
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function runQuery(endpoint: string, domain = DNS_TEST_QUERY_DOMAIN): Promise<DnsCheckResult> {
  const queryUrl = `${endpoint}?name=${encodeURIComponent(domain)}&type=A`;
  try {
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: { accept: 'application/dns-json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000)
    });

    if (!response.ok) {
      return {
        title: 'DoH Query',
        state: 'inconclusive',
        message: `Resolver endpoint was reachable but did not return a successful DoH response for ${domain}.`,
        details: `HTTP ${response.status}`
      };
    }

    const data = (await response.json()) as DnsJsonResponse;
    const answerCount = data.Answer?.length ?? 0;

    if ((data.Status ?? 1) === 0 && answerCount > 0) {
      return {
        title: 'DoH Query',
        state: 'pass',
        message: `Resolver returned DNS answers for query domain ${domain}.`,
        details: summarize(data),
        technical: { status: data.Status, answerCount, question: data.Question, queryDomain: domain }
      };
    }

    return {
      title: 'DoH Query',
      state: 'inconclusive',
      message: `Resolver returned a DNS response for query domain ${domain}, but no definitive answer set was present.`,
      details: summarize(data),
      technical: { status: data.Status, answerCount, queryDomain: domain }
    };
  } catch (error) {
    return {
      title: 'DoH Query',
      state: 'fail',
      message: 'Server-side DoH query failed.',
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function runBlockCheck(endpoint: string, mode: 'filtered' | 'open' | 'custom', domain = BLOCK_TEST_DOMAIN): Promise<DnsCheckResult> {
  const queryUrl = `${endpoint}?name=${encodeURIComponent(domain)}&type=A`;

  try {
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: { accept: 'application/dns-json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000)
    });

    if (!response.ok) {
      return {
        title: 'Block Behavior',
        state: 'inconclusive',
        message: 'Could not evaluate block behavior because DoH response was not successful.',
        details: `HTTP ${response.status}`
      };
    }

    const data = (await response.json()) as DnsJsonResponse;
    const answerCount = data.Answer?.length ?? 0;
    const status = data.Status ?? -1;
    const noAnswer = answerCount === 0;
    const blockedSignal = noAnswer || status === 3 || status === 5 || status === 2;

    if (mode === 'filtered') {
      if (blockedSignal) {
        return {
          title: 'Block Behavior',
          state: 'pass',
          message: `Filtered resolver appears to block or suppress answers for block test domain ${domain}.`,
          details: summarize(data),
          technical: { status, answerCount, queryDomain: domain }
        };
      }

      return {
        title: 'Block Behavior',
        state: 'fail',
        message: `Filtered resolver returned answers for block test domain ${domain}.`,
        details: summarize(data),
        technical: { status, answerCount, answers: data.Answer, queryDomain: domain }
      };
    }

    if (mode === 'open') {
      if (blockedSignal) {
        return {
          title: 'Block Behavior',
          state: 'inconclusive',
          message: `Open resolver did not return answers for block test domain ${domain}. This could mean the domain is inactive or blocked upstream.`,
          details: summarize(data),
          technical: { status, answerCount, queryDomain: domain }
        };
      }

      return {
        title: 'Block Behavior',
        state: 'pass',
        message: `Open resolver returned answers for block test domain ${domain}.`,
        details: summarize(data),
        technical: { status, answerCount, queryDomain: domain }
      };
    }

    return {
      title: 'Block Behavior',
      state: 'inconclusive',
      message: 'Resolver mode was not recognized for strict block interpretation.',
      details: summarize(data),
      technical: { status, answerCount, queryDomain: domain }
    };
  } catch (error) {
    return {
      title: 'Block Behavior',
      state: 'fail',
      message: 'Server-side block behavior test failed.',
      details: error instanceof Error ? error.message : String(error)
    };
  }
}
