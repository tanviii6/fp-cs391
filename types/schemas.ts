import { ObjectId, Document, Collection } from "mongodb";

export interface User extends Document {
  _id?: ObjectId;
  avatar?: string;
  bio?: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Movie extends Document {
  _id?: ObjectId;
  tmdbId?: number;
  title: string;
  releaseYear?: number;
  posterUrl?: string;
  director?: string;
  synopsis?: string;
  runtimeMinutes?: number;
  genres?: string[];
  averageRating: number;
  totalRatings: number;
}

export interface Watched extends Document {
  _id?: ObjectId;
  userId: ObjectId;
  movieId: ObjectId;
  watchedDate: Date;
  rating?: number | null; // 0-5 or null
  isFavorite: boolean;
  loggedAt: Date;
}

export interface Like extends Document {
  _id?: ObjectId;
  userId: ObjectId;
  movieId: ObjectId;
  createdAt: Date;
}

export interface List extends Document {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  movies: ObjectId[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collections {
  USERS_COLLECTION: Collection<User>;
  MOVIES_COLLECTION: Collection<Movie>;
  WATCHED_COLLECTION: Collection<Watched>;
  LIST_COLLECTION: Collection<List>;
  LIKES_COLLECTION: Collection<Like>;
}
