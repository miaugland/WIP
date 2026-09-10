"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRatingInput from "./StarRatingInput";

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
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-3 rounded-[26px] bg-white p-5.5 shadow-[0_16px_36px_-30px_rgba(59,43,46,0.5)]"
    >
      <div className="font-display text-[17px] text-ink">Your review</div>

      <StarRatingInput value={rating / 2} onChange={(v) => setRating(v * 2)} disabled={saving} />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What stayed with you when you closed the book?"
        rows={4}
        className="w-full resize-y rounded-[18px] bg-[#fdf3f4] px-4 py-3.5 text-[14.5px] leading-relaxed text-ink outline-none placeholder:text-muted-2"
      />

      <div className="flex items-center justify-end gap-2.5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent px-5 py-2.5 text-[13.5px] text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? "Saving ..." : initialRating ? "Update review" : "Post review"}
        </button>
        {error && <span className="text-sm text-error">Something went wrong</span>}
      </div>
    </form>
  );
}
