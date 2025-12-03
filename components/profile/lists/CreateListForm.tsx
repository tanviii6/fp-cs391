/*
  Created By: Christian Gonzalez
*/

"use client";

import { Button } from "@/components/ui/button";
import FilmListItem from "@/components/profile/lists/FilmListItem";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import Link from "next/link";
import { searchMovies } from "@/lib/tmdb";
import { TMDBMovieListItem } from "@/types/schemas";

const listSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  films: z
    .array(
      z.object({
        title: z.string(),
        releaseYear: z.number().optional(),
        posterUrl: z.string().optional(),
      })
    )
    .min(1, "You must add at least one film to your list"),
});

type ListFormData = z.infer<typeof listSchema>;

export default function CreateListForm({ username }: { username: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [films, setFilms] = useState<
    Array<{
      id?: number;
      title: string;
      releaseYear?: number;
      posterUrl?: string;
    }>
  >([]);
  const [filmInput, setFilmInput] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovieListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (filmInput.trim().length > 2) {
        setIsSearching(true);
        try {
          const response = await searchMovies(filmInput.trim());
          console.log(response);
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

  const handleAddFilm = () => {
    if (filmInput.trim()) {
      setFilms([
        ...films,
        {
          title: filmInput.trim(),
        },
      ]);
      setFilmInput("");
      setShowResults(false);
    }
  };

  const handleSelectResult = (movie: TMDBMovieListItem) => {
    const year = movie.release_date
      ? Number(movie.release_date.split("-")[0]) // e.g. release_date = "2002-07-07"
      : undefined;
    setFilms([
      ...films,
      {
        id: movie.id,
        title: movie.title,
        releaseYear: year,
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : undefined,
      },
    ]);
    setFilmInput("");
    setShowResults(false);
  };

  const handleRemoveFilm = (index: number) => {
    setFilms(films.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: ListFormData = {
      name,
      description: description || undefined,
      films,
    };

    const result = listSchema.safeParse(formData);

    if (!result.success) {
      console.error("Validation errors:", result.error);
      return;
    }

    // TODO: add list to db
    console.log("Form data:", result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <section>
        <div
          id="content-nav"
          className="mb-[15px] border-b border-[#456] text-[13px] leading-none text-[#abc] min-h-[30px] relative"
        >
          <h1 className="border-none m-0 pt-2.5 text-2xl">
            <span>New List</span>
          </h1>
        </div>
      </section>
      <div className="flex flex-col mb-5">
        <div className="max-w-full">
          <div className="relative mb-5">
            <label className="block relative text-white text-sm mb-1 leading-normal font-normal">
              <span className="text-red-500 text-xs pr-1">*</span>
              Name
            </label>
            <input
              className="block w-1/4 mt-1.5 p-2 border-none bg-[#2c3440] text-[#89a] text-sm leading-none rounded-sm shadow-[inset_0_-1px_#456] focus:bg-white focus:text-[#234] focus:outline-none"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="relative mb-3">
            <label className="block relative text-white text-sm mb-1 leading-normal font-normal">
              Description
            </label>
            <textarea
              className="w-full min-h-32 mt-1.5 p-2 border-none bg-[#2c3440] text-[#89a] text-sm leading-none rounded-sm shadow-[inset_0_-1px_#456] focus:bg-white focus:text-[#234] focus:outline-none"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="h-[72px] w-full relative z-10">
        <div className="py-5 border-b border-transparent overflow-visible relative z-10">
          <div
            className="float-left m-0 relative z-20"
            ref={searchContainerRef}
          >
            <button
              type="button"
              onClick={handleAddFilm}
              className="float-left leading-3 appearance-none inline-block tracking-[.075em] font-bold border-none w-28 text-center
              py-2 px-0 text-white bg-[#00ac1c] rounded-l-[2px] shadow-[inset_0_1px_rgba(255,255,255,0.3)]"
            >
              ADD FILM
            </button>
            <div className="relative float-left">
              <input
                className="py-2 px-[9px] w-3xs max-h-7 float-left m-0 bg-[#2c3440] text-[#89a] rounded-xs rounded-l-none border-none shadow-[inset_0_-1px_#456] focus:bg-white focus:text-[#234] focus:outline-none"
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
                <div className="absolute top-full left-0 mt-1 w-[256px] max-h-[180px] overflow-y-auto bg-[#2c3440] border border-[#456] rounded-sm shadow-lg z-9999">
                  {isSearching ? (
                    <div className="p-3 text-[#89a] text-sm text-center">
                      Searching...
                    </div>
                  ) : (
                    <ul className="list-none m-0 p-0">
                      {searchResults.map((movie) => {
                        const year = movie.release_date
                          ? new Date(movie.release_date)
                              .getFullYear()
                              .toString()
                          : null;
                        return (
                          <li
                            key={movie.id}
                            onClick={() => handleSelectResult(movie)}
                            className="px-3 py-2 text-sm text-[#89a] hover:bg-[#3a4450] hover:text-white cursor-pointer border-b border-[#345] last:border-b-0"
                          >
                            <span className="font-medium">{movie.title}</span>
                            {year && (
                              <span className="text-[#678]"> ({year})</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="float-right m-0 p-0">
            <Button
              type="button"
              className="ml-1 max-h-7 pt-[9px] pb-2 px-3 text-white bg-[#456] shadow-[inset_0_1px_rgba(255,255,255,0.3)] tracking-[.075em] rounded-smh hover:bg-[#678]"
            >
              <Link href={`/${username}/lists/`}>CANCEL</Link>
            </Button>
            <Button
              type="submit"
              className="ml-1 max-h-7 pt-[9px] pb-2 px-3 text-white bg-[#00ac1c] shadow-[inset_0_1px_rgba(255,255,255,0.3)] tracking-[.075em] rounded-smh hover:bg-[#009d1a]"
            >
              SAVE
            </Button>
          </div>
        </div>
      </div>
      {films.length === 0 ? (
        <div className="clear-both m-auto float-none relative z-0">
          <ul className="relative left-auto bottom-auto border border-[#345] text-[#89a] p-0 m-0 rounded-sm w-full list-none ">
            <li className="border-t-0 m-0 pt-10 pb-[50px] px-2.5">
              <p className="m-0 mx-auto w-[500px] border-none bg-none text-center py-4">
                <strong className="mt-1 mb-2 block text-xl">
                  Your list is empty.
                </strong>
                <span>Add films using the field above</span>
              </p>
            </li>
          </ul>
        </div>
      ) : (
        <div className="clear-both m-auto float-none relative z-0">
          <ul className="relative left-auto bottom-auto border border-[#345] text-[#89a] p-0 m-0 rounded-sm w-full list-none ">
            {films.map((film, index) => (
              <FilmListItem
                key={index}
                film={film}
                onRemove={() => handleRemoveFilm(index)}
              />
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
