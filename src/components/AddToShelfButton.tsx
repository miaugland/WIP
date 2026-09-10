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
    return <span className="text-sm text-accent-hover">Added to your shelf. ✓</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="rounded-full bg-accent px-4 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {status === "loading" ? "Adding ..." : "Add to shelf"}
      </button>
      {status === "error" && (
        <span className="text-sm text-error">Something went wrong.</span>
      )}
    </div>
  );
}
