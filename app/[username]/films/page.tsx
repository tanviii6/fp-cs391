import ProfileFilmsSection from "@/components/profile/ProfileFilmsSection";
import ProfileNav from "@/components/profile/ProfileNav";
import { User } from "@/types/schemas";

export default async function ProfileFilmsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // TODO: fetch user from database using username
  // for now, using test data similar to the main profile page
  const TestUser: User = {
    name: "Christian Gonzalez",
    username: username,
    email: "christian.gonzalez6137@gmail.com",
    createdAt: new Date(),
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <ProfileNav user={TestUser} isProfileRoot={false} />
      </div>
      <div>
        <ProfileFilmsSection />
      </div>
    </div>
  );
}
