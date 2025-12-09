/*
  Created By: Tanvi Agarwal
*/

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUsersCollection } from "@/db";
import SetupProfileForm from "@/components/profile/SetupProfileForm";

export default async function SetupProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const usersCollection = await getUsersCollection();
  const existingUser = await usersCollection.findOne({
    email: session.user.email,
  });

  const initialData = {
    name: existingUser?.name || "",
    username: existingUser?.username || "",
    bio: existingUser?.bio || "",
    avatar: existingUser?.avatar || session.user.image || undefined,
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-16 text-[#9ab]">
      <h1 className="text-2xl font-bold mb-6 text-white">
        {existingUser ? "Edit Your Profile" : "Set Up Your Profile"}
      </h1>
      <SetupProfileForm
        email={session.user.email!}
        avatar={initialData.avatar}
        initialName={initialData.name}
        initialUsername={initialData.username}
        initialBio={initialData.bio}
      />
    </div>
  );
}
