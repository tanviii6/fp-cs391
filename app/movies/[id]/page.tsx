import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import Link from "next/link";
import { getMovieDetails } from "@/lib/tmdb";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  return (
    <div className=" bg-white text-black">
      <div className="px-4 py-6">
        <Link href="/" className="text-blue-600 underline">
          ← Back to Home
        </Link>

        <div className="mt-4">
          {movie.backdrop_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              width={1280}
              height={720}
              className="w-full h-auto"
              priority
            />
          ) : (
            <div className="w-full h-48 bg-gray-200" />
          )}
        </div>

        <h1 className="mt-6 text-3xl font-bold">{movie.title}</h1>

        <div className="mt-4">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-md"
            />
          ) : (
            <div className="h-64 w-44 bg-gray-200" />
          )}
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <p>
            <span className="font-semibold">Overview:</span>{" "}
            {movie.overview || "No overview available."}
          </p>
          <p>
            <span className="font-semibold">Release Date:</span>{" "}
            {movie.release_date || "Unknown"}
          </p>
          <p>
            <span className="font-semibold">Runtime:</span>{" "}
            {movie.runtime ? `${movie.runtime} minutes` : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {movie.status || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Vote Average:</span>{" "}
            {movie.vote_average?.toFixed(1)} ({movie.vote_count} votes)
          </p>
          <p>
            <span className="font-semibold">Genres:</span>{" "}
            {movie.genres?.length
              ? movie.genres.map((genre) => genre.name).join(", ")
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
