/*
  Created By: Christian Gonzalez
*/

"use server";

import { getWatchedCollection } from "@/db";
import { Watched } from "@/types/schemas";
import { ObjectId } from "mongodb";

const WATCHED_COLLECTION = await getWatchedCollection();

export async function getLoggedFilm(
  userId: ObjectId,
  filmId: ObjectId,
): Promise<Watched | void> {
  const loggedFilm = await WATCHED_COLLECTION.findOne({
    userId: userId,
    filmId: filmId,
  });

  if (!loggedFilm) {
    return; // silent exit
  } else {
    return loggedFilm;
  }
}

export async function logFilm(
  filmId: string,
  userId: string,
  rating?: number,
): Promise<{ success: boolean }> {
  try {
    const filmObjectId = new ObjectId(filmId);
    const userObjectId = new ObjectId(userId);
    const currentDate = new Date();

    // check if logged film already exists
    const existingLog = await WATCHED_COLLECTION.findOne({
      userId: userObjectId,
      filmId: filmObjectId,
    });

    if (existingLog) {
      // logged film already exists, just update rating
      await WATCHED_COLLECTION.updateOne(
        { userId: userObjectId, filmId: filmObjectId },
        { $set: { rating: rating } },
      );
      return { success: true };
    } else {
      // film does not exist in db yet, so add with rating
      const loggedFilm: Watched = {
        _id: new ObjectId(),
        userId: userObjectId,
        filmId: filmObjectId,
        rating: rating,
        loggedAt: currentDate,
      };
      await WATCHED_COLLECTION.insertOne(loggedFilm);
      console.log(`logged filmId: ${filmId} for user: ${userId}`);
      return { success: true };
    }
  } catch (e) {
    console.error("error logging film", e);
    return { success: false };
  }
}

export async function favoriteFilm(
  filmId: string,
  userId: string,
): Promise<void> {
  try {
    const filmObjectId = new ObjectId(filmId);
    const userObjectId = new ObjectId(userId);

    const loggedFilm: Watched | null = await WATCHED_COLLECTION.findOne({
      userId: userObjectId,
      filmId: filmObjectId,
    });

    if (loggedFilm) {
      await WATCHED_COLLECTION.updateOne(
        { userId: userObjectId, filmId: filmObjectId },
        { $set: { isFavorite: true } },
      );
      console.log("previously logged film favorited");
    } else {
      // film hasn't been logged, so we'll add with undefined rating
      await WATCHED_COLLECTION.insertOne({
        _id: new ObjectId(),
        userId: userObjectId,
        filmId: filmObjectId,
        rating: undefined,
        isFavorite: true,
        loggedAt: new Date(),
      });
      console.log("new film logged and favorited with no ratings");
    }
  } catch (e) {
    console.error("error favoriting film:", e);
  }
}
