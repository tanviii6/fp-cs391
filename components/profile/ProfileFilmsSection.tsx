"use client";

import { useState } from "react";
import { LikedOnlySwitch } from "./LikedFilmsSwitch";
import { Film } from "@/types/schemas";

interface FilmsSectionProps {
  films?: Film[]; // nullable until we are actually using real data
}

export default function ProfileFilmsSection({ films }: FilmsSectionProps) {
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const handleToggle = (checked: boolean) => {
    console.log("Switch toggled:", checked);
    setShowLikedOnly(checked);
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
          <LikedOnlySwitch className="scale-75" onToggle={handleToggle} />
        </div>
      </div>
      {/*
        Movies will be rendered here

        By default, will render all movies by recent activity
        if showLikedOnly is true, then we filter the films and
        only show the liked the films
      */}
    </section>
  );
}
