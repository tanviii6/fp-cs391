import { NextResponse } from "next/server";
import { getUsersCollection } from "@/db";
import { ObjectId } from "mongodb";
import { User } from "@/types/schemas";

export async function POST(req: Request) {
  try {
    const { name, username, bio, email, avatar } = await req.json();
    const usersCollection = await getUsersCollection();

    const existingUsername = await usersCollection.findOne({
      username: username,
    });
    if (existingUsername && existingUsername.email !== email) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 },
      );
    }

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      // update existing user with username and other details
      await usersCollection.updateOne(
        { email },
        {
          $set: {
            name,
            username,
            bio,
            avatar,
          },
        },
      );
    } else {
      // create new user if somehow they don't exist yet
      const newUser: User = {
        _id: new ObjectId(),
        name,
        username,
        bio,
        avatar,
        email,
        createdAt: new Date(),
      };
      await usersCollection.insertOne(newUser);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("eror!", err);
    return NextResponse.json(
      { error: "Error setting up your profile" },
      { status: 500 },
    );
  }
}
