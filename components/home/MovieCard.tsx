"use client";

import Link from "next/link";
import Image from "next/image";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaStarHalfAlt } from "react-icons/fa";

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
  const ratingOutOfFive = Math.round((average_rating / 2) * 2) / 2; // round to nearest 0.5
  const fullStars = Math.floor(ratingOutOfFive);
  const hasHalfStar = ratingOutOfFive - fullStars === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

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
          {Array.from({ length: fullStars }).map((_, idx) => (
            <AiFillStar
              key={`full-${idx}`}
              className="text-yellow-400 text-sm"
              aria-label="full-star"
            />
          ))}
          {hasHalfStar && (
            <FaStarHalfAlt
              className="text-yellow-400 text-[11px]"
              aria-label="half-star"
            />
          )}
          {Array.from({ length: emptyStars }).map((_, idx) => (
            <AiOutlineStar
              key={`empty-${idx}`}
              className="text-yellow-400 text-sm"
              aria-label="empty-star"
            />
          ))}

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
