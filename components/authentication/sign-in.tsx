/*
  Created By: Tanvi Agarwal
*/

import { signIn } from "@/auth";
import { Button } from "../ui/button";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button variant="outline" size="lg">
        <p className="text-black">Sign in</p>
      </Button>
    </form>
  );
}
