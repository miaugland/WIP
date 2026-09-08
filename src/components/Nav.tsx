import Link from "next/link";
import { auth } from "@/lib/auth";
import AuthButton from "@/components/AuthButton";

export default async function Nav() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/15">
      <div className="flex items-center gap-4 text-sm font-medium">
        <Link href="/">Bokappen</Link>
        <Link
          href="/search"
          className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          Search
        </Link>
        {session?.user && (
          <Link
            href="/shelf"
            className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            My shelf
          </Link>
        )}
      </div>
      <AuthButton />
    </nav>
  );
}
