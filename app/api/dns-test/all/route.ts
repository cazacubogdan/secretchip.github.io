import { NextRequest, NextResponse } from 'next/server';
import { resolveEndpoint, runBlockCheck, runQuery, runReachability } from '@/lib/dns-test';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, mode } = resolveEndpoint(body?.endpoint);

    const [reachability, query, block] = await Promise.all([
      runReachability(endpoint),
      runQuery(endpoint, 'google.com'),
      runBlockCheck(endpoint, mode)
    ]);

    return NextResponse.json({ results: [reachability, query, block] });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Could not run full DNS test chain.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
