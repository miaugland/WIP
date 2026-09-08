"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusOptions = [
  { value: "WANT_TO_READ", label: "Want to read" },
  { value: "READING", label: "Currently reading" },
  { value: "READ", label: "Read" },
  { value: "DNF", label: "Did not finish" },
];

export default function ShelfStatusSelect({
  entryId,
  status,
}: {
  entryId: string;
  status: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function handleChange(newStatus: string) {
    const previous = current;
    setCurrent(newStatus);
    setSaving(true);
    setError(false);

    try {
      const res = await fetch(`/api/shelf/${entryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error();
      }

      router.refresh();
    } catch {
      setCurrent(previous);
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-1 flex items-center gap-2">
      <select
        value={current}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-md border border-black/10 bg-white px-2 py-1 text-sm text-black disabled:opacity-50 dark:border-white/15 dark:bg-neutral-900 dark:text-white"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-600">Couldn&apos;t update</span>}
    </div>
  );
}
