/*
  Created By: Christian Gonzalez
*/

import ProfileNav from "@/components/profile/ProfileNav";
import ProfileListsSection from "@/components/profile/ProfileListsSection";
import { getUsersCollection } from "@/db";
import { SerializedUser } from "@/types/schemas";
import { auth } from "@/auth";

export default async function ListsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

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

  let owner: boolean;

  const session = await auth();
  if (session?.user?.email !== user.email) {
    owner = false;
  } else {
    owner = true;
  }

  const serializedUser: SerializedUser = {
    ...user,
    _id: user._id?.toHexString(),
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <ProfileNav user={serializedUser} isProfileRoot={false} />
      </div>
      <div>
        <ProfileListsSection user={serializedUser} owner={owner} />
      </div>
    </div>
  );
}
