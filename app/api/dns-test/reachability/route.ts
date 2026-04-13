import { NextRequest, NextResponse } from 'next/server';
import { resolveEndpoint, runReachability } from '@/lib/dns-test';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = resolveEndpoint(body?.endpoint);
    const result = await runReachability(endpoint);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        title: 'Reachability',
        state: 'fail',
        message: 'Could not start reachability test.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
