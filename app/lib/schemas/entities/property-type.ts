import {
  ApartmentSubtype,
  CommercialSubtype,
  LandSubtype,
  PropertyTypeName as PrismaPropertyTypeName,
  VillaSubtype,
} from "@prisma/client";
import z from "zod";

export const ProperyTypeNameSchema = z.enum(PrismaPropertyTypeName);
export const ApartmentSubtypeSchema = z.enum(ApartmentSubtype);
export const VillaSubtypeSchema = z.enum(VillaSubtype);
export const CommercialSubtypeSchema = z.enum(CommercialSubtype);
export const LandSubtypeSchema = z.enum(LandSubtype);

export const ApartmentDetailsSchema = z.object({
  subtype: ApartmentSubtypeSchema,
  bedrooms: z
    .number("Bedrooms is required")
    .positive("Bedrooms must be positive"),
  bathrooms: z
    .number("Bathrooms is required")
    .positive("Bathrooms must be positive"),
  furnished: z.boolean("Furnished is required"),
  level: z.number().positive("Level must be positive").optional(),
});

export const VillaDetailsSchema = z.object({
  subtype: VillaSubtypeSchema,
  bedrooms: z
    .number("Bedrooms is required")
    .positive("Bedrooms must be positive"),
  bathrooms: z
    .number("Bathrooms is required")
    .positive("Bathrooms must be positive"),
  furnished: z.boolean("Furnished is required"),
});

export const CommercialDetailsSchema = z.object({
  subtype: CommercialSubtypeSchema,
});

export const LandDetailsSchema = z.object({
  subtype: LandSubtypeSchema,
});

export const PropertyTypeSchema = z
  .object({
    id: z.number("ID is required").positive("ID must be positive"),
  })
  .and(
    z.discriminatedUnion("name", [
      z.object({
        name: z.literal(PrismaPropertyTypeName.APARTMENT),
        apartmentDetails: ApartmentDetailsSchema,
      }),
      z.object({
        name: z.literal(PrismaPropertyTypeName.VILLA),
        villaDetails: VillaDetailsSchema,
      }),
      z.object({
        name: z.literal(PrismaPropertyTypeName.COMMERCIAL),
        commercialDetails: CommercialDetailsSchema,
      }),
      z.object({
        name: z.literal(PrismaPropertyTypeName.LAND),
        landDetails: LandDetailsSchema,
      }),
    ]),
  );

export type PropertyTypeName = z.infer<typeof ProperyTypeNameSchema>;

export type ApartmentDetails = z.infer<typeof ApartmentDetailsSchema>;
export type VillaDetails = z.infer<typeof VillaDetailsSchema>;
export type CommercialDetails = z.infer<typeof CommercialDetailsSchema>;
export type LandDetails = z.infer<typeof LandDetailsSchema>;

export type PropertyType = z.infer<typeof PropertyTypeSchema>;
