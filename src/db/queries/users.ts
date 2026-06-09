import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

async function getUserByName(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
}

export { createUser, getUserByName };
