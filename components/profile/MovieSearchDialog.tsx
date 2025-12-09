/*
  Created By: Christian Gonzalez
*/

"use client";

import { useState, useEffect, useRef } from "react";
import { searchMovies } from "@/lib/tmdb";
import { getOrCreateFilmFromTmdb } from "@/lib/films";
import { favoriteFilm } from "@/lib/watched";
import { TMDBMovieListItem } from "@/types/schemas";
import { useRouter } from "next/navigation";

export default function MovieSearchDialog({ userId }: { userId: string }) {
  const [filmInput, setFilmInput] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovieListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // debounced search function
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
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [filmInput]);

  // handle clicking outside to close dropdown using ref
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

  const handleSelectResult = async (movie: TMDBMovieListItem) => {
    setIsFavoriting(true);
    try {
      // get or create film
      const film = await getOrCreateFilmFromTmdb(movie.id);

      if (!film || !film._id) {
        alert("Failed to create or find film");
        return;
      }

      // call favoriteFilm directly
      await favoriteFilm(film._id, userId);

      setFilmInput("");
      setShowResults(false);
      router.refresh();
    } catch (error) {
      console.error("Error favoriting film:", error);
      alert("Failed to favorite film");
    } finally {
      setIsFavoriting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="relative" ref={searchContainerRef}>
        <input
          className="w-full py-2 px-3 bg-[#2c3440] text-[#89a] rounded-sm border-none shadow-[inset_0_-1px_#456] focus:bg-white focus:text-[#234] focus:outline-none"
          placeholder="Search for a movie..."
          value={filmInput}
          onChange={(e) => {
            setFilmInput(e.target.value);
          }}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true);
            }
          }}
        />
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-full max-h-[180px] overflow-y-auto bg-[#2c3440] border border-[#456] rounded-sm shadow-lg z-50">
            {isSearching ? (
              <div className="p-3 text-[#89a] text-sm text-center">
                Searching...
              </div>
            ) : (
              <ul className="list-none m-0 p-0">
                {searchResults.map((movie) => {
                  const year = movie.release_date
                    ? new Date(movie.release_date).getFullYear().toString()
                    : null;
                  return (
                    <li
                      key={movie.id}
                      onClick={() => !isFavoriting && handleSelectResult(movie)}
                      className={`px-3 py-2 text-sm text-[#89a] hover:bg-[#3a4450] hover:text-white border-b border-[#345] last:border-b-0 ${
                        isFavoriting
                          ? "cursor-wait opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <span className="font-medium">{movie.title}</span>
                      {year && <span className="text-[#678]"> ({year})</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
        {isFavoriting && (
          <div className="mt-2 text-sm text-[#9ab] text-center">
            Adding to favorites...
          </div>
        )}
      </div>
    </div>
  );
}
