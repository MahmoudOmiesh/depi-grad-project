import * as z from "zod";

export const stringOrArray = <T extends z.ZodTypeAny>(schema: T) => {
  return z
    .union([schema, z.array(schema)])
    .transform((val) => (Array.isArray(val) ? val : [val]));
};
