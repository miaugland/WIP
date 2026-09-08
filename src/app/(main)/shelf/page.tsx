// "min hylle"

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ShelfStatusSelect from "@/components/ShelfStatusSelect";
import RemoveFromShelfButton from "@/components/RemoveFromShelfButton";

export default async function ShelfPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const shelfEntries = await prisma.shelfEntry.findMany({
    where: { userId: session.user.id },
    include: { book: true },
    orderBy: { id: "desc" },
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold">My shelf</h1>

      {shelfEntries.length === 0 ? (
        <p className="mt-6 text-sm text-black/60 dark:text-white/60">
          You don't have any books yet.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {shelfEntries.map((entry) => (
            <li
              key={entry.id}
              className="flex gap-4 rounded-md border border-black/10 p-3 dark:border-white/15"
            >
              {entry.book.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.book.coverUrl}
                  alt={entry.book.title}
                  className="h-24 w-16 object-cover"
                />
              ) : (
                <div className="h-24 w-16 shrink-0 rounded bg-black/5 dark:bg-white/10" />
              )}
              <div>
                <Link href={`/book/${entry.book.id}`} className="font-medium hover:underline">
                  {entry.book.title}
                </Link>
                {entry.book.publishedYear && (
                  <p className="text-sm text-black/40 dark:text-white/40">
                    {entry.book.publishedYear}
                  </p>
                )}
                <ShelfStatusSelect entryId={entry.id} status={entry.status} />
                <div className="mt-2">
                  <RemoveFromShelfButton entryId={entry.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
