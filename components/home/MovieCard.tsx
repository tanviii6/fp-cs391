"use client";

import Link from "next/link";
import Image from "next/image";
import StarDisplay from "@/components/ratings/StarDisplay";

interface MovieCardProps {
  id: number;
  poster_path: string | null;
  title: string;
  average_rating: number;
  release_date: string;
  overview: string;
  overviewMaxLength?: number;
}

const MovieCard = ({
  id,
  poster_path,
  title,
  average_rating,
  release_date,
  overview,
  overviewMaxLength,
}: MovieCardProps) => {
  const displayOverview =
    overviewMaxLength && overview.length > overviewMaxLength
      ? `${overview.slice(0, overviewMaxLength).trim()}...`
      : overview;

  return (
    <Link href={`/movies/${id}`} className="block w-44 cursor-pointer">
      <div className="flex h-full flex-col">
        <Image
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png"
          }
          alt={title}
          width={500}
          height={750}
          className="aspect-[2/3] h-auto w-full rounded-lg object-cover"
        />

        <p className="mt-2 min-h-[2.5rem] text-sm font-bold text-white line-clamp-2">
          {title}
        </p>

        <div className="flex flex-row items-center gap-x-1">
          <StarDisplay
            rating={average_rating}
            size={12}
            className="text-yellow-400"
          />

          <p className="text-xs text-gray-400 font-medium mt-1 ml-auto">
            {release_date ? release_date.split("-")[0] : ""}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="ml-1 mt-1 min-h-[2.75rem] text-xs font-medium text-gray-400 line-clamp-2">
            {displayOverview}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
