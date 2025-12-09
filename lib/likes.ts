/*
  Created By: Christian Gonzalez
*/

"use server";

import { getLikesCollection } from "@/db";
import { ObjectId } from "mongodb";

const LIKES_COLLECTION = await getLikesCollection();

// checks if a film is liked by a user
export async function isFilmLiked(
  filmId: string,
  userId: string,
): Promise<boolean> {
  const likedFilm = await LIKES_COLLECTION.findOne({
    filmId: new ObjectId(filmId),
    userId: new ObjectId(userId),
  });
  return !!likedFilm;
}

// creating this function as a toggle rather than splitting it up into two functions
export async function toggleLike(filmId: string, userId: string) {
  // if film exists in LIKES_COLLECTION then we remove it from the collection and vice versa
  const likedFilm = await LIKES_COLLECTION.findOne({
    filmId: new ObjectId(filmId),
    userId: new ObjectId(userId),
  });

  if (likedFilm) {
    try {
      await LIKES_COLLECTION.deleteOne({
        filmId: new ObjectId(filmId),
        userId: new ObjectId(userId),
      });
      console.log(`User: ${userId} unliked film with id: ${filmId}`);
      return { success: true };
    } catch (e) {
      console.error("error unliking film", e);
      return { success: false, error: "failed to unlike film" };
    }
  } else {
    // liked film does not exist in collection so just add it
    try {
      await LIKES_COLLECTION.insertOne({
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        filmId: new ObjectId(filmId),
        createdAt: new Date(),
      });
      return { success: true };
    } catch (e) {
      console.error("error liking film", e);
      return { success: false, error: "failed to like film" };
    }
  }
}
