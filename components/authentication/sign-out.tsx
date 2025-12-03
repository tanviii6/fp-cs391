import { signOut } from "@/auth";
import { Button } from "../ui/button";

export default function SignOut({ name }: { name?: string | null }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
     
      <Button variant="outline" size="lg"><p className="text-black">Sign out {name}</p></Button>
    </form>
  );
}
