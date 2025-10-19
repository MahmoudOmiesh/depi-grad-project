import z from "zod";

export const MediaSchema = z.object({
  id: z.number("ID is required").positive("ID must be positive"),

  name: z.string("Name is required").min(1, "Name is too short"),
  url: z.url("URL is invalid").min(1, "URL is too short"),
  mimeType: z.string("Mime type is required").min(1, "Mime type is too short"),

  isPrimary: z.boolean("Is primary is required"),
  order: z.number("Order is required").nonnegative("Order can't be negative"),
  alt: z.string("Alt is required").min(1, "Alt is too short").optional(),

  createdAt: z.date("Created at is required"),
  updatedAt: z.date("Updated at is required"),
});

export type Media = z.infer<typeof MediaSchema>;
