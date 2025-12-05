"use client";

import { searchMovies } from "@/lib/tmdb";
import { LikedOnlySwitch } from "./LikedFilmsSwitch";
import { Film, TMDBMovieListItem } from "@/types/schemas";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import MovieCard from "@/components/home/MovieCard";



interface FilmsSectionProps {
  username: string;
  films?: Film[];
  owner: boolean;
}



export default function ProfileFilmsSection({ username, films, owner }: FilmsSectionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterParam = searchParams.get("filter");
  const showLikedOnly = filterParam === "likes";

  const handleToggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("filter", "likes");
    } else {
      params.delete("filter");
    }

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
  };

  const [filmInput, setFilmInput] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovieListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (filmInput.trim().length > 2) {
        setIsSearching(true);
        try {
          const response = await searchMovies(filmInput.trim());
          setSearchResults(response.results.slice(0, 10));
          setShowResults(true);
        } catch (error) {
          console.error("Error searching movies:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filmInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  const handleAddFilm = async (movie: TMDBMovieListItem, liked: boolean) => {
    try {
      const year = movie.release_date
        ? Number(movie.release_date.split("-")[0])
        : undefined;
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : undefined;

      const res = await fetch("/api/watched", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          tmdbId: movie.id,
          title: movie.title,
          releaseYear: year,
          posterUrl,
          liked,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error adding watched film:", err);
        return;
      }

      console.log("Successfully added film:", movie.title);
      setFilmInput("");
      setShowResults(false);
      await fetchFilms();
    } catch (err) {
      console.error("Unexpected error adding film:", err);
    }
  };

  const [watchedFilms, setWatchedFilms] = useState<any[]>([]);
const [loadingFilms, setLoadingFilms] = useState(false);

const fetchFilms = async () => {
  setLoadingFilms(true);
  try {
    const res = await fetch(
      `/api/watched?username=${username}${showLikedOnly ? "&liked=true" : ""}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    setWatchedFilms(data.films || []);
  } catch (err) {
    console.error("Error fetching watched films:", err);
  } finally {
    setLoadingFilms(false);
  }
};

useEffect(() => {
  fetchFilms();
}, [username, showLikedOnly]);


  return (
    <section>
      <div
        id="content-nav"
        className="mb-[15px] border-b border-[#456] text-[13px] leading-none text-[#678] min-h-[30px] relative"
      >
        <h1 className="border-none m-0 pt-2.5">
          <span>WATCHED</span>
        </h1>
        <div className="right-0 absolute top-0 z-0">
          <LikedOnlySwitch
            className="scale-75"
            checked={showLikedOnly}
            onToggle={handleToggle}
          />
        </div>
      </div>
      {owner && (
          <div className="h-[72px] w-full relative z-10" ref={searchContainerRef}>
            <div className="py-5 border-b border-transparent overflow-visible relative z-10">
              <div className="float-left m-0 relative z-20">
                <input
                  className="py-2 px-[9px] w-80 bg-[#2c3440] text-[#89a] rounded-xs border-none shadow-[inset_0_-1px_#456] focus:bg-white focus:text-[#234] focus:outline-none"
                  value={filmInput}
                  onChange={(e) => setFilmInput(e.target.value)}
                  placeholder="Search for a movie..."
                  onFocus={() => {
                    if (searchResults.length > 0) setShowResults(true);
                  }}
                />
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-[320px] max-h-[220px] overflow-y-auto bg-[#2c3440] border border-[#456] rounded-sm shadow-lg z-9999">
                    {isSearching ? (
                      <div className="p-3 text-[#89a] text-sm text-center">Searching...</div>
                    ) : (
                      <ul className="list-none m-0 p-0">
                        {searchResults.map((movie) => {
                          const year = movie.release_date
                            ? new Date(movie.release_date).getFullYear().toString()
                            : null;
                          return (
                            <li
                              key={movie.id}
                              className="px-3 py-2 text-sm text-[#89a] hover:bg-[#3a4450] hover:text-white cursor-pointer border-b border-[#345] last:border-b-0"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{movie.title}</span>
                                  {year && <span className="text-[#678]"> ({year})</span>}
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleAddFilm(movie, false)}
                                    className="bg-[#456] hover:bg-[#678] text-white text-xs px-2 py-1 rounded"
                                  >
                                    Watched
                                  </button>
                                  <button
                                    onClick={() => handleAddFilm(movie, true)}
                                    className="bg-[#00ac1c] hover:bg-[#009d1a] text-white text-xs px-2 py-1 rounded"
                                  >
                                    Like
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

     
      <div className="mt-8">
        {loadingFilms ? (
          <div className="text-[#89a] text-sm italic">Loading films...</div>
        ) : watchedFilms.length === 0 ? (
          <div className="text-center text-[#89a] text-sm italic">
            {showLikedOnly ? "No films liked so far." : "No films watched so far."}
          </div>
        ) : (
          <div className="space-y-10 mt-6">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-lg font-semibold text-white">
                {showLikedOnly ? "Liked Films" : "Watched Films"}
              </h2>
            </div>

            <div className="flex overflow-x-auto space-x-4 pb-3 scrollbar-thin scrollbar-thumb-[#345] scrollbar-track-transparent">
              {watchedFilms.map((film) => (
                <div key={film._id} className="flex-shrink-0 w-[176px]">
                  <MovieCard
                    id={film.tmdbId ?? film._id}
                    poster_path={film.posterUrl ?? null}
                    title={film.title}
                    average_rating={film.averageRating ?? 0}
                    release_date={
                      film.releaseYear
                        ? `${film.releaseYear}-01-01`
                        : "Unknown"
                    }
                    overview={""}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


    </section>
  );
}
