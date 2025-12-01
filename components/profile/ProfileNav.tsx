"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileNav() {
  const path = usePathname();

  const baseLinkClasses = "relative block p-[12px_9px]";

  // using pseudo elements to create the bottom border
  // similar to how letterboxd does
  const activeLinkAdditions = `
    text-white
    after:absolute
    after:bottom-0
    after:left-1/2
    after:-translate-x-1/2
    after:w-2/5
    after:h-[1px]
    after:bg-white
  `;

  return (
    <nav className="border border-solid border-[#24303C] rounded-[3px] col-span-full">
      <ul className="flex flex-nowrap whitespace-nowrap list-none text-[#9ab]">
        <li className="ml-auto">
          <Link
            className={`${baseLinkClasses} ${path === "/profile" ? activeLinkAdditions : ""}`}
            href={`/profile`}
          >
            Profile
          </Link>
        </li>
        {/* these errors are only because typedroutes is enabled, they will go away once these routes are added  */}
        <li>
          <Link
            className={`${baseLinkClasses} ${path === "/profile/films" ? activeLinkAdditions : ""}`}
            href={`/profile/films`}
          >
            Films
          </Link>
        </li>
        <li>
          <Link
            className={`${baseLinkClasses} ${path === "/profile/lists" ? activeLinkAdditions : ""}`}
            href={`/profile/lists`}
          >
            Lists
          </Link>
        </li>
        <li className="mr-auto">
          <Link
            className={`${baseLinkClasses} ${path === "/profile/likes" ? activeLinkAdditions : ""}`}
            href={`/profile/likes`}
          >
            Likes
          </Link>
        </li>
      </ul>
    </nav>
  );
}
