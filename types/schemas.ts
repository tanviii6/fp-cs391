/*
  Created By: Christian Gonzalez
*/

import { ObjectId, Document, Collection } from "mongodb";

// MONGODB SCHEMAS

export interface User extends Document {
  _id?: ObjectId;
  avatar?: string;
  bio?: string;
  name: string;
  username?: string; // optional - users start without one until /setup
  email: string;
  createdAt: Date;
}

export interface Film extends Document {
  _id?: ObjectId;
  tmdbId?: number;
  title: string;
  releaseYear?: number;
  posterUrl?: string;
  directors?: TMDBCrewMember[];
  synopsis?: string;
  runtimeMinutes?: number;
  genres?: TMDBMovieDetails["genres"];
  averageRating: number;
  totalRatings: number;
}

export interface Watched extends Document {
  _id?: ObjectId;
  userId: ObjectId;
  filmId: ObjectId;
  rating?: number; // 0-5 or null
  isFavorite?: boolean;
  loggedAt: Date;
}

export interface Like extends Document {
  _id?: ObjectId;
  userId: ObjectId;
  filmId: ObjectId;
  createdAt: Date;
}

export interface List extends Document {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  movies: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Collections {
  USERS_COLLECTION: Collection<User>;
  FILMS_COLLECTION: Collection<Film>;
  WATCHED_COLLECTION: Collection<Watched>;
  LIST_COLLECTION: Collection<List>;
  LIKES_COLLECTION: Collection<Like>;
}

// TMDB SCHEMAS

export interface TMDBSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// this is what the search results array endpoint returns for films
// will be used in conjunction with the TMDBSearchResponse
export interface TMDBMovieListItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// all the data returned from the TMDB details endpoint
// most of this won't be used but it's nice to know its there if we wanna use it
export interface TMDBMovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string | null;
  id: number; // tmdb id
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credits?: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  order: number;
  popularity: number;
  profile_path: string | null;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

// i tried passing in the full user type to a client component but i received an error
// complaining about the _id type being an ObjectId. Next.js didn't like this, so i created this
// SerializedUser type that extends the user type and replaces _id?: ObjectId with _id?: string
// so we can use a hex string for the _id instead
export interface SerializedUser extends Omit<User, "_id"> {
  _id?: string;
}

// same for Film - we need a serialized version for client components
export interface SerializedFilm extends Omit<Film, "_id"> {
  _id?: string;
}
