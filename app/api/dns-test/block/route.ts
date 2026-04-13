import { NextRequest, NextResponse } from 'next/server';
import { resolveEndpoint, runBlockCheck } from '@/lib/dns-test';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, mode } = resolveEndpoint(body?.endpoint);
    const result = await runBlockCheck(endpoint, mode);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        title: 'Block Behavior',
        state: 'fail',
        message: 'Could not start block behavior test.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
