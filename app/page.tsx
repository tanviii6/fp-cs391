import MovieSearch from "@/components/home/MovieSearch";
import { TMDBMovieListItem } from "@/types/schemas";

async function fetchPopularMovies(): Promise<TMDBMovieListItem[]> {
  try {
    const apiKey = process.env.TMDB_API_KEY?.trim();
    if (!apiKey) {
      console.error("TMDB API key is not set");
      return [];
    }

    const url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 3667 },
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

  return (
    <main className="flex flex-col gap-8 pb-10 pt-6">
      <MovieSearch initialMovies={popularMovies} />
    </main>
  );
}
