/*
  Created by: Christian Gonzalez
*/

import ProfileContent from "@/components/profile/ProfileContent";
import ProfileNav from "@/components/profile/ProfileNav";
import { User as DefaultUser } from "lucide-react";
import Image from "next/image";
import { getUsersCollection, getWatchedCollection } from "@/db";
import { SerializedUser } from "@/types/schemas";
import UserListsDisplay from "@/components/profile/lists/UserListsDisplay";


// this page was styled after the official letterboxd profile page
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // since we pass username in the in url, we can grab our user dynamically
  // usernames will also be unique so this *should* always work
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ username: username });

  // basic page displaying that user does not exist
  if (!user) {
    return (
      <div className="flex items-center justify-center mt-10">
        <h1 className="text-3xl text-white">This user does not exist</h1>
      </div>
    );
  }

  // getting error on client side about ObjectId, we need to turn it into a string
  // before reaching any client components, but not sure if there's a better way to do this
  const serializedUser: SerializedUser = {
    ...user,
    _id: user._id?.toHexString(),
  };

  const watchedCollection = await getWatchedCollection();

  // grabs total count of all watched films for a specific user
  const totalFilms = await watchedCollection.countDocuments({
    userId: user._id,
  });

  // grabs total count of all watched films for the current year
  const currentYear = new Date().getFullYear();
  const filmsThisYear = await watchedCollection.countDocuments({
    watchedDate: {
      $gte: new Date(currentYear, 0, 1), // Jan 1 (current year)
      $lt: new Date(currentYear + 1, 0, 1), // Jan 1 (next year)
    },
  });

  return (
    <div className="w-full mb-10">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 pb-8">
        <div className="shrink-0">
          {serializedUser.avatar ? (
            <Image
              src={serializedUser.avatar}
              width={100}
              height={100}
              className="rounded-full object-cover border border-white/10"
              alt={`Profile image for ${serializedUser.name}`}
            />
          ) : (
            <div className="h-[100px] w-[100px] rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <span className="text-4xl text-muted-foreground">
                <DefaultUser size={110} />
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-bold text-[#FFF] tracking-wide">
            {serializedUser.username}
          </h1>
        </div>

        <div className="flex items-center pr-4 ">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold leading-none text-[#D8E0E8]">
              {totalFilms}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest hover:text-[#40bcf4] transition-colors cursor-pointer">
              Films
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 pl-5 bg-[linear-gradient(270deg,rgba(36,48,60,0)_99%,#24303c_0)] bg-position-[calc(20px*.5)_0]">
            <span className="text-xl font-bold leading-none text-[#D8E0E8]">
              {filmsThisYear}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest hover:text-[#40bcf4] transition-colors cursor-pointer">
              This Year
            </span>
          </div>
        </div>
        <ProfileNav user={serializedUser} isProfileRoot={true} />
      </div>
      <ProfileContent user={serializedUser} />
      <div className="mt-10">
        <UserListsDisplay username={serializedUser.username} />
      </div>
    </div>
    
  );
}
