import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const filteredEndpoint = process.env.NEXT_PUBLIC_DOH_FILTERED || 'https://dns.secretchip.net/dns-query';

describe('DNS API routes', () => {
  it('reachability endpoint returns structured output', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));
    const { POST } = await import('@/app/api/dns-test/reachability/route');

    const req = new NextRequest('http://localhost/api/dns-test/reachability', {
      method: 'POST',
      body: JSON.stringify({ endpoint: filteredEndpoint }),
      headers: { 'content-type': 'application/json' }
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({ title: 'Reachability' });
    expect(['pass', 'fail', 'inconclusive']).toContain(json.state);
  });

  it('query endpoint handles resolver success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ Status: 0, Answer: [{ name: 'example.com', type: 1, data: '1.1.1.1' }] }), { status: 200 })
    );
    const { POST } = await import('@/app/api/dns-test/query/route');

    const req = new NextRequest('http://localhost/api/dns-test/query', {
      method: 'POST',
      body: JSON.stringify({ endpoint: filteredEndpoint }),
      headers: { 'content-type': 'application/json' }
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.state).toBe('pass');
  });

  it('query endpoint handles network failure cleanly', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('fetch failed'));
    const { POST } = await import('@/app/api/dns-test/query/route');

    const req = new NextRequest('http://localhost/api/dns-test/query', {
      method: 'POST',
      body: JSON.stringify({ endpoint: filteredEndpoint }),
      headers: { 'content-type': 'application/json' }
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.state).toBe('fail');
    expect(json.message).toContain('DoH query failed');
  });

  it('block endpoint handles blocked, not blocked, and inconclusive outcomes', async () => {
    const { POST } = await import('@/app/api/dns-test/block/route');

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({ Status: 3, Answer: [] }), { status: 200 }));
    const blockedReq = new NextRequest('http://localhost/api/dns-test/block', {
      method: 'POST',
      body: JSON.stringify({ endpoint: filteredEndpoint }),
      headers: { 'content-type': 'application/json' }
    });
    const blockedResult = await (await POST(blockedReq)).json();
    expect(blockedResult.state).toBe('pass');

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ Status: 0, Answer: [{ data: '1.1.1.1' }] }), { status: 200 })
    );
    const notBlockedReq = new NextRequest('http://localhost/api/dns-test/block', {
      method: 'POST',
      body: JSON.stringify({ endpoint: filteredEndpoint }),
      headers: { 'content-type': 'application/json' }
    });
    const notBlockedResult = await (await POST(notBlockedReq)).json();
    expect(notBlockedResult.state).toBe('fail');

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response('nope', { status: 503 }));
    const inconclusiveReq = new NextRequest('http://localhost/api/dns-test/block', {
      method: 'POST',
      body: JSON.stringify({ endpoint: filteredEndpoint }),
      headers: { 'content-type': 'application/json' }
    });
    const inconclusiveResult = await (await POST(inconclusiveReq)).json();
    expect(inconclusiveResult.state).toBe('inconclusive');
  });
});
