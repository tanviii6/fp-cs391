/*
  Created By: Tanvi Agarwal
*/
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getUsersCollection } from "@/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const usersCollection = await getUsersCollection();
      const existingUser = await usersCollection.findOne({ email: user.email });

      if (!existingUser) {

        //now it generates unique user name by email
        const baseUsername = user.email.split("@")[0]; 
        let username = baseUsername;
        let count = 1;

        while (await usersCollection.findOne({ username })) {
          username = `${baseUsername}_${count++}`;
        }

        await usersCollection.insertOne({
          email: user.email,
          name: user.name || "",
          username,
          avatar: user.image || undefined,
          createdAt: new Date(),
          bio: "",
        });
      }

      return true;
    },
  },
});