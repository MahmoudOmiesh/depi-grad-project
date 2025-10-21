import z from "zod";
import { MediaSchema } from "../entities/media";

export const PresignedURLInsertSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
  name: z.string().min(1, "Name is required"),
  mimeType: z.string().min(1, "Mime type is required"),
  size: z.number().min(1, "Size is required"),
});

export const PresignedURLResponseSchema = z.object({
  fileId: z.string("File ID is required").min(1, "File ID is too short"),
  url: z.url("URL is invalid").min(1, "URL is too short"),
  name: z.string("Name is required").min(1, "Name is too short"),
  mimeType: z.string("Mime type is required").min(1, "Mime type is too short"),
  accessUrl: z.url("Access URL is invalid").min(1, "Access URL is too short"),
});

export const MediaInsertSchema = MediaSchema.omit({
  id: true,
});

export type PresignedURLInsert = z.infer<typeof PresignedURLInsertSchema>;
export type PresignedURLResponse = z.infer<typeof PresignedURLResponseSchema>;

export type MediaInsert = z.infer<typeof MediaInsertSchema>;
