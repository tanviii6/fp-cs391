import { List, SerializedUser } from "@/types/schemas";
import Link from "next/link";

interface ProfileListsSectionProps {
  user: SerializedUser;
  lists?: List[]; // nullable until we are using real data
  owner: boolean; // this owner flag will let us know if the logged in user owns this account
}

export default function ProfileListsSection({
  user,
  lists,
  owner,
}: ProfileListsSectionProps) {
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
      {!lists ? (
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
          <h2 className="text-center text-[#89a] m-0 font-normal">
            <span>IMPLEMENT LISTS</span>
          </h2>
        </section>
      )}
    </section>
  );
}
