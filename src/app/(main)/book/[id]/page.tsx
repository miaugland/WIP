// book details

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AddToShelfButton from "@/components/AddToShelfButton";
import ShelfStatusSelect from "@/components/ShelfStatusSelect";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    select: { title: true },
  });

  return { title: book?.title ?? "Book not found" };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const book = await prisma.book.findUnique({
    where: { id },
    include: { authors: { include: { author: true } } },
  });

  if (!book) {
    notFound();
  }

  const authorNames = book.authors.map((bookAuthor) => bookAuthor.author.name);

  const shelfEntry = session?.user
    ? await prisma.shelfEntry.findFirst({
        where: { userId: session.user.id, bookId: book.id },
      })
    : null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/shelf"
        className="text-sm text-black/60 hover:underline dark:text-white/60"
      >
        ← Back to my shelf
      </Link>

      <div className="mt-4 flex gap-6">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-48 w-32 shrink-0 object-cover"
          />
        ) : (
          <div className="h-48 w-32 shrink-0 rounded bg-black/5 dark:bg-white/10" />
        )}

        <div>
          <h1 className="text-xl font-semibold">{book.title}</h1>
          {authorNames.length > 0 && (
            <p className="text-sm text-black/60 dark:text-white/60">
              {authorNames.join(", ")}
            </p>
          )}
          {book.publishedYear && (
            <p className="mt-1 text-sm text-black/40 dark:text-white/40">
              {book.publishedYear}
              {book.pageCount ? ` · ${book.pageCount} pages` : ""}
            </p>
          )}

          <div className="mt-4">
            {!session?.user ? (
              <p className="text-sm text-black/60 dark:text-white/60">
                Log in to add this book to your shelf.
              </p>
            ) : shelfEntry ? (
              <ShelfStatusSelect entryId={shelfEntry.id} status={shelfEntry.status} />
            ) : (
              <AddToShelfButton
                book={{
                  externalId: book.externalId ?? "",
                  title: book.title,
                  authors: authorNames,
                  description: book.description,
                  coverUrl: book.coverUrl,
                  publishedYear: book.publishedYear,
                  pageCount: book.pageCount,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {book.description && (
        <p className="mt-6 text-sm text-black/80 dark:text-white/80">
          {book.description}
        </p>
      )}
    </main>
  );
}
