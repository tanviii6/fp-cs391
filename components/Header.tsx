'use client';

import { useEffect, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dbUser, setDbUser] = useState<{ username?: string } | null>(null);
    const avatarMenuRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();

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

    useEffect(() => {
        if (!menuOpen) return;

        const handleOutsideClick = (event: PointerEvent) => {
            if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsideClick);
        return () => document.removeEventListener("pointerdown", handleOutsideClick);
    }, [menuOpen]);

    const user = session?.user;
    const username = dbUser?.username;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0f1318]/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
                    <Image
                        src="/logofilmflow12.png"
                        alt="FilmFlow logo"
                        width={56}
                        height={56}
                        className="h-10 w-10 object-contain scale-250 transform"
                        priority
                    />
                </Link>

                {/* Nav */}
                <nav className="flex items-center gap-6 text-sm font-medium text-slate-200">
                    <Link
                        href="/"
                        className={`transition hover:text-white ${pathname === "/" ? "text-emerald-400" : ""}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/lists"
                        className={`transition hover:text-white ${pathname.startsWith("/lists") ? "text-emerald-400" : ""}`}
                    >
                        Favorites
                    </Link>
                    <Link
                        href="/search"
                        className={`transition hover:text-white ${pathname.startsWith("/search") ? "text-emerald-400" : ""}`}
                    >
                        Search
                    </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="relative" ref={avatarMenuRef}>
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
                                <div className="absolute right-0 top-full mt-3 w-48 rounded-xl border border-slate-700 bg-[#0f1318] py-3 shadow-lg shadow-black/40">
                                    <Link
                                        href={`/${username || "profile"}`}
                                        className="block px-5 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full px-5 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
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
