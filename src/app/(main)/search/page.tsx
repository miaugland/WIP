// søk - kaller Google Books API

"use client";

import { useState } from "react";
import type { GoogleBookResult } from "@/lib/googleBooks";
import AddToShelfButton from "@/components/AddToShelfButton";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setResults(data);
    } catch {
      setError("Couldn't make a search at this moment.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold">Search for books</h1>

      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Title, author …"
          className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#181717] px-4 py-2 text-sm font-medium text-white hover:bg-[#181717]/90 disabled:opacity-50"
        >
          {loading ? "Searching …" : "Search"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 flex flex-col gap-4">
        {results.map((book) => (
          <li key={book.externalId} className="flex gap-4 rounded-md border border-black/10 p-3 dark:border-white/15">
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.coverUrl} alt={book.title} className="h-24 w-16 object-cover" />
            ) : (
              <div className="h-24 w-16 shrink-0 rounded bg-black/5 dark:bg-white/10" />
            )}
            <div>
              <p className="font-medium">{book.title}</p>
              {book.authors.length > 0 && (
                <p className="text-sm text-black/60 dark:text-white/60">
                  {book.authors.join(", ")}
                </p>
              )}
              {book.publishedYear && (
                <p className="text-sm text-black/40 dark:text-white/40">
                  {book.publishedYear}
                </p>
              )}
              <div className="mt-2">
                <AddToShelfButton book={book} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {!loading && !error && hasSearched && results.length === 0 && (
        <p className="mt-6 text-sm text-black/60 dark:text-white/60">
          No results.
        </p>
      )}
    </main>
  );
}
