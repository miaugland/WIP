// POST/GET shelf-entries

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You have to be logged in." },
      { status: 401 }
    );
  }

  const shelfEntries = await prisma.shelfEntry.findMany({
    where: { userId: session.user.id },
    include: { book: true },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(shelfEntries);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You have to be logged in" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { externalId, title, description, coverUrl, publishedYear, pageCount } = body;

  if (!externalId || !title) {
    return NextResponse.json(
      { error: "Missing externalId or title" },
      { status: 400 }
    );
  }

  const book = await prisma.book.upsert({
    where: { externalId },
    update: {},
    create: { externalId, title, description, coverUrl, publishedYear, pageCount },
  });

  const existing = await prisma.shelfEntry.findFirst({
    where: { userId: session.user.id, bookId: book.id },
  });

  if (existing) {
    return NextResponse.json(
      { message: "This book is already on your shelf", shelfEntry: existing },
      { status: 200 }
    );
  }

  const shelfEntry = await prisma.shelfEntry.create({
    data: {
      userId: session.user.id,
      bookId: book.id,
      status: "WANT_TO_READ",
    },
  });

  return NextResponse.json({ shelfEntry }, { status: 201 });
}
