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
    <div>
      <div className="flex flex-wrap gap-1.5">
        {statusOptions.map((option) => {
          const active = option.value === current;
          return (
            <button
              key={option.value}
              type="button"
              disabled={saving}
              onClick={() => handleChange(option.value)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] transition-colors disabled:opacity-50 ${active
                ? "bg-accent text-white"
                : "bg-[#f6e9ec] text-muted hover:bg-[#f0dde1]"
                }`}
            >
              {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              {option.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-error"> Couldn't update</p>}
    </div>
  );
}
