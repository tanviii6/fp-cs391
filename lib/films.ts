"use server";

import { getFilmsCollection } from "@/db";
import { Film } from "@/types/schemas";

const FILMS_COLLECTION = await getFilmsCollection();

export async function addFilm(film: Film): Promise<void> {
  // first we check if film already exists in our db
  if (await FILMS_COLLECTION.findOne({ tmdbId: film.tmdbId })) {
    console.log("film already exists");
    return; // exit early since we film exists in db
  } else {
    try {
      await FILMS_COLLECTION.insertOne(film); // adds film to our films collection
      console.log("film added");
    } catch (e) {
      console.error(e);
    }
  }
}

export async function getFilmByTmdbId(tmdbId: number): Promise<Film | null> {
  return await FILMS_COLLECTION.findOne({ tmdbId });
}
