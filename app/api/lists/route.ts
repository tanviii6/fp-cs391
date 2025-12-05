import { NextResponse } from "next/server";
import { createList, getUserLists } from "@/lib/lists";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    // todo: shoudl we prompt it to login and setup if fields dont exist?
    if (!body.username || !body.name || !body.films) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await createList(body);

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
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const lists = await getUserLists(username || "");
  return NextResponse.json({ lists });
}