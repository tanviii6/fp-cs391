/** 
 * Created by: Jude Hosmer + Charlie Howard
 * Header component with navigation and authentication buttons.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dbUser, setDbUser] = useState<{ username?: string } | null>(null);

  // Pull the user's DB profile once session has an email so we can show personalized links.
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUser = async () => {
      if (!session?.user?.email) return;
      const res = await fetch(`/api/users?email=${session.user.email}`);
      if (res.ok) {
        const user = await res.json();
        console.log("Fetched DB user:", user);
        setDbUser(user);
      }
    };

    fetchUser();
  }, [session?.user?.email]);

  // Build navigation once we know if the user has a username for personalized routes.
  const navLinks = useMemo(() => {
    const base = [
      { href: "/", label: "Home" },
      { href: "/search/movies", label: "Search Movies" },
      { href: "/search/users", label: "Search Users" },
    ];

    if (dbUser?.username) {
      base.push(
        { href: `/${dbUser.username}/lists`, label: "My Lists" },
        { href: `/${dbUser.username}/films`, label: "My Films" },
        { href: `/${dbUser.username}/lists/new`, label: "Create List" },
      );
    }

    return base;
  }, [dbUser?.username]);

  const user = session?.user;
  const username = dbUser?.username;

  return (
    <header className="sticky top-0 z-50 mb-7 w-full border-b border-slate-800 bg-[#0f1318]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 overflow-visible">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="FilmFlow home"
        >
          <Image
            src="/logofilmflow12.png"
            alt="FilmFlow logo"
            width={140}
            height={48}
            className="h-9 w-auto object-contain scale-275"
            priority
          />
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-200">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`transition ${
                  isActive
                    ? "text-emerald-400"
                    : "text-slate-200 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons */}
        <div className="relative flex items-center">
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
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center"
              >
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="cursor-pointer rounded-full border border-slate-700"
                />
              </button>

              {/* Lightweight user dropdown; avoids rendering until we have a session */}
              {menuOpen && (
                <div className="absolute top-full right-0 mt-2 min-w-[11rem] rounded-md border border-slate-700 bg-[#0f1318] p-2 shadow-lg shadow-black/40">
                  <Link
                    href={username ? `/${username}` : "#"}
                    className={`block px-3 py-2 text-sm text-slate-200 transition ${
                      !dbUser
                        ? "cursor-wait opacity-50"
                        : username
                          ? "hover:bg-slate-800 hover:text-white"
                          : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    {dbUser ? "Profile" : "Loading..."}
                  </Link>
                  <Link
                    href={username ? `/${username}/setup` : "/setup"}
                    className="block px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
                  >
                    {username ? "Edit Profile" : "Set Up Profile"}
                  </Link>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
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
