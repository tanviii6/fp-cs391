"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupProfileForm({
  email,
  avatar,
}: {
  email: string;
  avatar?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, bio, email, avatar }),
    });

    if (res.ok) {
      router.push(`/${username}`);
    } else {
      console.log("Error saving profile. Try again.");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-[#1c1f26] p-6 rounded-md shadow-md border border-[#2a2f3a]"
    >
      <label className="text-sm uppercase tracking-wide">Name</label>
      <input
        className="bg-[#2a2f3a] text-white p-2 rounded-md outline-none"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label className="text-sm uppercase tracking-wide">Username</label>
      <input
        className="bg-[#2a2f3a] text-white p-2 rounded-md outline-none"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label className="text-sm uppercase tracking-wide">Bio (optional)</label>
      <textarea
        className="bg-[#2a2f3a] text-white p-2 rounded-md outline-none"
        rows={3}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-[#40bcf4] text-black font-semibold py-2 rounded-md hover:bg-[#1ea2dc] transition-colors"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
