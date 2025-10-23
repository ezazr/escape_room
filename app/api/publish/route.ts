import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const endpoint = process.env.PUBLISH_ENDPOINT!;
  const body = await req.json();

  const r = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
