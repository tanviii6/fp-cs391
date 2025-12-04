import { getUsersCollection } from "@/db";
import { User } from "@/types/schemas";

const USERS_COLLECTION = getUsersCollection();

export async function getCurrentUser(email?: string): Promise<User | null> {
  return (await USERS_COLLECTION).findOne({ email: email });
}
