import z from "zod";

export const PaginationSchema = z.object({
  cursor: z.string("Cursor must be a string").optional(),
  pageSize: z
    .number("Page size must be a number")
    .nonnegative("Page size must be positive"),
});

export type Pagination = z.infer<typeof PaginationSchema>;
