import MovieCard from "@/components/home/MovieCard";
import { Film } from "@/types/schemas";

export default async function Home() {
  let movies = [];

  try {
    //Gets API key and trims off any whitespace
    const apiKey = process.env.TMDB_API_KEY?.trim();
    if (!apiKey) {
      console.error("API key is not set");
      return (
        <text className="text-red-500 text-lg font-semibold">
          Error: API is not configured.
        </text>
      );
    }

    // TMDB API url for popular movies
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: { revalidate: 3667 },
    });

    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Invalid API response format");
    }

    movies = data.results;
  } catch (error) {
    console.error("Error fetching movies", error);
  }

  return (
    <main className="flex flex-wrap justify-center gap-6 p-6">
      {movies.length === 0 ? (
        <p className="text-white">No movies found.</p>
      ) : (
        movies.map((movie: Film) => (
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
    </main>
  );
}
