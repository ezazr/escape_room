"use client";
import { useState } from "react";
import { publishToLambda } from "@/lib/publish";

export default function PublishPage() {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    try {
      setLoading(true);
      setError(null);

      const slug = `test-${Date.now()}`;
      const title = "Lambda Dynamic Page";
      const html = `<p>This page was generated from my local Next.js app 🚀</p>`;

      const publishedUrl = await publishToLambda({ slug, title, html });
      setUrl(publishedUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Publish Dynamic Page</h1>
      <button
        onClick={handlePublish}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Publishing..." : "Publish to S3"}
      </button>

      {url && (
        <p className="text-green-600">
          ✅ Published:{" "}
          <a href={url} target="_blank" className="underline text-blue-600">
            {url}
          </a>
        </p>
      )}
      {error && <p className="text-red-600">❌ {error}</p>}
    </main>
  );
}
