"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RemoveFromShelfButton({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(`/api/shelf/${entryId}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error();
      }

      router.refresh();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-md border border-red-600/30 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-600/10 disabled:opacity-50"
      >
        {loading ? "Removing …" : "Remove from shelf"}
      </button>
      {error && <span className="text-sm text-red-600">Couldn&apos;t remove</span>}
    </div>
  );
}
