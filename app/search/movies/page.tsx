/** 
 * Created by: Jude Hosmer + Ron Bajrami
 * Search page displaying popular movies and a search component.
 */
import MovieSearch from "@/components/home/MovieSearch";
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
      next: { revalidate: 1800 },
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

export default async function SearchPage() {
  const popularMovies = await fetchPopularMovies();
  return (
    <main className="flex flex-col gap-8 pb-10 pt-6">
      <section className="flex flex-col gap-3 px-6">
        <h1 className="text-3xl font-bold text-white">Search Movies</h1>
        <p className="text-slate-300">
          Find something new by title, or start with popular picks below.
        </p>
      </section>
      <MovieSearch initialMovies={popularMovies.slice(0, 12)} />
    </main>
  );
}
