export async function publishToLambda({ slug, title, html }: { slug: string; title: string; html: string }) {
  const res = await fetch("/api/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, title, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Publish failed: ${res.status}`);
  return data.url as string;
}
