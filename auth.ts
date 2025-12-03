import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getUsersCollection } from "@/db";
import { ObjectId } from "mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const usersCollection = await getUsersCollection();
        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        // adds user to our db if they don't exist yet
        if (!existingUser) {
          await usersCollection.insertOne({
            _id: new ObjectId(),
            email: user.email,
            name: user.name || "",
            username: "", // empty username for now since they are redirected to /setup
            avatar: user.image || undefined,
            createdAt: new Date(),
          });
        }
      }
      return true;
    },
  },
});
