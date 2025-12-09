import { NextResponse } from "next/server";
import { getUsersCollection, getFilmsCollection, getWatchedCollection, getLikesCollection } from "@/db";
import { ObjectId } from "mongodb";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, tmdbId, title, releaseYear, posterUrl, liked } = body;

    if (!username || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ username });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const films = await getFilmsCollection();
    let film =
      tmdbId != null
        ? await films.findOne({ tmdbId })
        : await films.findOne({ title });

    if (!film) {
      const insert = await films.insertOne({
        tmdbId: tmdbId ?? undefined,
        title,
        releaseYear,
        posterUrl,
        averageRating: 0,
        totalRatings: 0,
      });
      film = await films.findOne({ _id: insert.insertedId });
    }

    if (!film) throw new Error("Failed to find or create film");

    const watched = await getWatchedCollection();
    const likes = await getLikesCollection();

    const existingWatched = await watched.findOne({
      userId: user._id,
      filmId: film._id,
    });

    if (existingWatched) {
      await watched.updateOne(
        { userId: user._id, filmId: film._id },
        { $set: { loggedAt: new Date(), isFavorite: !!liked } },
      );
    } else {
      await watched.insertOne({
        userId: user._id,
        filmId: film._id,
        loggedAt: new Date(),
        isFavorite: !!liked,
      });
    }

    if (liked) {
      await likes.updateOne(
        { userId: user._id, filmId: film._id },
        { $set: { createdAt: new Date() } },
        { upsert: true },
      );
    }

    return NextResponse.json({ success: true, filmId: film._id });
  } catch (err: any) {
    console.error("Error in POST /api/watched:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const likedOnly = searchParams.get("liked") === "true";

    if (!username) {
      return NextResponse.json(
        { error: "Username query parameter is required" },
        { status: 400 },
      );
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ username });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const watched = await getWatchedCollection();
    const filmsCollection = await getFilmsCollection();

    const query: Record<string, any> = { userId: user._id };
    if (likedOnly) query.isFavorite = true;

    const watchedDocs = await watched.find(query).sort({ loggedAt: -1 }).toArray();

    const filmIds = watchedDocs.map((w) => w.filmId);
    if (filmIds.length === 0) return NextResponse.json({ films: [] });

    const films = await filmsCollection
      .find({ _id: { $in: filmIds } })
      .project({ title: 1, posterUrl: 1, releaseYear: 1, averageRating: 1, tmdbId: 1 })
      .toArray();

    return NextResponse.json({ films });
  } catch (err: any) {
    console.error("Error in GET /api/watched:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
