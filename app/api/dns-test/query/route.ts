import { NextRequest, NextResponse } from 'next/server';
import { resolveEndpoint, runQuery } from '@/lib/dns-test';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = resolveEndpoint(body?.endpoint);
    const result = await runQuery(endpoint);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        title: 'DoH Query',
        state: 'fail',
        message: 'Could not start DoH query test.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
