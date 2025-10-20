import z from "zod";
import { PaginationSchema } from "../common/pagination";
import {
  GovernorateSchema,
  PropertyPurposeSchema,
  PropertySchema,
} from "../entities/property";
import { ProperyTypeNameSchema } from "../entities/property-type";
import { stringOrArray } from "../common/string-or-array";

export const PropertiesFiltersSchema = z.object({
  title: z.string("Title is required").optional(),
  propertyTypes: stringOrArray(ProperyTypeNameSchema).optional(),
  purpose: PropertyPurposeSchema.optional(),
  minPrice: z.coerce
    .number("Min price is required")
    .positive("Min price must be positive")
    .optional(),
  maxPrice: z.coerce
    .number("Max price is required")
    .positive("Max price must be positive")
    .optional(),
  governorates: stringOrArray(GovernorateSchema).optional(),
  city: z.string("City is required").min(1, "City is too short").optional(),
});

export const PropertiesGetPageSchema = PaginationSchema.and(
  PropertiesFiltersSchema,
);

export const PropertiesGetPageResponseSchema = z.object({
  data: z.array(PropertySchema),
  nextCursor: z.string().optional(),
});

export type PropertiesFilters = z.infer<typeof PropertiesFiltersSchema>;
export type PropertiesGetPage = z.infer<typeof PropertiesGetPageSchema>;
export type PropertiesGetPageResponse = z.infer<
  typeof PropertiesGetPageResponseSchema
>;
