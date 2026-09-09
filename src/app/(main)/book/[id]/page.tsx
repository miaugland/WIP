// book details

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AddToShelfButton from "@/components/AddToShelfButton";
import ShelfStatusSelect from "@/components/ShelfStatusSelect";
import RemoveFromShelfButton from "@/components/RemoveFromShelfButton";
import ReviewForm from "@/components/ReviewForm";


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
  const session = await auth(); // null if nobody is logged in

  // The book itself, plus its authors/genres pulled in through their join tables
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      authors: { include: { author: true } },
      genres: { include: { genre: true } },
    },
  });

  if (!book) {
    notFound(); // renders 404 page
  }

  // Flatten the join-table results into plain string arrays for easy rendering
  const authorNames = book.authors.map((bookAuthor) => bookAuthor.author.name);
  const genreNames = book.genres.map((bookGenre) => bookGenre.genre.name);

  // Does the logged-in user already have this book on their shelf?
  const shelfEntry = session?.user
    ? await prisma.shelfEntry.findFirst({
      where: { userId: session.user.id, bookId: book.id },
    })
    : null;

  // Every review for this book, from any user, newest first
  const reviews = await prisma.review.findMany({
    where: { bookId: book.id },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Pull the logged-in user's own review out of that list (if they wrote one),
  // so the review form below can pre-fill with it
  const myReview = session?.user
    ? reviews.find((review) => review.userId === session.user.id)
    : undefined;


  // Finding the average rating 
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const averageRatingOutOfFive = averageRating ? averageRating / 2 : null

  return (
    <main className="min-h-screen py-10">


      {/* Path to the book: My shelf / genre / book */}
      <div className="mx-auto max-w-270 px-7 flex items-center gap-2 text-sm text-muted">
        <Link
          href="/shelf"
          className="text-muted hover:text-accent-hover">
          My bookshelf
        </Link>
        <span>/</span>
        {genreNames[0] && <span>{genreNames[0]}</span>}
        <span>/</span>
        <span className="text-ink">{book.title}</span>
      </div>

      {/* Top section: cover image on the left, everything else on the right */}
      <section className="relative mt-4 overflow-hidden rounded-b-[44px] bg-linear-to-b from-[#fbeef1] to-[#fdf5f3]">
        <div className="mx-auto max-w-270 grid grid-cols-[minmax(0,200px)_minmax(0,1fr)] items-center gap-11 px-7 py-11">

          {/*  bookcover  */}
          <div className="aspect-2/3 overflow-hidden rounded-1-1g rounded-r-[22px] shadow-xl">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[#f6dfe4]" />
            )}
          </div>

          <div className="min-w-0">
            <h1 className="m-0 mb-2.5 font-display text-[clamp(38px,5vw,62px)] leading-[1.05] tracking-tight text-ink text-wrap-pretty">
              {book.title}
            </h1>

            {authorNames.length > 0 && (
              <div className="mb-5 font-display text-xl italic text-muted">
                by <span className="text-accent-hover">{authorNames.join(", ")}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4.5 text-sm text-muted">
              {averageRatingOutOfFive && (
                <span className="inline-flex items-baseline gap-2">
                  <span className="font-display text-2xl leading-none text-ink">
                    {averageRatingOutOfFive.toFixed(1)}
                  </span>
                  <span className="text-accent-hover tracking-wider">
                    {"★".repeat(Math.round(averageRatingOutOfFive))}
                    <span className="text-[#e2cdd2]">
                      {"★".repeat(5 - Math.round(averageRatingOutOfFive))}
                    </span>
                  </span>
                </span>
              )}

              <span>{reviews.length} reviews</span>

              {book.pageCount && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#dcc2c8]" />
                  <span>{book.pageCount} pages</span>
                </>
              )}

              {book.publishedYear && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#dcc2c8]" />
                  <span>{book.publishedYear}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Book description, full width below the cover/info row */}
      {book.description && (
        <div className="mx-auto  max-w-270 px-7">
          <p className="mt-6 text-sm text-black/80 dark:text-white/80">
            {book.description}
          </p>
        </div>
      )}

      {/* Reviews section: your own review form on top, everyone's reviews listed below */}
      <div className="mx-auto max-w-270 px-7 mt-8">
        <h2 className="text-lg font-semibold">Reviews</h2>

        {/* Form is pre-filled + says "Update review" if you already reviewed this book */}
        {session?.user ? (
          <ReviewForm
            bookId={book.id}
            initialRating={myReview?.rating}
            initialContent={myReview?.content}
          />
        ) : (
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Log in to write a review.
          </p>
        )}

        {/* List of all reviews for this book (including your own), newest first */}
        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            No reviews yet.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-md border border-black/10 p-3 dark:border-white/15"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{review.user.name ?? "Anonymous"}</span>
                  <span className="text-black/40 dark:text-white/40">
                    {review.rating}/10
                  </span>
                </div>
                {review.content && (
                  <p className="mt-1 text-sm text-black/80 dark:text-white/80">
                    {review.content}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
