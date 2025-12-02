"use client";

import { Button } from "@/components/ui/button";
import FilmListItem from "@/components/profile/lists/FilmListItem";
import { useState } from "react";
import { z } from "zod";

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

export default function CreateListPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [films, setFilms] = useState<
    Array<{
      title: string;
      releaseYear?: number;
      posterUrl?: string;
    }>
  >([]);
  const [filmInput, setFilmInput] = useState("");

  // TODO: implement tmdb api call to get film data and implement search
  const handleAddFilm = () => {
    if (filmInput.trim()) {
      setFilms([
        ...films,
        {
          title: filmInput.trim(),
        },
      ]);
      setFilmInput("");
    }
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

    console.log("Form data:", result.data);
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setFilms([]);
    setFilmInput("");
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
      <div className="h-[72px] w-full">
        <div className="py-5 border-b border-transparent overflow-hidden">
          <div className="float-left m-0">
            <button
              type="button"
              onClick={handleAddFilm}
              className="float-left leading-3 appearance-none inline-block tracking-[.075em] font-bold border-none w-28 text-center
              py-2 px-0 text-white bg-[#00ac1c] rounded-l-[2px] shadow-[inset_0_1px_rgba(255,255,255,0.3)]"
            >
              ADD FILM
            </button>
            <input
              className="py-2 px-[9px] w-3xs max-h-7 float-left m-0 bg-[#2c3440] text-[#89a] rounded-xs rounded-l-none border-none shadow-[inset_0_-1px_#456] focus:bg-white focus:text-[#234] focus:outline-none"
              value={filmInput}
              onChange={(e) => {
                setFilmInput(e.target.value);
              }}
            />
          </div>
          <div className="float-right m-0 p-0">
            <Button
              type="button"
              onClick={handleCancel}
              className="ml-1 max-h-7 pt-[9px] pb-2 px-3 text-white bg-[#456] shadow-[inset_0_1px_rgba(255,255,255,0.3)] tracking-[.075em] rounded-smh hover:bg-[#678]"
            >
              CANCEL
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
        <div className="clear-both m-auto float-none">
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
        <div className="clear-both m-auto float-none ">
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
