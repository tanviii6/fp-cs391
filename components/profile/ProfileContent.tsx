/*
  Created By: Christian Gonzalez & Tanvi Agarwal
*/

import {
  getFilmsCollection,
  getListCollection,
  getWatchedCollection,
} from "@/db";
import { Film, SerializedUser } from "@/types/schemas";
import MovieCard from "@/components/home/MovieCard";
import Link from "next/link";
import { ObjectId } from "mongodb";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import MovieSearchDialog from "@/components/profile/MovieSearchDialog";

interface ProfileContentProps {
  user: SerializedUser;
}

export default async function ProfileContent({ user }: ProfileContentProps) {
  const watchedCollection = await getWatchedCollection();
  const filmsCollection = await getFilmsCollection();
  const listsCollection = await getListCollection();

  const favoriteEntries = await watchedCollection
    .find({ userId: new ObjectId(user._id), isFavorite: true })
    .sort({ loggedAt: -1 })
    .limit(4)
    .toArray();

  const favoriteFilms =
    favoriteEntries.length > 0
      ? await filmsCollection
          .find({ _id: { $in: favoriteEntries.map((f) => f.filmId) } })
          .toArray()
      : [];
  const newestList = await listsCollection.findOne(
    { userId: new ObjectId(user._id) },
    { sort: { createdAt: -1 } },
  );

  const newestWatched = await watchedCollection.findOne(
    { userId: new ObjectId(user._id) },
    { sort: { loggedAt: -1 } },
  );

  const newestWatchedFilm = newestWatched
    ? await filmsCollection.findOne({ _id: newestWatched.filmId })
    : null;

  const hasActivity = newestList || newestWatchedFilm;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-[#9ab] items-start">
      <div id="favorites" className="pb-8 grid relative lg:col-span-2">
        <div>
          <h2
            className="text-[13px] tracking-[.075em] pb-1 border-b border-[#9ab]
             mb-3 mx-0 uppercase"
          >
            Favorite Films
          </h2>

          {favoriteFilms.length > 0 && (
            <div className="flex overflow-x-auto space-x-4 pb-3 scrollbar-thin scrollbar-thumb-[#345] scrollbar-track-transparent">
              {favoriteFilms.map((film: Film) => (
                <div
                  key={film._id!.toString()}
                  className="flex-shrink-0 w-[176px]"
                >
                  <MovieCard
                    id={film.tmdbId!}
                    poster_path={film.posterUrl ?? null}
                    title={film.title}
                    average_rating={film.averageRating ?? 0}
                    release_date={
                      film.releaseYear ? `${film.releaseYear}-01-01` : "Unknown"
                    }
                    overview={""}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Dialog container added by Christian Gonzalez  */}
          {favoriteFilms.length < 4 && (
            <Dialog>
              {favoriteFilms.length === 0 ? (
                <p className="text-[13px] leading-1.5">
                  No liked films yet —{" "}
                  <DialogTrigger asChild>
                    <button className="underline cursor-pointer hover:text-white transition-colors">
                      favorite some to feature them here!
                    </button>
                  </DialogTrigger>
                </p>
              ) : (
                <DialogTrigger asChild>
                  <button className="text-[13px] underline cursor-pointer hover:text-white transition-colors mt-3">
                    Add another favorite
                  </button>
                </DialogTrigger>
              )}
              <DialogContent className="bg-[#101317]">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Favorite a film
                  </DialogTitle>
                  <DialogDescription className="text-[#9ab]">
                    Search for your favorite movie to display it on your
                    profile! You can add up to 4 favorites.
                  </DialogDescription>
                </DialogHeader>
                <MovieSearchDialog userId={user._id!} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <aside className="pb-8 grid relative lg:col-span-1 self-start">
        <h2 className="text-[13px] tracking-[.075em] pb-1 mb-3 mx-0 border-b border-[#9ab] uppercase">
          Bio
        </h2>
        <div>
          {user.bio ? (
            <p className="text-[10px] tracking-[0.075em]">{user.bio}</p>
          ) : (
            <p className="text-[13px]">No bio yet.</p>
          )}
        </div>
      </aside>

      {hasActivity && (
        <div id="recent-activity" className="pb-8 grid relative lg:col-span-2">
          <div>
            <h2
              className="text-[13px] tracking-[.075em] pb-1 border-b border-[#9ab]
               mb-3 mx-0 uppercase"
            >
              Recent Activity
            </h2>

            <div className="text-[13px] leading-6 space-y-2">
              {newestList && (
                <p>
                  Created new list:{" "}
                  <Link
                    href={`/${user.username}/lists`}
                    className="font-semibold text-white underline"
                  >
                    {newestList.title}
                  </Link>
                </p>
              )}

              {newestWatchedFilm && (
                <p>
                  Watched{" "}
                  <span className="font-semibold text-white">
                    {newestWatchedFilm.title}
                  </span>{" "}
                  {newestWatchedFilm.releaseYear
                    ? `(${newestWatchedFilm.releaseYear})`
                    : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
