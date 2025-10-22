import { NextResponse } from 'next/server';

export async function GET() {
  const saveCount = (globalThis as any).__saveCount ?? 0;
  return NextResponse.json({
    service: 'assignment-a2',
    saveCount,
    time: new Date().toISOString(),
  });
}
