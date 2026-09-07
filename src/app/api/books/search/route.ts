// proxy mot Google Books API

import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/googleBooks";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Missing search (?q=...)" },
      { status: 400 }
    );
  }

  try {
    const results = await searchBooks(query);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Couldn't make a search at this moment." },
      { status: 502 }
    );
  }
}
