/*
  Created By: Ron
*/

"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import MovieCard from "@/components/home/MovieCard"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { TMDBMovieListItem, TMDBSearchResponse } from "@/types/schemas"

interface Props {
  initialMovies: TMDBMovieListItem[]
  initialPage: number
  totalPages: number
}

export default function TrendingCarousel({
  initialMovies,
  initialPage,
  totalPages,
}: Props) {
  // All movies currently shown
  const [movies, setMovies] = useState(initialMovies)

  // Keep track of pagination
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(initialPage < totalPages)

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // This div tells us when the user scrolls to the end
  const loaderRef = useRef<HTMLDivElement | null>(null)

  // Load more movies when the loader div becomes visible
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const nextPage = page + 1
      const res = await fetch(`/api/movies/popular?page=${nextPage}`)

      if (!res.ok) throw new Error("Could not load more movies")

      const data: TMDBSearchResponse<TMDBMovieListItem> = await res.json()
      const newMovies = data.results ?? []

      // Add new movies to the list
      setMovies(prev => [...prev, ...newMovies])
      setPage(nextPage)

      // Stop loading once we reach the final page
      if (nextPage >= data.total_pages) {
        setHasMore(false)
      }
    } catch (err) {
      console.error(err)
      setError("Error loading more movies")
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading])

  // Intersection Observer detects when loaderRef is on screen
  useEffect(() => {
    const target = loaderRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "200px" } // load movies a bit before you reach the end
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="relative">
      {/* Main carousel */}
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="gap-6">
          {/* If no movies exist */}
          {movies.length === 0 && (
            <CarouselItem className="basis-full">
              <p className="text-center text-slate-300">No movies found</p>
            </CarouselItem>
          )}

          {/* Render each movie inside a slide */}
          {movies.map(movie => (
            <CarouselItem
              key={movie.id}
              className="basis-44 shrink-0 snap-start"
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
            </CarouselItem>
          ))}

          {/* Loader placeholder to trigger infinite scroll */}
          {hasMore && (
            <CarouselItem className="basis-auto">
              <div ref={loaderRef} className="min-w-px" />
            </CarouselItem>
          )}
        </CarouselContent>

        {/* Shadcn UI arrows */}
        <CarouselPrevious className="rounded-full bg-white/10 text-white hover:bg-white/20" />
        <CarouselNext className="rounded-full bg-white/10 text-white hover:bg-white/20" />
      </Carousel>

      {/* Loading status */}
      <div className="mt-2 text-center text-sm text-slate-400">
        {isLoading ? "Loading more..." : !hasMore ? "You are all caught up" : ""}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-center text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
