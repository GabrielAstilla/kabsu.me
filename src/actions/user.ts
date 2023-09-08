"use server";

import { db } from "@/db";
import { ACCOUNT_TYPE, followees, followers, users } from "@/db/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addProgramToUserMetadata({
  userId,
  program_id,
  type,
}: {
  userId: string;
  program_id: string;
  type: (typeof ACCOUNT_TYPE)[number];
}) {
  await db
    .update(users)
    .set({
      program_id,
      type,
    })
    .where(eq(users.id, userId));
}

export async function updateBio({
  user_id,
  bio,
}: {
  user_id: string;
  bio: string;
}) {
  const { userId } = auth();

  if (!userId || userId !== user_id) throw new Error("User not found");

  await db.update(users).set({ bio }).where(eq(users.id, userId));
  revalidatePath("/user/[username]");
}

export async function followUser({ user_id }: { user_id: string }) {
  const { userId } = auth();

  if (!userId) throw new Error("User not found");

  const isAlreadyFollowing = await db.query.followers.findFirst({
    where: (follower, { and, eq }) =>
      and(eq(follower.follower_id, userId), eq(follower.followee_id, user_id)),
  });

  if (isAlreadyFollowing) throw new Error("Already following user");

  await db.insert(followers).values({
    follower_id: userId,
    followee_id: user_id,
  });

  await db.insert(followees).values({
    follower_id: user_id,
    followee_id: userId,
  });

  revalidatePath("/[username]");
  revalidatePath("/[username]/followers");
  revalidatePath("/[username]/following");
}

export async function unfollowUser({ user_id }: { user_id: string }) {
  const { userId } = auth();

  if (!userId) throw new Error("User not found");

  await db
    .delete(followers)
    .where(
      and(
        eq(followers.follower_id, userId),
        eq(followers.followee_id, user_id),
      ),
    );

  await db
    .delete(followees)
    .where(
      and(
        eq(followees.follower_id, user_id),
        eq(followees.followee_id, userId),
      ),
    );

  revalidatePath("/[username]");
  revalidatePath("/[username]/followers");
  revalidatePath("/[username]/following");
}

export async function getProgramForAuth() {
  const colleges = await db.query.colleges.findMany();
  const programs = await db.query.programs.findMany();

  return {
    colleges,
    programs,
  };
}

export async function isUsernameExists({ username }: { username: string }) {
  const users = await clerkClient.users.getUserList({
    username: [username],
  });

  const user = users[0];

  return !!user || users.length > 0;
}