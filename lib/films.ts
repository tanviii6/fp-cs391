/*
  Created By: Christian Gonzalez
*/

"use server";

import { getFilmsCollection } from "@/db";
import { Film, SerializedFilm } from "@/types/schemas";

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

// retrieves a film from our FILMS_COLLECTION via a tmdbId
export async function getFilmByTmdbId(tmdbId: number): Promise<Film | null> {
  return await FILMS_COLLECTION.findOne({ tmdbId: tmdbId });
}

// this function will return a film either from our db or by inserting a newFilm
// into our db and returning this new object.
export async function getOrCreateFilmFromTmdb(
  tmdbId: number,
): Promise<SerializedFilm | null> {
  // check if film already exists
  const film = await getFilmByTmdbId(tmdbId);

  if (film) {
    return {
      ...film,
      _id: film._id?.toString(),
    };
  }

  // film doesn't exist, create it
  const { getMovieDetails } = await import("@/lib/tmdb");
  const { ObjectId } = await import("mongodb");

  const movieDetails = await getMovieDetails(tmdbId);
  const releaseYear = movieDetails.release_date
    ? Number(movieDetails.release_date.split("-")[0])
    : undefined;
  const directors =
    movieDetails.credits?.crew?.filter((person) => person.job === "Director") ||
    [];

  const newFilm: Film = {
    _id: new ObjectId(),
    tmdbId: movieDetails.id,
    title: movieDetails.title,
    releaseYear: releaseYear,
    posterUrl: movieDetails.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
      : undefined,
    directors: directors,
    synopsis: movieDetails.overview,
    runtimeMinutes: movieDetails.runtime,
    genres: movieDetails.genres,
    averageRating: movieDetails.vote_average,
    totalRatings: movieDetails.vote_count,
  };

  // call then retrieve our new film
  await addFilm(newFilm);
  const createdFilm = await getFilmByTmdbId(tmdbId);

  if (!createdFilm) {
    return null;
  }

  return {
    ...createdFilm,
    _id: createdFilm._id?.toString(),
  };
}
