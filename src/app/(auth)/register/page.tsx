import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthButton from "@/components/AuthButton";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-black/10 p-8 text-center dark:border-white/15">
        <h1 className="text-xl font-semibold">Opprett konto</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Kontoen din opprettes automatisk første gang du logger inn med
          GitHub.
        </p>
        <div className="mt-6 flex justify-center">
          <AuthButton />
        </div>
      </div>
    </main>
  );
}
