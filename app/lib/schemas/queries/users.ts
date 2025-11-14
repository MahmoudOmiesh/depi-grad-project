import * as z from "zod";
import { PaginationSchema } from "../common/pagination";
import { PropertySchema } from "../entities/property";

export const UserGetPropertiesPageSchema = PaginationSchema;

export const UserGetPropertiesPageResponseSchema = z.object({
  data: z.array(PropertySchema),
  nextCursor: z.string().optional(),
});

export type UserGetPropertiesPage = z.infer<typeof UserGetPropertiesPageSchema>;
export type UserGetPropertiesPageResponse = z.infer<
  typeof UserGetPropertiesPageResponseSchema
>;
