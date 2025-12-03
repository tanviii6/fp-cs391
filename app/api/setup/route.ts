import { NextResponse } from "next/server";
import { getUsersCollection } from "@/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { name, username, bio, avatar, email } = await req.json();
    const usersCollection = await getUsersCollection();

    const existingUsername = await usersCollection.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const newUser = {
      _id: new ObjectId(),
      name,
      username,
      bio,
      avatar,
      email,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("eror!", err);
    return NextResponse.json({ error: "Error setting up your profile" }, { status: 500 });
  }
}
