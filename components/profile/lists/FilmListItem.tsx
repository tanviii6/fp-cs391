import Image from "next/image";
import { Trash } from "lucide-react";

interface FilmListItemProps {
  film: {
    title: string;
    releaseYear?: number;
    posterUrl?: string;
  };
  onRemove: () => void;
}

export default function FilmListItem({ film, onRemove }: FilmListItemProps) {
  return (
    <li className="block w-[890px] pt-2.5 pr-12 pb-2.5 pl-2.5 relative overflow-hidden">
      <div>
        <div className="float-left mr-2.5">
          <Image
            src={film.posterUrl || "/placeholder-poster.jpg"}
            height={50}
            width={35}
            alt={film.title}
          />
        </div>
      </div>
      <div className="float-left w-3xl flex items-center h-[50px]">
        <h3 className="font-bold text-xl mt-0 mx-0 text-white leading-[1.2]">
          {film.title}{" "}
          {film.releaseYear && (
            <span className="text-sm text-[#89a] font-light">
              {film.releaseYear}
            </span>
          )}
        </h3>
      </div>
      <span className="inline-block text-left absolute top-1/2 right-0 -translate-y-1/2 leading-none">
        <button
          onClick={onRemove}
          className="fill-[#456] accent-orange-600 cursor-pointer"
          type="button"
        >
          <Trash />
        </button>
      </span>
    </li>
  );
}
