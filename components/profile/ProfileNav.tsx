/*
  Created By: Christian Gonzalez
*/

"use client";

import { SerializedUser } from "@/types/schemas";
import { User as DefaultUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileNavProps {
  user: SerializedUser;
  isProfileRoot?: boolean;
}

export default function ProfileNav({ user, isProfileRoot }: ProfileNavProps) {
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

  // checks if current path matches the route
  const isActive = (route: string) => {
    if (route === "") {
      // exact match for profile page
      return path === `/${user.username}`;
    }
    // checks if path starts with the route (/username/films)
    return path === `/${user.username}${route}`;
  };

  if (!isProfileRoot) {
    return (
      <nav className="border border-solid border-[#24303C] rounded-[3px] col-span-full relative">
        <div className="absolute left-0 top-0 h-full flex flex-row items-center pl-2">
          {user.avatar ? (
            <Image
              src={user.avatar}
              height={25}
              width={25}
              className="rounded-full object-cover border border-white/10 mr-2"
              alt={`Profile image of ${user.name}`}
            />
          ) : (
            <div className="h-[25px] w-[25px] rounded-full bg-muted flex items-center justify-center overflow-hidden mr-2">
              <span className="text-4xl text-muted-foreground">
                <DefaultUser size={25} />
              </span>
            </div>
          )}
          <h1 className="text-[13px] font-bold text-[#FFF] tracking-wide">
            <Link href={`/${user.username}`}>{user.username}</Link>
          </h1>
        </div>
        <ul className="flex flex-nowrap whitespace-nowrap list-none text-[#9ab] justify-center items-center">
          <li>
            <Link
              className={`${baseLinkClasses} ${
                isActive("") ? activeLinkAdditions : ""
              }`}
              href={`/${user.username}`}
            >
              Profile
            </Link>
          </li>
          {/* these errors are only because typedroutes is enabled, they will go away once these routes are added  */}
          <li>
            <Link
              className={`${baseLinkClasses} ${
                isActive("/films") ? activeLinkAdditions : ""
              }`}
              href={`/${user.username}/films`}
            >
              Films
            </Link>
          </li>
          <li>
            <Link
              className={`${baseLinkClasses} ${
                isActive("/lists") ? activeLinkAdditions : ""
              }`}
              href={`/${user.username}/lists`}
            >
              Lists
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className="border border-solid border-[#24303C] rounded-[3px] col-span-full">
      <ul className="flex flex-nowrap whitespace-nowrap list-none text-[#9ab]">
        <li className="ml-auto">
          <Link
            className={`${baseLinkClasses} ${
              isActive("") ? activeLinkAdditions : ""
            }`}
            href={`/${user.username}`}
          >
            Profile
          </Link>
        </li>
        {/* these errors are only because typedroutes is enabled, they will go away once these routes are added  */}
        <li>
          <Link
            className={`${baseLinkClasses} ${
              isActive("/films") ? activeLinkAdditions : ""
            }`}
            href={`/${user.username}/films`}
          >
            Films
          </Link>
        </li>
        <li className="mr-auto">
          <Link
            className={`${baseLinkClasses} ${
              isActive("/lists") ? activeLinkAdditions : ""
            }`}
            href={`/${user.username}/lists`}
          >
            Lists
          </Link>
        </li>
      </ul>
    </nav>
  );
}
