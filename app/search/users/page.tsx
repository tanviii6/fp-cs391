/*
  Created By: Tanvi Agarwal
*/

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function SearchUsersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setError(query ? "Enter at least 2 characters to search." : "");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/search-users?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();

        if (res.ok) {
          setResults(data.users || []);
        } else {
          setError(data.error || "Failed to fetch results.");
        }
      } catch {
        setError("Something went wrong while searching.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto mt-10 text-[#9ab] min-h-[70vh]">
        <h1 className="text-2xl font-bold text-white mb-6">Search Users</h1>

        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#2c3440] text-[#89a] px-4 py-2 rounded-md border border-[#456] focus:bg-white focus:text-[#234] focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        {loading && (
          <p className="text-sm italic text-[#89a]">Loading results...</p>
        )}

        {!loading && results.length === 0 && query.length >= 2 && !error && (
          <p className="text-sm italic text-[#89a]">No users found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((user) => (
            <Link
              key={user._id}
              href={`/${user.username}`}
              className="flex items-center gap-4 bg-[#1c252f] hover:bg-[#24303c] transition-colors border border-[#345] p-4 rounded-md"
            >
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.username}
                width={60}
                height={60}
                className="rounded-full object-cover border border-[#456]"
              />
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {user.username}
                </h2>
                {user.name && (
                  <p className="text-sm text-[#9ab]">{user.name}</p>
                )}
                {user.bio && (
                  <p className="text-xs text-[#678] line-clamp-2">{user.bio}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
