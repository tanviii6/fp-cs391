/** 
 * Created by: Jude Hosmer + Ron Bajrami
 * Home page displaying hero, trending carousel, and highest rated grid.
 */
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import MovieCard from "@/components/home/MovieCard";
import TrendingCarousel from "@/components/home/TrendingCarousel";
import { TMDBMovieListItem, TMDBSearchResponse } from "@/types/schemas";

// Fetch popular titles from TMDB for the hero and trending carousel.
async function fetchPopularMovies(
  page: number = 1,
): Promise<TMDBSearchResponse<TMDBMovieListItem>> {
  try {
    const apiKey = process.env.TMDB_API_KEY?.trim();
    if (!apiKey) {
      console.error("TMDB API key is not set");
      return {
        page,
        results: [],
        total_pages: 0,
        total_results: 0,
      };
    }

    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`TMDB popular request failed: ${res.status}`);
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Invalid API response format");
    }

    return data;
  } catch (error) {
    console.error("Error fetching popular movies", error);
    return {
      page,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

// Fetch top rated titles for the grid section.
async function fetchTopRatedMovies(
  page: number = 1,
): Promise<TMDBSearchResponse<TMDBMovieListItem>> {
  try {
    const apiKey = process.env.TMDB_API_KEY?.trim();
    if (!apiKey) {
      console.error("TMDB API key is not set");
      return {
        page,
        results: [],
        total_pages: 0,
        total_results: 0,
      };
    }

    const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`TMDB top rated request failed: ${res.status}`);
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Invalid API response format");
    }

    return data;
  } catch (error) {
    console.error("Error fetching top rated movies", error);
    return {
      page,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

export default async function Home() {
  const [popularData, topRatedData] = await Promise.all([
    fetchPopularMovies(),
    fetchTopRatedMovies(),
  ]);

  const popularMovies = popularData.results || [];
  const popularPage = popularData.page || 1;
  const popularTotalPages = popularData.total_pages;
  const highestRated = (topRatedData.results || []).slice(0, 10);
  // Use the first popular movie as the landing hero.
  const heroMovie = popularMovies[0];
  const heroBackdrop = heroMovie?.backdrop_path || heroMovie?.poster_path;

  const session = await auth();

  return (
    <main className="flex flex-col gap-10 pb-16 pt-10 ">
      <section className="relative overflow-hidden rounded-2xl p-8 text-center shadow-lg shadow-black/25">
        {heroBackdrop && (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${heroBackdrop}`}
              alt={`${heroMovie?.title || "Popular movie"} background`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-[#0f1318]/85 via-[#0f1318]/75 to-[#0f1318]/90" />
          </>
        )}
        {!heroBackdrop && (
          <div className="absolute inset-0 bg-linear-to-b from-neutral-900 via-neutral-900/80 to-neutral-800" />
        )}
        <div className="relative flex flex-col items-center gap-3 text-center">
          <Image
            src="/logofilmflow12.png"
            alt="FilmFlow logo"
            width={140}
            height={140}
            className="h-50 w-50 object-contain"
            priority
          />
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white md:text-4xl">
            Discover, track, and share the films you love.
          </h1>
          <p className="max-w-3xl text-base text-slate-200">
            Browse trending titles, curate favorites, and stay on top of
            what&apos;s worth watching. Built for movie lovers with clean lists
            and quick discovery.
          </p>
        </div>
        <div className="relative mt-5">
          {!session && (
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400"
            >
              Sign up / Sign in
            </Link>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-white">Trending Now</h2>
        <TrendingCarousel
          initialMovies={popularMovies.slice(0, 15)}
          initialPage={popularPage}
          totalPages={popularTotalPages}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-white">Highest Rated</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {highestRated.length === 0 ? (
            <p className="col-span-full text-center text-slate-300">
              No movies found.
            </p>
          ) : (
            highestRated.map((movie: TMDBMovieListItem) => (
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
    </main>
  );
}
