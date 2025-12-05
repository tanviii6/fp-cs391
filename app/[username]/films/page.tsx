/*
  Created By: Christian Gonzalez
*/

import ProfileFilmsSection from "@/components/profile/ProfileFilmsSection";
import ProfileNav from "@/components/profile/ProfileNav";
import { getUsersCollection } from "@/db";
import { SerializedUser } from "@/types/schemas";
import { auth } from "@/auth";

export default async function ProfileFilmsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ username: username });
  const session = await auth();
  const loggedInUserEmail = session?.user?.email || null;
  const loggedInUser = loggedInUserEmail
    ? await usersCollection.findOne({ email: loggedInUserEmail })
    : null;

  const owner = !!user && !!loggedInUser && user._id.toString() === loggedInUser._id.toString();


  // basic page displaying that user does not exist
  if (!user) {
    return (
      <div className="flex items-center justify-center mt-10">
        <h1 className="text-3xl text-white">This user does not exist</h1>
      </div>
    );
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
        <ProfileFilmsSection username={user.username!} owner={owner} />

      </div>
    </div>
  );
}
