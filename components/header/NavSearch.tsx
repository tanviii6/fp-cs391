"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TMDBMovieListItem } from "@/types/schemas";

const DEBOUNCE_MS = 350;

export default function NavSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/movies/search?query=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results.slice(0, 6) : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Nav search failed", err);
        setResults([]);
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
  }, [query]);

  return (
    <div className="relative hidden items-center gap-2 md:flex">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-56 rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-500 focus:bg-white"
      />
      {query && (
        <div className="absolute left-0 top-10 z-50 w-72 rounded-md border border-gray-200 bg-white shadow-lg">
          {isLoading ? (
            <p className="px-3 py-2 text-xs text-gray-500">Searching...</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-500">No results</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {results.map((movie) => {
                const year = movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : undefined;
                return (
                  <li key={movie.id}>
                    <Link
                      href={`/movies/${movie.id}`}
                      className="flex flex-col px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                      onClick={() => setQuery("")}
                    >
                      <span className="font-medium">{movie.title}</span>
                      {year && (
                        <span className="text-xs text-gray-500">{year}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
