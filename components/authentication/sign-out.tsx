import { signOut } from "@/auth";

export default function SignOut({ name }: { name?: string | null }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700"
      >
        Sign out {name}
      </button>
    </form>
  );
}
