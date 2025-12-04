import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  const pageParam = url.searchParams.get("page");

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Query parameter 'query' is required" },
      { status: 400 },
    );
  }

  const page = pageParam ? Number(pageParam) || 1 : 1;

  try {
    const results = await searchMovies(query.trim(), page);
    return NextResponse.json(results);
  } catch (error) {
    console.error("TMDB search error", error);
    return NextResponse.json(
      { error: "Unable to search for movies right now." },
      { status: 500 },
    );
  }
}
