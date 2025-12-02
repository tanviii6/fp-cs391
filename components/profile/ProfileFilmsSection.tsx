"use client";

import { LikedOnlySwitch } from "./LikedFilmsSwitch";
import { Film } from "@/types/schemas";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface FilmsSectionProps {
  films?: Film[]; // nullable until we are actually using real data
}

export default function ProfileFilmsSection({ films }: FilmsSectionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // derive directly from URL instead of syncing via state
  const filterParam = searchParams.get("filter");
  const showLikedOnly = filterParam === "likes";

  const handleToggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("filter", "likes");
    } else {
      params.delete("filter");
    }

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
  };

  if (showLikedOnly) {
    const filteredFilms = showLikedOnly
      ? films?.filter((film) => film.liked) // TODO: remove null
      : films;
  }

  return (
    <section>
      <div
        id="content-nav"
        className="mb-[15px] border-b border-[#456] text-[13px] leading-none text-[#678] min-h-[30px] relative"
      >
        <h1 className="border-none m-0 pt-2.5">
          <span>WATCHED</span>
        </h1>
        <div className="right-0 absolute top-0 z-0">
          <LikedOnlySwitch
            className="scale-75"
            checked={showLikedOnly}
            onToggle={handleToggle}
          />
        </div>
      </div>
      {/*
        Movies will be rendered here

        By default, will render all movies by recent activity (loggedAt)
        if showLikedOnly is true, then we filter the films and
        only show the liked the films
      */}
    </section>
  );
}
