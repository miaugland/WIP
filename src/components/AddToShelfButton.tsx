"use client";

import { useState } from "react";
import type { GoogleBookResult } from "@/lib/googleBooks";

type Status = "idle" | "loading" | "added" | "error";

export default function AddToShelfButton({ book }: { book: GoogleBookResult }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    setStatus("loading");

    try {
      const res = await fetch("/api/shelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      if (!res.ok) {
        throw new Error();
      }

      setStatus("added");
    } catch {
      setStatus("error");
    }
  }

  if (status === "added") {
    return <span className="text-sm text-green-600">Lagt til i hylla ✓</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="rounded-md border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/10"
      >
        {status === "loading" ? "Legger til …" : "Legg til i hylle"}
      </button>
      {status === "error" && (
        <span className="text-sm text-red-600">Noe gikk galt</span>
      )}
    </div>
  );
}
