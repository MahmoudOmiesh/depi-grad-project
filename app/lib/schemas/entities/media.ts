import z from "zod";

export const MediaSchema = z.object({
  id: z.number("ID is required").positive("ID must be positive"),

  name: z.string("Name is required").min(1, "Name is too short"),
  url: z.url("URL is invalid").min(1, "URL is too short"),
  mimeType: z.string("Mime type is required").min(1, "Mime type is too short"),

  order: z.number("Order is required").nonnegative("Order can't be negative"),
});

export type Media = z.infer<typeof MediaSchema>;
