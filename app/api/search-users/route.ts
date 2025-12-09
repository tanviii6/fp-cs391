/*
  Created By: Tanvi Agarwal
*/
import { NextResponse } from "next/server";
import { getUsersCollection } from "@/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ users: [] });
    }

    const usersCollection = await getUsersCollection();

    const users = await usersCollection
      .find(
        {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
        {
          projection: {
            _id: 1,
            username: 1,
            name: 1,
            avatar: 1,
            bio: 1,
          },
        }
      )
      .limit(10)
      .toArray();

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Error searching users:", err);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
