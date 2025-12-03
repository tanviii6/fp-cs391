
import { NextResponse } from "next/server";
import { getUsersCollection } from "@/db";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email });

    return NextResponse.json(user || {});
}
