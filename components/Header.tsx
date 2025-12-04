'use client';

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

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
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0f1318]/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight text-white">
                    FilmFlow
                </Link>

                {/* Nav */}
                <nav className="flex items-center gap-6 text-sm font-medium text-slate-200">
                    <Link href="/films" className="transition hover:text-white">
                        Films
                    </Link>
                    <Link href="/lists" className="transition hover:text-white">
                        Lists
                    </Link>
                    <Link href="/search" className="transition hover:text-white">
                        Search
                    </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="relative">
                    {!user && (
                        <button
                            onClick={() => signIn("google")}
                            className="rounded-md border border-slate-700 bg-slate-800 px-4 py-1.5 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-700"
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
                                    className="cursor-pointer rounded-full border border-slate-700"
                                />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-40 rounded-md border border-slate-700 bg-[#0f1318] p-2 shadow-lg shadow-black/40">
                                    <Link
                                        href={`/${username || "profile"}`}
                                        className="block px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
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
