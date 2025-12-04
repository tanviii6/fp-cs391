/*
Collaborators: Jude Hosmer
*/


"use client";

import Link from "next/link";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";

interface MovieCardProps {
  id: number;
  poster_path: string | null;
  title: string;
  average_rating: number;
  release_date: string;
  overview: string;
}

const MovieCard = ({
  id,
  poster_path,
  title,
  average_rating,
  release_date,
  overview,
}: MovieCardProps) => {
  return (
    <Link href={`/movies/${id}`} className=" w-44 cursor-pointer">
      <div>
        <Image
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png"
          }
          alt={title}
          width={500}
          height={750}
          className="w-full h-auto rounded-lg"
        />

        <p className="text-sm font-bold text-white mt-2 ">{title}</p>

        <div className="flex flex-row items-center gap-x-1">
          {Array.from({ length: Math.round(average_rating /2) }).map(
            (_, idx) => (
              <AiFillStar
                key={idx}
                className="text-yellow-400 text-sm"
                aria-label="star"
              />
            )
          )}

          <p className="text-xs text-gray-400 font-medium mt-1 ml-auto">
            {release_date ? release_date.split("-")[0] : ""}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="text-xs text-gray-400 font-medium ml-1 mt-1">
            {overview ? overview.slice(0, 45) + "..." : "No description"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
