/*
  Created By: Tanvi Agarwal
*/
//this is to display and create a new list to be used in profile
import { ObjectId } from "mongodb";
import {
  getListCollection,
  getFilmsCollection,
  getUsersCollection,
} from "@/db";


interface CreateListParams {
  username: string;
  name: string;
  description?: string;
  films: Array<{
    title: string;
    releaseYear?: number;
    posterUrl?: string;
  }>;
}


export async function createList({
  username,
  name,
  description,
  films,
}: CreateListParams) {
  if (!username || !name || !films || films.length === 0) {
    throw new Error("Missing required fields");
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ username });
  if (!user) throw new Error("User not found");

  const filmsCollection = await getFilmsCollection();
  const movieIds: ObjectId[] = [];

  for (const film of films) {
    const existing = await filmsCollection.findOne({ title: film.title });
    if (existing) {
      movieIds.push(existing._id!);
    } else {
      const insert = await filmsCollection.insertOne({
        title: film.title,
        releaseYear: film.releaseYear,
        posterUrl: film.posterUrl,
        averageRating: 0,
        totalRatings: 0,
      });
      movieIds.push(insert.insertedId);
    }
  }

  const lists = await getListCollection();
  const result = await lists.insertOne({
    userId: user._id,
    title: name,
    description: description || "",
    movies: movieIds,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return result.insertedId;
}


export async function getUserLists(username: string) {
  const users = await getUsersCollection();
  const user = await users.findOne({ username });
  if (!user) throw new Error("User not found");

  const lists = await getListCollection();
  return lists
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();
}
