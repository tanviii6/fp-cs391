
import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button
        type="submit"
        className="bg-blue-600 px-3 py-1 rounded-md"
      >
        Sign in
      </button>
    </form>
  )
} 