"use server";

import {
  TMDBMovieListItem,
  // TMDBMovieDetails,
  TMDBSearchResponse,
} from "@/types/schemas";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY not set in .env.local");
}

// this reusable function can be used throughout to create
// functions to hit different TMDB endpoints
async function tmdbRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB API ERROR: ${response.status} - ${response.statusText}`,
    );
  }

  return response.json();
}

// will be used in the list creation page but could also
// be used to implement a search bar on the home page?
export async function searchMovies(
  query: string,
  page: number = 1,
  language: string = "en-US",
): Promise<TMDBSearchResponse<TMDBMovieListItem>> {
  const encodedQuery = encodeURIComponent(query);
  return tmdbRequest<TMDBSearchResponse<TMDBMovieListItem>>(
    `/search/movie?query=${encodedQuery}&language=${language}&page=${page}`,
  );
}
