"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReviewForm from "./ReviewForm";
import StarRatingInput from "./StarRatingInput";

const RATING_LABELS: Record<number, string> = {
    1: "did not like it",
    2: "it was ok",
    3: "liked it",
    4: "really liked it",
    5: "it was amazing!"
};

export default function RatingWidget({
    bookId,
    initialRating,
    initialContent,
}: {
    bookId: string,
    initialRating?: number;
    initialContent?: string | null;
}) {
    const router = useRouter();
    const [rating, setRating] = useState(initialRating ?? 0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(false);
    const [formOpen, setFormOpen] = useState(false);

    const ratingOutOfFive = rating / 2;

    async function quickRate(starValue: number) {
        // starvalue is 0.5-5, convert to backend 1-10
        const newRating = starValue * 2;
        const previous = rating;
        setRating(newRating);
        setSaving(true);
        setError(false);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookId,
                    rating: newRating,
                    content: initialContent ?? "",
                }),
            });
            if (!res.ok) throw new Error();
            router.refresh();
        } catch {
            setRating(previous);
            setError(true);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2.5">
                <StarRatingInput value={ratingOutOfFive} onChange={quickRate} disabled={saving} />

                {ratingOutOfFive > 0 && (
                    <span className="font-display text-sm italic text-muted">
                        {RATING_LABELS[Math.round(ratingOutOfFive)]}
                    </span>
                )}
            </div>

            {error && <p className="mt-1 text-sm text-error">Couldn't save rating</p>}

            {!formOpen ? (
                <button
                    type="button"
                    onClick={() => setFormOpen(true)}
                    className="mt-3.5 rounded-full bg-accent px-4.5 py-2.5 text-[13.5px] text-white transition-colors hover:bg-accent-hover"
                >
                    Write a review
                </button>
            ) : (
                <ReviewForm bookId={bookId} initialRating={rating || undefined} initialContent={initialContent} />
            )}
        </div>
    )
}