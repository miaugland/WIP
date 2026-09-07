// wrapper for ekstern bok-API

export type GoogleBookResult = {
  externalId: string;
  title: string;
  authors: string[];
  description: string | null;
  coverUrl: string | null;
  publishedYear: number | null;
  pageCount: number | null;
};

type GoogleVolumesResponse = {
  items?: {
    id: string;
    volumeInfo?: {
      title?: string;
      authors?: string[];
      description?: string;
      publishedDate?: string;
      pageCount?: number;
      imageLinks?: { thumbnail?: string };
    };
  }[];
};

export async function searchBooks(query: string): Promise<GoogleBookResult[]> {
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", "20");
  if (process.env.GOOGLE_BOOKS_API_KEY) {
    url.searchParams.set("key", process.env.GOOGLE_BOOKS_API_KEY);
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Google Books API failed with status ${res.status}`);
  }

  const data: GoogleVolumesResponse = await res.json();

  return (data.items ?? []).map((item) => {
    const info = item.volumeInfo ?? {};
    const year = info.publishedDate ? parseInt(info.publishedDate.slice(0, 4), 10) : NaN;

    return {
      externalId: item.id,
      title: info.title ?? "Unknown title",
      authors: info.authors ?? [],
      description: info.description ?? null,
      coverUrl: info.imageLinks?.thumbnail ?? null,
      publishedYear: Number.isNaN(year) ? null : year,
      pageCount: info.pageCount ?? null,
    };
  });
}
