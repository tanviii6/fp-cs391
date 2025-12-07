/*
  Created By: Ron Bajrami and Jude Hosmer
  Movie page for a single film. Basically fetches data from TMDB, save a film record, and show tabs for cast, crew, details, and links
*/

import Image from "next/image"
import Link from "next/link"
import MovieLogger from "@/components/movies/MovieLogger"
import StarDisplay from "@/components/ratings/StarDisplay"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { addFilm, getFilmByTmdbId } from "@/lib/films"
import { isFilmLiked } from "@/lib/likes"
import { getMovieDetails } from "@/lib/tmdb"
import { getCurrentUser } from "@/lib/users"
import { getLoggedFilm } from "@/lib/watched"
import type { Film, TMDBCastMember, TMDBCrewMember } from "@/types/schemas"
import { ObjectId } from "mongodb"

type MoviePageProps = {
  // In this Next version params and searchParams are Promises on this async route, so we await them at the top of the component
  params: Promise<{ id: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

// Config for the simple tab navigation
const sectionLinks = [
  { key: "cast", label: "Cast" },
  { key: "crew", label: "Crew" },
  { key: "details", label: "Details" },
  { key: "links", label: "Links" },
]

export default async function MoviePage({ params, searchParams }: MoviePageProps) {
  // Wait for the route params and query string info
  const { id } = await params
  const resolvedSearchParams = (await searchParams) ?? {}

  // Figure out which section tab should be active, default to cast
  const rawSection = resolvedSearchParams["section"]
  const section =
    typeof rawSection === "string" ? rawSection.toLowerCase() : "cast"

  const validSections = ["cast", "crew", "details", "links"]
  const currentSection = validSections.includes(section) ? section : "cast"

  // Simple flags to control if we show the full cast or crew lists
  // These come from the query string as showAllCast and showAllCrew
  const rawShowAllCast = resolvedSearchParams["showAllCast"]
  const rawShowAllCrew = resolvedSearchParams["showAllCrew"]

  const showAllCast =
    typeof rawShowAllCast === "string" && rawShowAllCast === "1"
  const showAllCrew =
    typeof rawShowAllCrew === "string" && rawShowAllCrew === "1"

  // Check if a user is logged in, used for likes and watched status
  const session = await auth()
  const userEmail = session?.user?.email ?? null
  const user = userEmail ? await getCurrentUser(userEmail) : undefined

  // Fetch movie info from TMDB
  const movie = await getMovieDetails(id).catch(() => null)

  if (!movie) {
    notFound()
  }

  // Basic fields for the UI
  const releaseYear = movie.release_date?.split("-")[0]
  const crew = movie.credits?.crew ?? []
  const cast = movie.credits?.cast ?? []
  const directors = crew.filter((member: TMDBCrewMember) => member.job === "Director")

  // Studios for the details tab
  const studios = movie.production_companies ?? []

  // Film record we store in Mongo so the logger has an id to work with
  const filmRecord: Film = {
    _id: new ObjectId(),
    tmdbId: movie.id,
    title: movie.title,
    releaseYear: releaseYear ? Number(releaseYear) : undefined,
    posterUrl: movie.poster_path || undefined,
    directors,
    synopsis: movie.overview,
    runtimeMinutes: movie.runtime,
    genres: movie.genres,
    averageRating: movie.vote_average,
    totalRatings: movie.vote_count,
  }

  // Save film, then read it back to get the real Mongo id
  await addFilm(filmRecord)
  const actualFilm = await getFilmByTmdbId(movie.id)

  // Prefill MovieLogger with watched status, like, and rating for this user and film
  let initialData: { isWatched: boolean; isLiked: boolean; rating: number } | undefined
  if (user?._id && actualFilm?._id) {
    const loggedFilm = await getLoggedFilm(user._id, actualFilm._id)
    const liked = await isFilmLiked(actualFilm._id.toString(), user._id.toString())

    initialData = {
      isWatched: Boolean(loggedFilm),
      isLiked: liked,
      rating: loggedFilm?.rating || 0,
    }
  }

  // By default only show the first 20 cast and crew entries. Only show the first 20 cast/crew on the page unless the user requests "show all"
  const visibleCast = showAllCast ? cast : cast.slice(0, 20)
  const visibleCrew = showAllCrew ? crew : crew.slice(0, 20)

  // Data for the Details tab
  const detailItems = [
    {
      label: "Languages",
      value: movie.spoken_languages?.map((l) => l.english_name || l.name).join(", ") || "N/A",
    },
    { label: "Studios", value: studios.map((s) => s.name).join(", ") || "N/A" },
    {
      label: "Countries",
      value: movie.production_countries?.map((c) => c.name).join(", ") || "N/A",
    },
    { label: "Status", value: movie.status },
  ]

  return (
    <div className="min-h-screen bg-[#14181C] text-slate-50 font-sans">
      {/* Backdrop hero at the top with a gradient layer to keep text readable */}
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

        <div className="absolute inset-0 bg-linear-to-t from-[#14181C] via-[#14181C]/75 to-transparent" />

        {/* Simple back link bar at the top */}
        <div className="absolute top-0 left-0 z-20 w-full px-6 py-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* Main content area to show poster, info, and the MovieLogger card */}
      <div className="relative z-10 mx-auto -mt-64 flex max-w-6xl flex-col gap-8 px-6 pb-20 md:flex-row md:items-start">
        {/* Poster column */}
        <div className="shrink-0">
          <div className="relative aspect-2/3 w-[200px] overflow-hidden rounded-lg bg-slate-900 shadow-xl">
            <Image
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://placehold.co/600x900/0f172a/94a3b8.png?text=No+Poster"
              }
              alt={movie.title}
              width={300}
              height={450}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Info plus logger column */}
        <div className="flex flex-row">
          {/* Text info on the left */}
          <div className="flex flex-1 flex-col pt-4 text-slate-100 md:pt-12">
            <h1 className="mb-2 text-4xl font-bold leading-tight md:text-5xl">
              {movie.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
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

            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  {movie.vote_average.toFixed(1)}
                </span>
                <StarDisplay rating={movie.vote_average} size={16} className="text-amber-400" />
              </div>

              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {movie.tagline && (
              <p className="mb-3 text-sm font-medium italic text-emerald-400">
                {movie.tagline}
              </p>
            )}

            <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
              {movie.overview || "No overview available."}
            </p>
          </div>

          {/* MovieLogger component so the user can mark watched, liked, and rate */}
          <MovieLogger
            user={user ? { ...user, _id: user._id?.toString() } : undefined}
            film={{ ...filmRecord, _id: actualFilm?._id?.toString() }}
            initialData={initialData}
          />
        </div>
      </div>

      {/* Tab navigation with content for cast, crew, details, and links */}
      <div className="mx-auto max-w-6xl px-6 pb-24" id="sections">
        <nav className="mb-8 flex gap-6 border-b border-slate-800 pb-1">
          {sectionLinks.map((item) => {
            const isActive = currentSection === item.key
            return (
              <Link
                key={item.key}
                href={`/movies/${id}?section=${item.key}#sections`}
                className={`pb-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-emerald-500 text-emerald-400"
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="min-h-[200px]">
          {/* Cast tab */}
          {currentSection === "cast" && (
            <div>
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {cast.length ? (
                  visibleCast.map((member: TMDBCastMember) => (
                    <span
                      key={member.id}
                      className="inline-flex items-center rounded border border-[#2c3542] bg-[#1c2430] px-2 py-1 text-xs text-slate-200 shadow-sm"
                    >
                      <span className="mr-1 text-slate-50">{member.name}</span>
                      {member.character && (
                        <span className="max-w-[150px] truncate text-slate-400">
                          {" "}
                          as {member.character}
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">No cast information.</span>
                )}
              </div>
              {cast.length > visibleCast.length && (
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

          {/* Crew tab */}
          {currentSection === "crew" && (
            <div>
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {crew.length ? (
                  visibleCrew.map((member: TMDBCrewMember) => (
                    <span
                      key={`${member.id}-${member.job}`}
                      className="inline-flex items-center rounded border border-[#2c3542] bg-[#1c2430] px-2 py-1 text-xs text-slate-200 shadow-sm"
                    >
                      <span className="mr-1 text-slate-50">{member.name}</span>
                      {member.job && <span className="text-slate-400"> - {member.job}</span>}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">No crew information.</span>
                )}
              </div>
              {crew.length > visibleCrew.length && (
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

          {/* Details tab */}
          {currentSection === "details" && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {detailItems.map((item) => (
                <div key={item.label}>
                  <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
                    {item.label}
                  </h3>
                  <p className="text-sm text-slate-300">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Links tab */}
          {currentSection === "links" && (
            <div className="flex gap-4">
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  className="text-sm text-emerald-400 hover:underline"
                  rel="noreferrer"
                >
                  Official Website ↗
                </a>
              )}
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  className="text-sm text-emerald-400 hover:underline"
                  rel="noreferrer"
                >
                  IMDb Page ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
