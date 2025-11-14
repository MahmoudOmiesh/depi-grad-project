import * as z from "zod";
import { PaginationSchema } from "../common/pagination";
import {
  GovernorateSchema,
  PropertyBaseSchema,
  PropertyPurposeDetailsSchema,
  PropertyPurposeSchema,
  PropertySchema,
} from "../entities/property";
import { PropertyTypeNameSchema } from "../entities/property-type";
import { stringOrArray } from "../common/string-or-array";

export const PropertiesFiltersSchema = z.object({
  title: z.string("Title is required").optional(),
  propertyTypes: stringOrArray(PropertyTypeNameSchema).optional(),
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

export const PropertyMediaInsertSchema = z.object({
  mediaData: z
    .array(
      z.object({
        id: z
          .number("Media ID is required")
          .positive("Media ID must be positive"),
        url: z.url("URL is invalid").min(1, "URL is too short"),
        name: z.string("Name is required").min(1, "Name is too short"),
      }),
    )
    .min(1, "You must upload at least one image"),
});

export const PropertyInsertSchema = PropertyBaseSchema.omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  media: true,
})
  .and(PropertyPurposeDetailsSchema)
  .and(PropertyMediaInsertSchema);

export const PropertyUpdateSchema = PropertyInsertSchema.and(
  z.object({
    id: z.number("ID is required").positive("ID must be positive"),
  }),
);

export type PropertiesFilters = z.infer<typeof PropertiesFiltersSchema>;
export type PropertiesGetPage = z.infer<typeof PropertiesGetPageSchema>;
export type PropertiesGetPageResponse = z.infer<
  typeof PropertiesGetPageResponseSchema
>;
export type PropertyInsert = z.infer<typeof PropertyInsertSchema>;
export type PropertyUpdate = z.infer<typeof PropertyUpdateSchema>;
