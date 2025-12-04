"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TMDBMovieListItem, TMDBSearchResponse } from "@/types/schemas";
import MovieCard from "./MovieCard";

interface TrendingCarouselProps {
  initialMovies: TMDBMovieListItem[];
  initialPage?: number;
  totalPages?: number;
}

const TrendingCarousel = ({
  initialMovies,
  initialPage = 1,
  totalPages,
}: TrendingCarouselProps) => {
  const [movies, setMovies] = useState<TMDBMovieListItem[]>(
    initialMovies ?? [],
  );
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(() => {
    if (typeof totalPages === "number") {
      return totalPages > 0 && initialPage < totalPages;
    }
    return true;
  });
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    const nextPage = page + 1;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/movies/popular?page=${nextPage}`);
      if (!res.ok) {
        throw new Error(`Failed to load page ${nextPage}`);
      }

      const data: TMDBSearchResponse<TMDBMovieListItem> | undefined =
        await res.json();
      const newResults = data?.results ?? [];

      setMovies((prev) => [...prev, ...newResults]);
      const currentPage = data?.page ?? nextPage;
      setPage(currentPage);

      const total = data?.total_pages;
      if (
        newResults.length === 0 ||
        (typeof total === "number" && currentPage >= total)
      ) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load more movies right now.");
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page]);

  const scrollByOneCard = useCallback((direction: "next" | "prev") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-card]");
    if (!firstCard) return;

    const gap = 24; // matches tailwind gap-6 (1.5rem)
    const cardWidth = firstCard.getBoundingClientRect().width + gap;
    const offset = direction === "next" ? cardWidth : -cardWidth;
    container.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const target = loaderRef.current;
    const root = scrollContainerRef.current;
    if (!target || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { root, rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }

    autoScrollRef.current = setInterval(() => {
      const firstCard = container.querySelector<HTMLElement>("[data-card]");
      if (!firstCard) return;

      const gap = 24; // matches tailwind gap-6 (1.5rem)
      const cardWidth = firstCard.getBoundingClientRect().width + gap;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const nextLeft = container.scrollLeft + cardWidth;

      if (nextLeft >= maxScroll - 2) {
        if (hasMore) {
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        } else {
          container.scrollTo({ left: 0, behavior: "smooth" });
        }
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3500);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [hasMore, movies.length]);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => scrollByOneCard("prev")}
          className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-white/20"
          aria-label="Scroll to previous"
        >
          {"<"}
        </button>

        <div
          ref={scrollContainerRef}
          className="flex w-full items-stretch gap-6 overflow-x-auto scroll-smooth"
        >
          {movies.length === 0 ? (
            <p className="text-center text-slate-300">No movies found.</p>
          ) : (
            <>
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  data-card
                  className="min-w-[11rem] shrink-0 snap-start"
                >
                  <MovieCard
                    id={movie.id}
                    poster_path={movie.poster_path}
                    title={movie.title}
                    average_rating={movie.vote_average}
                    release_date={movie.release_date}
                    overview={movie.overview}
                    overviewMaxLength={60}
                  />
                </div>
              ))}
              <div ref={loaderRef} className="min-w-[1px]" />
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => scrollByOneCard("next")}
          className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-white/20"
          aria-label="Scroll to next"
        >
          {">"}
        </button>
      </div>

      <div className="mt-2 text-center text-sm text-slate-400">
        {isLoading
          ? "Loading more..."
          : !hasMore && movies.length > 0
            ? "You’re all caught up."
            : null}
      </div>

      {error ? (
        <p className="text-center text-sm text-red-400">{error}</p>
      ) : null}
    </div>
  );
};

export default TrendingCarousel;
