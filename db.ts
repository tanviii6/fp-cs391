import { MongoClient, Db, Collection } from "mongodb";
import { User, Film, Watched, Like, List, Collections } from "@/types/schemas";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not set");
}

const DB_NAME = "movieboxd";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connect(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedDb && cachedClient) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGO_URI!);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(DB_NAME);

  return { client: cachedClient, db: cachedDb };
}

async function getCollection<Name extends keyof Collections>(
  collectionName: Name,
): Promise<Collections[Name]> {
  const { db } = await connect();
  return db.collection(collectionName) as Collections[Name];
}

export async function getUsersCollection(): Promise<Collection<User>> {
  return getCollection("USERS_COLLECTION");
}

export async function getFilmsCollection(): Promise<Collection<Film>> {
  return getCollection("FILMS_COLLECTION");
}

export async function getWatchedCollection(): Promise<Collection<Watched>> {
  return getCollection("WATCHED_COLLECTION");
}

export async function getListCollection(): Promise<Collection<List>> {
  return getCollection("LIST_COLLECTION");
}

export async function getLikesCollection(): Promise<Collection<Like>> {
  return getCollection("LIKES_COLLECTION");
}
