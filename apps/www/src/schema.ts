import { z } from "zod";

import type { Database } from "../../../supabase/types";

export const PostShareSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  ratio: z.enum(["square", "landscape", "portrait"]).default("square"),
  image: z.string().default("https://github.com/bricesuazo.png"),
  name: z.string().default("Brice Suazo"),
  username: z.string().default("bricesuazo"),
  verified: z
    .string()
    .default("true")
    .transform((value) => value === "true"),
  created_at: z.string().default("5 days ago"),
  campus: z.string().default("MAIN"),
  program: z.string().default("BSCS"),
  content: z
    .string()
    .default(
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea laboriosam eos, alias a sed odit dolorem dignissimos at reprehenderit repudiandae ullam doloribus nobis quod aliquam asperiores blanditiis nostrum labore placeat? Minus delectus voluptas repellat totam officia, quidem a quas alias necessitatibus voluptatem,",
    ),
  privacy: z
    .custom<Database["public"]["Enums"]["post_type"]>()
    .default("following"),
  likes: z.string().default("12"),
  comments: z.string().default("0"),
});
