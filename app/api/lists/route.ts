/*
  Created By: Tanvi Agarwal
*/
import { NextResponse } from "next/server";
import { createList, getUserLists } from "@/lib/lists";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, name, description, films } = body;


    if (!username || !name || !films || films.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }


    const id = await createList({ username, name, description, films });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("Error creating list:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username query parameter is required" },
        { status: 400 }
      );
    }

    const lists = await getUserLists(username);
    return NextResponse.json({ lists });
  } catch (err: any) {
    console.error("Error fetching lists:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
