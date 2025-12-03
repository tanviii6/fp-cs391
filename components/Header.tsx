"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const user = session?.user;

    return (
        <header className="w-full border-b bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight">
                    FilmFlow
                </Link>

                {/* Nav */}
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/films" className="hover:text-gray-600">
                        Films
                    </Link>
                    <Link href="/lists" className="hover:text-gray-600">
                        Lists
                    </Link>
                </nav>

                {/* Right Side: Auth */}
                <div className="relative">
                    {/* If signed out */}
                    {!user && (
                        <button
                            onClick={() => signIn("google")}
                            className="px-4 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
                        >
                            Sign In
                        </button>
                    )}

                    {/* If signed in */}
                    {user && (
                        <div className="flex items-center gap-3">
                            {/* Avatar button */}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center"
                            >
                                <Image
                                    src={user.image || "/default-avatar.png"}
                                    alt="User Avatar"
                                    width={36}
                                    height={36}
                                    className="rounded-full border cursor-pointer"
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-md w-40 p-2 z-50">
                                    <Link
                                        href={`/${user.name || "profile"}`}
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
