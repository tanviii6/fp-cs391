import { User } from "@/types/schemas";
import ProfileNav from "@/components/profile/ProfileNav";
import ProfileListsSection from "@/components/profile/ProfileListsSection";

export default async function ListsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

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
        <ProfileListsSection />
      </div>
    </div>
  );
}
