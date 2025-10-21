import z from "zod";
import { PaginationSchema } from "../common/pagination";
import {
  GovernorateSchema,
  PropertyBaseSchema,
  PropertyPurposeDetailsSchema,
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

export const PropertyInsertSchema = PropertyBaseSchema.omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  media: true,
})
  .and(PropertyPurposeDetailsSchema)
  .and(
    z.object({
      mediaIds: z
        .array(
          z
            .number("Media ID is required")
            .positive("Media ID must be positive"),
        )
        .min(1, "Media IDs must be at least 1"),
    }),
  );

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
