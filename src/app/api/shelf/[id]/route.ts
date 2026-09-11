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
  const { status, currentPage } = await request.json();

  if (status != undefined && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const entry = await prisma.shelfEntry.findUnique({ where: { id } });

  if (!entry || entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const data: {
    status?: typeof status;
    currentPage?: number | null
    startedAt?: Date;
    finishedAt?: Date;
  } = {};

  if (status !== undefined) {
    data.status = status;

    if (status === "READING" && !entry.startedAt) {
      data.startedAt = new Date();
    }

    if (status === "READ") {
      data.finishedAt = new Date();
      data.currentPage = null;
    }
  }

  if (currentPage !== undefined) {
    data.currentPage = currentPage;
  }

  const updated = await prisma.shelfEntry.update({
    where: { id },
    data,
  });

  revalidatePath("/shelf");
  revalidatePath(`/book/${entry.bookId}`);

  return NextResponse.json(updated);
}

export async function DELETE(
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

  const entry = await prisma.shelfEntry.findUnique({ where: { id } });

  if (!entry || entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  await prisma.shelfEntry.delete({ where: { id } });

  revalidatePath("/shelf");
  revalidatePath(`/book/${entry.bookId}`);

  return NextResponse.json({ success: true });
}
