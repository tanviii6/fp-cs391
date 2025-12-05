//this is used to display the existing list on profiles page as a horozontally scrollable section per list 
import { getUserLists } from "@/lib/lists";
import { getFilmsCollection } from "@/db";
import MovieCard from "@/components/home/MovieCard"; 
import { ObjectId } from "mongodb";

interface UserListsDisplayProps {
  username: string;
  limit?: number;
}


// we needed a component which runs on the server and fetches data directly
export default async function UserListsDisplay({
  username, limit
}: UserListsDisplayProps) {
  const lists = await getUserLists(username);
  const limitedLists = limit ? lists.slice(0, limit) : lists;

  const filmsCollection = await getFilmsCollection();

  const listsWithMovies = await Promise.all(
    limitedLists.map(async (list) => {
      const movies = await filmsCollection
        .find({
          _id: { $in: list.movies.map((id: ObjectId) => new ObjectId(id)) },
        })
        .toArray();
      return { ...list, movies };
    })
  );

  if (listsWithMovies.length === 0) {
    return (
      <div className="text-center text-[#89a] mt-10">
        No lists yet.{" "}
        <a
          href={`/${username}/lists/create`}
          className="text-[#40bcf4] hover:underline"
        >
          Create your first list.
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-6">
      {listsWithMovies.map((list) => (
        <div key={list._id.toString()}>
          <div className="flex justify-between items-end mb-2">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {list.title}
              </h2>
              {list.description && (
                <p className="text-sm text-[#89a]">{list.description}</p>
              )}
            </div>
          </div>

          <div className="flex overflow-x-auto space-x-4 pb-3 scrollbar-thin scrollbar-thumb-[#345] scrollbar-track-transparent">
            {list.movies.length === 0 ? (
              <p className="text-[#678]">No films added yet.</p>
            ) : (
              list.movies.map((movie: any) => (
                <div
                  key={movie._id.toString()}
                  className="flex-shrink-0 w-[160px]"
                >
                  <MovieCard
                    id={movie._id.toString().length} 
                    poster_path={movie.posterUrl || null}
                    title={movie.title}
                    average_rating={movie.averageRating || 0}
                    release_date={movie.releaseYear?.toString() || ""}
                    overview={""}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
