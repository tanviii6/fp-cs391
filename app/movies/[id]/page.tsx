import Image from "next/image";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import MovieLogger from "@/components/movies/MovieLogger";

import { getMovieDetails } from "@/lib/tmdb";
import { getCurrentUser } from "@/lib/users";
import type { Film, TMDBCastMember, TMDBCrewMember } from "@/types/schemas";
import { addFilm, getFilmByTmdbId } from "@/lib/films";
import { ObjectId } from "mongodb";
import { getLoggedFilm } from "@/lib/watched";
import { isFilmLiked } from "@/lib/likes";
import { auth } from "@/auth";

type MoviePageProps = {
  params: Promise<{ id: string }>;
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

export default async function MoviePage({
  params,
  searchParams,
}: MoviePageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const session = await auth();
  let user = undefined;
  if (session?.user?.email) {
    user = (await getCurrentUser(session.user.email)) ?? undefined;
  }

  // URL State helpers
  const sectionParam =
    typeof resolvedSearchParams === "object" && resolvedSearchParams
      ? resolvedSearchParams["section"]
      : undefined;
  const showAllCastParam =
    typeof resolvedSearchParams === "object" && resolvedSearchParams
      ? resolvedSearchParams["showAllCast"]
      : undefined;
  const showAllCrewParam =
    typeof resolvedSearchParams === "object" && resolvedSearchParams
      ? resolvedSearchParams["showAllCrew"]
      : undefined;

  const showAllCast =
    (Array.isArray(showAllCastParam)
      ? showAllCastParam[0]
      : showAllCastParam) === "1"; // check if user expanded list
  const showAllCrew =
    (Array.isArray(showAllCrewParam)
      ? showAllCrewParam[0]
      : showAllCrewParam) === "1";

  const sectionRaw = Array.isArray(sectionParam)
    ? sectionParam[0]
    : sectionParam;
  const allowedSections = [
    "cast",
    "crew",
    "details",
    "genres",
    "links",
  ] as const; //  tabs
  const activeSection = (sectionRaw || "cast").toLowerCase();
  const currentSection = allowedSections.includes(activeSection as any)
    ? activeSection
    : "cast"; // fallback if url doesnt work

  // Data fetching
  const movie = await getMovieDetails(id); // fetch on server

  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : null; // grab year
  const crew = movie.credits?.crew || [];
  const directors = crew.filter(
    (member: TMDBCrewMember) => member.job === "Director"
  );
  const cast = movie.credits?.cast || [];
  const studiosRaw = movie.production_companies || [];

  const studiosFiltered = studiosRaw.filter(
    (company) => company.name?.trim() !== "Walt Disney Animation Studios" // remove duplicate entry
  );
  const studios = studiosFiltered.length ? studiosFiltered : studiosRaw;

  // add each film visited into our db
  const currentFilm: Film = {
    _id: new ObjectId(),
    tmdbId: movie.id,
    title: movie.title,
    releaseYear: Number(releaseYear) || undefined,
    posterUrl: movie.poster_path || undefined,
    directors: directors,
    synopsis: movie.overview,
    runtimeMinutes: movie.runtime,
    genres: movie.genres,
    averageRating: movie.vote_average,
    totalRatings: movie.vote_count,
  };

  await addFilm(currentFilm);

  // fetch film from db
  const actualFilm = await getFilmByTmdbId(movie.id);

  // fetch initial data for movielogger if user is logged in
  let initialData = undefined;
  if (user?._id && actualFilm?._id) {
    const loggedFilm = await getLoggedFilm(user._id, actualFilm._id);
    const liked = await isFilmLiked(
      actualFilm._id.toString(),
      user._id.toString()
    );

    initialData = {
      isWatched: !!loggedFilm,
      isLiked: liked,
      rating: loggedFilm?.rating || 0,
    };
  }

  return (
    <div className="min-h-screen bg-[#14181C] text-slate-50 font-sans selection:bg-emerald-500/30">
      <div className="relative h-[500px] w-full">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#0f1318]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14181C] via-[#14181C]/75 to-transparent" />

        <div className="absolute top-0 left-0 z-20 w-full px-6 py-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-64 flex max-w-6xl flex-col gap-8 px-6 pb-20 md:flex-row md:items-start">
        <div className="shrink-0">
          <div className="relative aspect-2/3 w-[200px] overflow-hidden rounded-lg shadow-xl bg-slate-900">
            <Image
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://placehold.co/600x900/0f172a/94a3b8.png?text=No+Poster" // basic fallback
              }
              alt={movie.title}
              width={300}
              height={450}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="flex flex-row">
          <div className="flex flex-1 flex-col pt-4 md:pt-12 text-slate-100">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl mb-2">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 mb-6">
              {releaseYear && <span>{releaseYear}</span>}
              {movie.runtime > 0 && (
                <>
                  <span>•</span>
                  <span>{movie.runtime} min</span>
                </>
              )}
              {directors.length > 0 && (
                <>
                  <span>•</span>
                  <span>Dir. {directors.map((d) => d.name).join(", ")}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-amber-400">
                <span className="text-lg font-bold text-white mr-1">
                  {movie.vote_average.toFixed(1)}
                </span>
                <AiFillStar className="text-lg" />
              </div>

              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="text-xs font-medium text-slate-300 bg-slate-800 px-2 py-1 rounded"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {movie.tagline && (
              <p className="mb-3 text-sm font-medium text-emerald-400 italic">
                {movie.tagline}
              </p>
            )}

            <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
              {movie.overview || "No overview available."}
            </p>
          </div>
          <MovieLogger
            user={
              user
                ? {
                    ...user,
                    _id: user._id?.toString(),
                  }
                : undefined
            }
            film={{
              ...currentFilm,
              _id: actualFilm?._id?.toString(),
            }}
            initialData={initialData}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24" id="sections">
        {/* tab navigation */}
        <nav className="mb-8 flex gap-6 border-b border-slate-800 pb-1">
          {[
            { key: "cast", label: "Cast" },
            { key: "crew", label: "Crew" },
            { key: "details", label: "Details" },
            { key: "links", label: "Links" },
          ].map((item) => {
            const isActive = currentSection === item.key;
            return (
              <Link
                key={item.key}
                href={`/movies/${id}?section=${item.key}#sections`} // keeps state in url
                className={`pb-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-emerald-500 text-emerald-400" // active state
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="min-h-[200px]">
          {currentSection === "cast" && (
            <div>
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {cast.length ? (
                  (showAllCast ? cast : cast.slice(0, 20)).map(
                    (
                      member: TMDBCastMember // cap at 20 unless expanded
                    ) => (
                      <span
                        key={member.id}
                        className="inline-flex items-center rounded bg-[#1c2430] px-2 py-1 text-xs text-slate-200 border border-[#2c3542] shadow-sm"
                      >
                        <span className="text-slate-50 mr-1">
                          {member.name}
                        </span>
                        {member.character && (
                          <span className="text-slate-400 truncate max-w-[150px]">
                            {" "}
                            as {member.character}
                          </span>
                        )}
                      </span>
                    )
                  )
                ) : (
                  <span className="text-slate-500">No cast information.</span>
                )}
              </div>
              {cast.length > 20 && (
                <div className="mt-4">
                  <Link
                    href={
                      showAllCast
                        ? `/movies/${id}?section=cast#sections`
                        : `/movies/${id}?section=cast&showAllCast=1#sections`
                    }
                    className="text-xs font-medium text-emerald-400 hover:underline"
                  >
                    {showAllCast ? "Show less" : "Show all cast"}
                  </Link>
                </div>
              )}
            </div>
          )}

          {currentSection === "crew" && (
            <div>
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {crew.length ? (
                  (showAllCrew ? crew : crew.slice(0, 20)).map(
                    (member: TMDBCrewMember) => (
                      <span
                        key={`${member.id}-${member.job}`}
                        className="inline-flex items-center rounded bg-[#1c2430] px-2 py-1 text-xs text-slate-200 border border-[#2c3542] shadow-sm"
                      >
                        <span className="text-slate-50 mr-1">
                          {member.name}
                        </span>
                        {member.job && (
                          <span className="text-slate-400">
                            {" "}
                            — {member.job}
                          </span>
                        )}
                      </span>
                    )
                  )
                ) : (
                  <span className="text-slate-500">No crew information.</span>
                )}
              </div>
              {crew.length > 20 && (
                <div className="mt-4">
                  <Link
                    href={
                      showAllCrew
                        ? `/movies/${id}?section=crew#sections`
                        : `/movies/${id}?section=crew&showAllCrew=1#sections`
                    }
                    className="text-xs font-medium text-emerald-400 hover:underline"
                  >
                    {showAllCrew ? "Show less" : "Show all crew"}
                  </Link>
                </div>
              )}
            </div>
          )}

          {currentSection === "details" && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
                  Languages
                </h3>
                <p className="text-sm text-slate-300">
                  {movie.spoken_languages
                    ?.map((l) => l.english_name || l.name)
                    .join(", ") || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
                  Studios
                </h3>
                <p className="text-sm text-slate-300">
                  {studios.map((s) => s.name).join(", ") || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
                  Countries
                </h3>
                <p className="text-sm text-slate-300">
                  {movie.production_countries?.map((c) => c.name).join(", ") ||
                    "N/A"}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
                  Status
                </h3>
                <p className="text-sm text-slate-300">{movie.status}</p>
              </div>
            </div>
          )}

          {currentSection === "links" && (
            <div className="flex gap-4">
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  className="text-sm text-emerald-400 hover:underline"
                >
                  Official Website ↗
                </a>
              )}
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  className="text-sm text-emerald-400 hover:underline"
                >
                  IMDb Page ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
