import { sql } from "drizzle-orm";
import {
  boolean,
  longtext,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";

export const ACCOUNT_TYPE = ["student", "faculty", "alumni"] as const;
export const POST_TYPE = [
  "following",
  "program",
  "college",
  "campus",
  "all",
] as const;
export const NOTIFICATION_TYPE = [
  "like",
  "comment",
  "follow",
  "mention_post",
  "mention_comment",
] as const;

interface File {
  name: string;
  key: string;
  size: number;
  url: string;
}

const id = varchar("id", { length: 256 })
  .primaryKey()
  .notNull()
  .unique()
  .$defaultFn(() => nanoid());
const created_at = timestamp("created_at")
  .default(sql`CURRENT_TIMESTAMP`)
  .notNull();
const updated_at = timestamp("updated_at")
  .default(sql`CURRENT_TIMESTAMP`)
  .onUpdateNow()
  .notNull();
const deleted_at = timestamp("deleted_at");
// const slug = varchar("slug", { length: 256 }).unique().notNull();

// export const deleted_users = mysqlTable("deleted_user", {
//   id: varchar("id", { length: 256 }).primaryKey().unique().notNull(),

//   created_at,
// });

export const users = mysqlTable("user", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  // image: varchar("image", { length: 255 }),
  image: varchar("image", { length: 255 }).$type<string | File>(),

  created_at,
  bio: longtext("bio"),
  link: text("link"),
  username: varchar("username", { length: 256 }).unique(),
  type: mysqlEnum("type", ACCOUNT_TYPE),
  program_id: varchar("program_id", { length: 256 }),
  verified_at: timestamp("verified_at"),
});

export const likes = mysqlTable("like", {
  id,
  user_id: varchar("user_id", { length: 256 }).notNull(),
  post_id: varchar("post_id", { length: 256 }).notNull(),

  created_at,
});
export const comments = mysqlTable("comment", {
  id,
  user_id: varchar("user_id", { length: 256 }).notNull(),
  post_id: varchar("post_id", { length: 256 }).notNull(),
  content: longtext("content").notNull(),
  thread_id: varchar("thread_id", { length: 256 }),

  created_at,
  updated_at,
  deleted_at,
});

export const followers = mysqlTable("follower", {
  id,
  follower_id: varchar("follower_id", { length: 256 }).notNull(),
  followee_id: varchar("followee_id", { length: 256 }).notNull(),

  created_at,
});
export const followees = mysqlTable("followee", {
  id,
  followee_id: varchar("followee_id", { length: 256 }).notNull(),
  follower_id: varchar("follower_id", { length: 256 }).notNull(),

  created_at,
});
export const posts = mysqlTable("post", {
  id,
  user_id: varchar("user_id", { length: 256 }).notNull(),
  content: longtext("content").notNull(),
  type: mysqlEnum("type", POST_TYPE).default("following").notNull(),

  created_at,
  updated_at,
  deleted_at,
});
export const campuses = mysqlTable("campus", {
  id,
  name: text("name").notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),

  created_at,
  updated_at,
  deleted_at,
});
export const colleges = mysqlTable("college", {
  id,
  name: text("name").notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  campus_id: varchar("campus_id", { length: 256 }).notNull(),

  created_at,
  updated_at,
  deleted_at,
});
export const programs = mysqlTable("program", {
  id,
  name: text("name").notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),

  college_id: varchar("college_id", { length: 256 }).notNull(),

  created_at,
  updated_at,
  deleted_at,
});

export const notifications = mysqlTable("notification", {
  id,
  from_id: varchar("from_id", { length: 256 }).notNull(),
  to_id: varchar("to_id", { length: 256 }).notNull(),
  content_id: varchar("content_id", { length: 256 }),
  read: boolean("read").notNull().default(false),
  type: mysqlEnum("type", NOTIFICATION_TYPE).notNull(),
  trash: boolean("trash").notNull().default(false),

  created_at,
});

export const reported_users = mysqlTable("reported_user", {
  id,
  user_id: varchar("user_id", { length: 256 }).notNull(),
  reported_by_id: varchar("reported_by_id", { length: 256 }).notNull(),
  reason: text("reason").notNull(),

  created_at,
});

export const reported_posts = mysqlTable("reported_post", {
  id,
  post_id: varchar("post_id", { length: 256 }).notNull(),
  reported_by_id: varchar("reported_by_id", { length: 256 }).notNull(),
  reason: text("reason").notNull(),

  created_at,
});

export const reported_comments = mysqlTable("reported_comment", {
  id,
  comment_id: varchar("comment_id", { length: 256 }).notNull(),
  reported_by_id: varchar("reported_by_id", { length: 256 }).notNull(),
  reason: text("reason").notNull(),

  created_at,
});

export const reported_problems = mysqlTable("reported_problem", {
  id,
  problem: text("problem").notNull(),
  reported_by_id: varchar("reported_by_id", { length: 256 }).notNull(),

  created_at,
});

export const suggested_features = mysqlTable("suggested_feature", {
  id,
  feature: text("feature").notNull(),
  suggested_by_id: varchar("suggested_by_id", { length: 256 }).notNull(),

  created_at,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type College = typeof colleges.$inferSelect;
export type NewCollege = typeof colleges.$inferInsert;
// export type Organization = typeof organizations.$inferSelect;
// export type NewOrganization = typeof organizations.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export type Follower = typeof followers.$inferSelect;
export type NewFollower = typeof followers.$inferInsert;
export type Followee = typeof followees.$inferSelect;
export type NewFollowee = typeof followees.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
export type Campus = typeof campuses.$inferSelect;
export type NewCampus = typeof campuses.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
