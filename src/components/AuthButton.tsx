import { auth, signIn, signOut } from "@/lib/auth";

export default async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <p>Logged in as {session.user.name}</p>
        <button type="submit">Log out</button>
      </form>
    );
  }

    return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button type="submit">Log in with Github</button>
    </form>
  );
}