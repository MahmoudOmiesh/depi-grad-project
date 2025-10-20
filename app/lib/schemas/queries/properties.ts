import z from "zod";
import { PaginationSchema } from "../common/pagination";

export const PropertiesFiltersSchema = z.object({});

export const PropertiesGetPageSchema = PaginationSchema.extend({
  filters: PropertiesFiltersSchema.optional(),
});

export type PropertiesFilters = z.infer<typeof PropertiesFiltersSchema>;
export type PropertiesGetPage = z.infer<typeof PropertiesGetPageSchema>;
