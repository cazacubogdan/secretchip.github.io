import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runBlockCheck, runQuery, runReachability } from '@/lib/dns-test';

describe('lib/dns-test', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns structured success for reachability checks', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));

    const result = await runReachability('https://dns.secretchip.net/dns-query');

    expect(result.title).toBe('Reachability');
    expect(result.state).toBe('pass');
    expect(result.details).toContain('HTTP 200');
  });

  it('returns clean failure for query network errors', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network down'));

    const result = await runQuery('https://dns.secretchip.net/dns-query', 'example.com');

    expect(result.state).toBe('fail');
    expect(result.message).toContain('DoH query failed');
    expect(result.details).toContain('network down');
  });

  it('handles resolver success for query checks', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          Status: 0,
          Answer: [{ name: 'example.com', type: 1, data: '93.184.216.34' }]
        }),
        { status: 200 }
      )
    );

    const result = await runQuery('https://dns.secretchip.net/dns-query', 'example.com');

    expect(result.state).toBe('pass');
    expect(result.message).toContain('query domain example.com');
    expect(result.technical?.answerCount).toBe(1);
  });

  it('reports filtered block behavior as pass when blocked signal appears', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({ Status: 3, Answer: [] }), { status: 200 }));

    const result = await runBlockCheck('https://dns.secretchip.net/dns-query', 'filtered', 'dns-block-test.secretchip.net');

    expect(result.state).toBe('pass');
    expect(result.message).toContain('Filtered resolver appears to block');
  });

  it('reports filtered block behavior as fail when answers are returned', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          Status: 0,
          Answer: [{ name: 'dns-block-test.secretchip.net', type: 1, data: '203.0.113.20' }]
        }),
        { status: 200 }
      )
    );

    const result = await runBlockCheck('https://dns.secretchip.net/dns-query', 'filtered', 'dns-block-test.secretchip.net');

    expect(result.state).toBe('fail');
    expect(result.message).toContain('returned answers');
  });

  it('reports open mode ambiguous outcomes as inconclusive', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({ Status: 3, Answer: [] }), { status: 200 }));

    const result = await runBlockCheck('https://nofilter.dns.secretchip.net/dns-query', 'open', 'dns-block-test.secretchip.net');

    expect(result.state).toBe('inconclusive');
    expect(result.message).toContain('could mean the domain is inactive');
  });
});
