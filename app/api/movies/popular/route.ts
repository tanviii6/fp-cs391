import { NextResponse } from "next/server";

import { TMDBMovieListItem, TMDBSearchResponse } from "@/types/schemas";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pageParam = url.searchParams.get("page");
  const page = pageParam ? Number(pageParam) || 1 : 1;

  const apiKey = process.env.TMDB_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "TMDB API key is not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    );

    if (!res.ok) {
      throw new Error(`TMDB popular request failed: ${res.status}`);
    }

    const data =
      (await res.json()) as TMDBSearchResponse<TMDBMovieListItem> | undefined;

    if (!data || !Array.isArray(data.results)) {
      throw new Error("Invalid API response format for popular movies");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching popular movies", error);
    return NextResponse.json(
      { error: "Unable to load trending movies right now." },
      { status: 500 },
    );
  }
}
