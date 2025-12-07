/** 
 * Created by: Jude Hosmer
 * Movie search component with debounced input and dynamic results.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import MovieCard from "@/components/home/MovieCard";
import { TMDBMovieListItem } from "@/types/schemas";

type MovieSearchProps = {
  initialMovies: TMDBMovieListItem[];
};

const DEBOUNCE_MS = 450;

export default function MovieSearch({ initialMovies }: MovieSearchProps) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<TMDBMovieListItem[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Switch between default and search headings as the query changes.
  const headline = useMemo(
    () => (query.trim() ? "Search results" : "Popular right now"),
    [query],
  );

  // Debounce searches and cancel in-flight requests when query changes.
  useEffect(() => {
    if (!query.trim()) {
      setMovies(initialMovies);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/movies/search?query=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Search failed with status ${response.status}`);
        }

        const data = await response.json();
        setMovies(Array.isArray(data.results) ? data.results : []);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Movie search failed.", err);
        setError("Couldn't fetch movies. Please try again.");
        setMovies([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query, initialMovies]);

  return (
    <section className="w-full">
      <div className="px-6">
        <div className="flex max-w-xl flex-col gap-2">
          <label className="text-sm font-semibold text-white" htmlFor="movie-search">
            Search movies
          </label>
          <input
            id="movie-search"
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-slate-600 bg-[#1f2937] px-4 py-2 text-sm text-white shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div className="mt-2 flex max-w-xl items-center gap-3 text-sm text-slate-300">
          <span className="font-semibold">{headline}</span>
          {isLoading && <span className="text-xs text-slate-400">Searching...</span>}
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 px-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.length === 0 && !isLoading ? (
          <p className="col-span-full text-center text-slate-300">
            {error ? "No results right now." : "No movies found."}
          </p>
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              poster_path={movie.poster_path}
              title={movie.title}
              average_rating={movie.vote_average}
              release_date={movie.release_date}
              overview={movie.overview}
            />
          ))
        )}
      </div>
    </section>
  );
}
