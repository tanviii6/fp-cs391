import MovieCard from "@/components/home/MovieCard";
import { TMDBMovieListItem } from "@/types/schemas";

async function fetchPopularMovies(): Promise<TMDBMovieListItem[]> {
  try {
    const apiKey = process.env.TMDB_API_KEY?.trim();
    if (!apiKey) {
      console.error("TMDB API key is not set");
      return [];
    }

    const url =
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
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

    return data.results;
  } catch (error) {
    console.error("Error fetching popular movies", error);
    return [];
  }
}

export default async function Home() {
  const popularMovies = await fetchPopularMovies();
  const topTen = popularMovies.slice(0, 10);

  return (
    <main className="flex flex-col gap-6 pb-12 pt-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-white">Trending Now</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {topTen.length === 0 ? (
            <p className="col-span-full text-center text-slate-300">
              No movies found.
            </p>
          ) : (
            topTen.map((movie) => (
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
