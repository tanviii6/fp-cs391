/*
  Created By: Christian Gonzalez
*/

import { auth } from "@/auth";
import { getUsersCollection } from "@/db";
import CreateListForm from "@/components/profile/lists/CreateListForm";
import { redirect } from "next/navigation";

// had to wrap in a server function since i need this to be async to retrieve collections
export default async function CreateListPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ email: session.user.email });

  if (!user?.username) {
    redirect("/setup");
  }

  return <CreateListForm username={user.username} />;
}
