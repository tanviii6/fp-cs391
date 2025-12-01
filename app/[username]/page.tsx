import ProfileContent from "@/components/profile/ProfileContent";
import ProfileNav from "@/components/profile/ProfileNav";
import { User } from "@/types/schemas";
import { User as DefaultUser } from "lucide-react";
import Image from "next/image";

// this page was styled after the official letterboxd profile page
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // hardcoded user data for now until we have auth
  const TestUser: User = {
    name: "Christian Gonzalez",
    username: "christian",
    email: "christian.gonzalez6137@gmail.com",
    createdAt: new Date(),
  };

  const totalFilms = 19;
  const filmsThisYear = 8;

  return (
    <div className="w-full mb-10">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 pb-8">
        <div className="shrink-0">
          {TestUser.avatar ? (
            <Image
              src={TestUser.avatar}
              width={100}
              height={100}
              className="rounded-full object-cover border border-white/10"
              alt={`Profile image for ${TestUser.name}`}
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
            {username}
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
        <ProfileNav user={TestUser} isProfileRoot={true} />
      </div>
      <ProfileContent />
    </div>
  );
}
