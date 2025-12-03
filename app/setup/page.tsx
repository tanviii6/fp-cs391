import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SetupProfileForm from "@/components/profile/SetupProfileForm";
import { getUsersCollection } from "@/db";

export default async function SetupProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
  return (
    <div className="text-center mt-20 text-white">
      <h1>Login to begin setting up your profile</h1>
      <a
        href="/api/auth/signin"
        className="text-[#40bcf4] underline mt-2 inline-block"
      >
        Sign in with Google
      </a>
    </div>
  );
}


  const usersCollection = await getUsersCollection();
  const existingUser = await usersCollection.findOne({
    email: session.user.email,
  });

  if (existingUser) {
    redirect(`/${existingUser.username}`);
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-16 text-[#9ab]">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Set Up Your Profile
      </h1>
      <SetupProfileForm email={session.user.email!} />
    </div>
  );
}