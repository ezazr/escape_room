import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.output.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json(); // {title?, html}
  if (!body?.html) {
    return NextResponse.json({ error: 'html required' }, { status: 400 });
  }

  const row = await prisma.output.create({
    data: {
      title: body.title ?? 'Untitled',
      html: body.html,
    },
  });

  // instrumentation counter
  (globalThis as any).__saveCount = ((globalThis as any).__saveCount ?? 0) + 1;

  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.output.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
