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
    <div className="mt-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="text-[12.5px] text-muted underline-offset-2 hover:text-red-600 hover:underline disabled:opacity-50"
      >
        {loading ? "Removing …" : "Remove from shelf"}
      </button>
      {error && <span className="mt-1 text-sm text-red-600">Couldn't remove</span>}
    </div>
  );
}
