'use client';

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { getUsersCollection } from "@/db";

export default function Header() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dbUser, setDbUser] = useState<{ username?: string } | null>(null);

    // Fetch the user from the DB on the client
    useEffect(() => {
        if (!session?.user?.email) return;

        const fetchUser = async () => {
            const res = await fetch(`/api/users?email=${session.user.email}`);
            if (res.ok) {
                const user = await res.json();
                setDbUser(user);
            }
        };

        fetchUser();
    }, [session?.user?.email]);

    const user = session?.user;
    const username = dbUser?.username;

    return (
        <header className="w-full border-b bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight">
                    FilmFlow
                </Link>

                {/* Nav */}
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/films" className="hover:text-gray-600">Films</Link>
                    <Link href="/lists" className="hover:text-gray-600">Lists</Link>
                </nav>

                {/* Auth Buttons */}
                <div className="relative">
                    {!user && (
                        <button
                            onClick={() => signIn("google")}
                            className="px-4 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
                        >
                            Sign In
                        </button>
                    )}

                    {user && (
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center">
                                <Image
                                    src={user.image || "/default-avatar.png"}
                                    alt="User Avatar"
                                    width={36}
                                    height={36}
                                    className="rounded-full border cursor-pointer"
                                />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-md w-40 p-2 z-50">
                                    <Link
                                        href={`/${username || "profile"}`}
                                        className="block px-3 py-2 hover:bg-gray-100 text-sm"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}
