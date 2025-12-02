import Image from "next/image";
import { Trash } from "lucide-react";
import Link from "next/link";

interface FilmListItemProps {
  film: {
    id?: number;
    title: string;
    releaseYear?: number;
    posterUrl?: string;
  };
  onRemove: () => void;
}

export default function FilmListItem({ film, onRemove }: FilmListItemProps) {
  return (
    <li className="block w-full pt-2.5 pr-12 pb-2.5 pl-2.5 relative overflow-hidden border-t border-[#345] first:border-t-0 hover:bg-[#123]">
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
          <Link href={`/films/${film.id}`}>{film.title}</Link>{" "}
          {film.releaseYear && (
            <span className="text-sm text-[#89a] font-light">
              {film.releaseYear}
            </span>
          )}
        </h3>
      </div>
      <span className="inline-block text-left absolute top-1/2 right-5 -translate-y-1/2 leading-none">
        <button
          onClick={onRemove}
          className="fill-[#456]  cursor-pointer"
          type="button"
        >
          <Trash className="hover:text-orange-600" />
        </button>
      </span>
    </li>
  );
}
