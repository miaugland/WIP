import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const validStatuses = ["WANT_TO_READ", "READING", "READ", "DNF"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You have to be logged in" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const entry = await prisma.shelfEntry.findUnique({ where: { id } });

  if (!entry || entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const updated = await prisma.shelfEntry.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/shelf");
  revalidatePath(`/book/${entry.bookId}`);

  return NextResponse.json(updated);
}
