import {
  ApartmentSubtype,
  CommercialSubtype,
  LandSubtype,
  PropertyTypeName as PrismaPropertyTypeName,
  VillaSubtype,
} from "@prisma/client";
import * as z from "zod";

export const PropertyTypeNameSchema = z.enum(PrismaPropertyTypeName, {
  error: "Please select a property type",
});
export const ApartmentSubtypeSchema = z.enum(ApartmentSubtype, {
  error: "Please select an apartment subtype",
});
export const VillaSubtypeSchema = z.enum(VillaSubtype, {
  error: "Please select a villa subtype",
});
export const CommercialSubtypeSchema = z.enum(CommercialSubtype, {
  error: "Please select a commercial subtype",
});
export const LandSubtypeSchema = z.enum(LandSubtype, {
  error: "Please select a land subtype",
});

export const PropertyTypeNames = Object.values(PrismaPropertyTypeName);
export const ApartmentSubtypes = Object.values(ApartmentSubtype);
export const VillaSubtypes = Object.values(VillaSubtype);
export const CommercialSubtypes = Object.values(CommercialSubtype);
export const LandSubtypes = Object.values(LandSubtype);

export const ApartmentDetailsSchema = z.object({
  subtype: ApartmentSubtypeSchema,
  bedrooms: z
    .number("Please enter the number of bedrooms")
    .positive("Number of bedrooms must be positive"),
  bathrooms: z
    .number("Please enter the number of bathrooms")
    .positive("Number of bathrooms must be positive"),
  furnished: z.boolean("Furnished is required"),
  level: z
    .number("Please enter the level")
    .positive("Level must be positive")
    .optional(),
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

export const PropertyTypeSchema = z.discriminatedUnion("name", [
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
]);

export type PropertyTypeName = z.infer<typeof PropertyTypeNameSchema>;

export type ApartmentDetails = z.infer<typeof ApartmentDetailsSchema>;
export type VillaDetails = z.infer<typeof VillaDetailsSchema>;
export type CommercialDetails = z.infer<typeof CommercialDetailsSchema>;
export type LandDetails = z.infer<typeof LandDetailsSchema>;

export type PropertyType = z.infer<typeof PropertyTypeSchema>;
