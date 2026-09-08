"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({
  bookId,
  initialRating,
  initialContent,
}: {
  bookId: string;
  initialRating?: number;
  initialContent?: string | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating ?? 5);
  const [content, setContent] = useState(initialContent ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(false);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, rating, content }),
      });

      if (!res.ok) {
        throw new Error();
      }

      router.refresh();
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm">
        Rating
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-md border border-black/10 bg-white px-2 py-1 text-sm text-black dark:border-white/15 dark:bg-neutral-900 dark:text-white"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        /10
      </label>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review (optional)"
        rows={3}
        className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-black dark:border-white/15 dark:bg-neutral-900 dark:text-white"
      />

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="self-start rounded-md bg-[#181717] px-4 py-2 text-sm font-medium text-white hover:bg-[#181717]/90 disabled:opacity-50"
        >
          {saving ? "Saving …" : initialRating ? "Update review" : "Post review"}
        </button>
        {error && (
          <span className="text-sm text-red-600">Something went wrong</span>
        )}
      </div>
    </form>
  );
}
