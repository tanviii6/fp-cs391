/*
  Created By: Tanvi Agarwal
*/

import {
  getWatchedCollection,
  getFilmsCollection,
  getUsersCollection,
} from "@/db";
import MovieCard from "@/components/home/MovieCard";
import { ObjectId } from "mongodb";
import { Film } from "@/types/schemas";

interface UserWatchedDisplayProps {
  username: string;
  limit?: number;
  likedOnly?: boolean;
}

export default async function UserWatchedDisplay({
  username,
  limit,
  likedOnly = false,
}: UserWatchedDisplayProps) {
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ username });
  if (!user) return null;

  const watchedCollection = await getWatchedCollection();
  const filmsCollection = await getFilmsCollection();

  const filter: any = { userId: user._id };
  if (likedOnly) filter.liked = true;

  const watched = await watchedCollection
    .find(filter)
    .sort({ _id: -1 })
    .limit(limit || 20)
    .toArray();

  if (watched.length === 0) {
    return (
      <div className="text-center text-[#89a] mt-10">
        {likedOnly ? "No films liked so far." : "No films watched so far."}
      </div>
    );
  }

  const movieIds = watched.map((f) => f.filmId).filter(Boolean);
  const movies = await filmsCollection
    .find({ _id: { $in: movieIds.map((id: ObjectId) => new ObjectId(id)) } })
    .toArray();

  return (
    <div className="space-y-10 mt-6">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-lg font-semibold text-white">
          {likedOnly ? "Liked Films" : "Watched Films"}
        </h2>
      </div>

      <div className="flex overflow-x-auto space-x-4 pb-3 scrollbar-thin scrollbar-thumb-[#345] scrollbar-track-transparent">
        {movies.map((movie: Film) => (
          <div key={movie._id?.toString()} className="flex-shrink-0 w-[176px]">
            <MovieCard
              id={movie.tmdbId!}
              poster_path={movie.posterUrl ?? null}
              title={movie.title}
              average_rating={movie.averageRating ?? 0}
              release_date={
                movie.releaseYear ? `${movie.releaseYear}-01-01` : "Unknown"
              }
              overview={""}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
