
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReadingProgress({
    entryId,
    currentPage,
    totalPages,
    startedAt,
}: {
    entryId: string;
    currentPage: number | null;
    totalPages: number | null;
    startedAt: Date | null;
}) {
    const router = useRouter();
    const [page, setPage] = useState(currentPage ?? 0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(false);

    const progressPercent =
        totalPages && totalPages > 0
            ? Math.min(100, Math.max(0, (page / totalPages) * 100))
            : 0;

    async function savePage(newPage: number) {
        setSaving(true);
        setError(false);
        try {
            const res = await fetch(`/api/shelf/${entryId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPage: newPage }),
            });
            if (!res.ok) throw new Error();
            router.refresh()
        } catch {
            setError(true);
        } finally {
            setSaving(false);
        }
    }

    async function markFinished() {
        setSaving(true);
        setError(false);
        try {
            const res = await fetch(`/api/shelf/${entryId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "READ" }),
            });
            if (!res.ok) throw new Error();
            router.refresh()
        } catch {
            setError(true);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="rounded-[26px] bg-lavender p-5">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                <div className="font-display text-[17px] text-[#382e4f]">
                    Currently in your hands
                </div>
                {startedAt && (
                    <div className="text-[12.5px] text-[#6d5a94]">
                        since{" "}
                        {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(
                            startedAt
                        )}
                    </div>
                )}
            </div>

            <div className="mb-3 h-2.25 overflow-hidden rounded-full bg-[#ded4fs]">
                <div
                    className="h-full rounded-full bg-[#7a63a8] transition-[width] duration-200"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-[#4f4266]">
                <input
                    type="number"
                    min={0}
                    max={totalPages ?? undefined}
                    value={page}
                    disabled={saving}
                    onChange={(e) => setPage(Number(e.target.value))}
                    onBlur={() => savePage(page)}
                    className="w-17.5 rounded-xl bg-white px-2.5 py-2 text-[14px] text-[#382e4f] outline-none disabled:opacity-50"
                />
                <span>
                    {totalPages ? `of ${totalPages}` : ""}
                    {totalPages && page > 0 ? ` · ${Math.round(progressPercent)}%` : ""}
                </span>

                <button
                    type="button"
                    onClick={markFinished}
                    disabled={saving}
                    className="ml-auto rounded-full bg-[#7a63a8] px-4 py-2 text-[13px] text-white transition-colors hover:bg-[#635090] disabled:opacity-50"
                >
                    Finished
                </button>
            </div>

            {error && <p className="mt-2 text-sm text-error">Couldn't save progress</p>}
        </div>
    );
}