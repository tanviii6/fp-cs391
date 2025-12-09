/*
  Created By: Christian Gonzalez & Tanvi Agarwal
*/

import { List, SerializedUser } from "@/types/schemas";
import Link from "next/link";
import UserListsDisplay from "@/components/profile/lists/UserListsDisplay";
import { Button } from "../ui/button";
import { getUserLists } from "@/lib/lists";

interface ProfileListsSectionProps {
  user: SerializedUser;
  lists?: List[];
  owner: boolean; // this owner flag will let us know if the logged in user owns this account
}

export default async function ProfileListsSection({
  user,
  owner,
}: ProfileListsSectionProps) {
  const listsData = await getUserLists(user.username!);
  const hasLists = Array.isArray(listsData) && listsData.length > 0;

  return (
    <section>
      <div
        id="content-nav"
        className="mb-[15px] border-b border-[#456] text-[13px] leading-none text-[#678] min-h-[30px] relative"
      >
        <h1 className="border-none m-0 pt-2.5">
          <span>YOUR LISTS</span>
        </h1>
      </div>
      {!hasLists ? (
        <section className="border border-[#456] bg-transparent py-16 px-8 rounded-sm leading-normal text-sm">
          <h2 className="text-center text-[#89a] m-0 font-normal">
            <span>
              No lists yet.{" "}
              {owner && (
                <Link
                  className="font-bold hover:text-[#DEF] hover:underline"
                  href={`/${user.username}/lists/new`}
                >
                  Create your first list?
                </Link>
              )}
            </span>
          </h2>
        </section>
      ) : (
        <section className="border border-[#456] bg-transparent py-16 px-8 rounded-sm leading-normal text-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Your Lists</h2>
            {owner && (
              <Link href={`/${user.username}/lists/new`}>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#00ac1c] hover:bg-[#009d1a] text-white"
                >
                  Add New List
                </Button>
              </Link>
            )}
          </div>

          <UserListsDisplay username={user.username!} />
        </section>
      )}
    </section>
  );
}
