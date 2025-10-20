import z from "zod";
import { PhoneNumberSchema } from "../common/phone-number";
import { PropertyTypeSchema } from "./property-type";
import {
  PaymentMethod as PrismaPaymentMethod,
  Amenity as PrismaAmenity,
  PropertyPurpose as PrismaPropertyPurpose,
  RentFrequency as PrismaRentFrequency,
} from "@prisma/client";
import { MediaSchema } from "./media";

export const PropertyAmenitySchema = z.enum(Object.values(PrismaAmenity));
export const PropertyPurposeSchema = z.enum(
  Object.values(PrismaPropertyPurpose),
);
export const PaymentMethodSchema = z.enum(Object.values(PrismaPaymentMethod));
export const RentFrequencySchema = z.enum(Object.values(PrismaRentFrequency));

export const PropertySellDetailsSchema = z
  .object({
    price: z.number("Price is required").positive("Price must be positive"),
  })
  .extend(
    z.discriminatedUnion("paymentMethod", [
      z.object({
        paymentMethod: z.literal(PrismaPaymentMethod.CASH),
      }),
      z.object({
        paymentMethod: z.literal(PrismaPaymentMethod.INSTALLMENT),
        downPayment: z
          .number("Down payment is required")
          .positive("Down payment must be positive"),
      }),
      z.object({
        paymentMethod: z.literal(PrismaPaymentMethod.BOTH),
        downPayment: z
          .number("Down payment is required")
          .positive("Down payment must be positive"),
      }),
    ]),
  );

export const PropertyRentDetailsSchema = z.object({
  rentFrequency: RentFrequencySchema,
  price: z.number("Price is required").positive("Price must be positive"),
  deposit: z.number("Deposit is required").positive("Deposit must be positive"),
  insurance: z
    .number("Insurance is required")
    .positive("Insurance must be positive"),
});

export const PropertySchema = z
  .object({
    id: z.number("ID is required").positive("ID must be positive"),
    slug: z.string("Slug is required").min(1, "Slug is too short"),

    userId: z.string("User ID is required").min(1, "User ID is too short"),

    createdAt: z.date("Created at is required"),
    updatedAt: z.date("Updated at is required"),

    ownerName: z
      .string("Owner name is required")
      .min(1, "Owner name is too short"),
    ownerPhone: PhoneNumberSchema,

    propertyType: PropertyTypeSchema,

    title: z.string("Title is required").min(1, "Title is too short"),
    description: z
      .string("Description is required")
      .min(1, "Description is too short"),

    location: z.string("Location is required").min(1, "Location is too short"),
    region: z.string("Region is required").min(1, "Region is too short"),
    city: z.string("City is required").min(1, "City is too short"),
    latitude: z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .optional(),
    longitude: z
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .optional(),

    area: z
      .number("Area is required")
      .positive("Area must be positive")
      .min(10, "Area must be at least 10"),

    amenities: z.array(PropertyAmenitySchema),

    media: z.array(MediaSchema),
  })
  .extend(
    z.discriminatedUnion("purpose", [
      z.object({
        purpose: z.literal(PrismaPropertyPurpose.SELL),
        sellDetails: PropertySellDetailsSchema,
      }),
      z.object({
        purpose: z.literal(PrismaPropertyPurpose.RENT),
        rentDetails: PropertyRentDetailsSchema,
      }),
    ]),
  );

export type PropertyAmenity = z.infer<typeof PropertyAmenitySchema>;
export type PropertyPurpose = z.infer<typeof PropertyPurposeSchema>;
export type PropertySellDetails = z.infer<typeof PropertySellDetailsSchema>;
export type PropertyRentDetails = z.infer<typeof PropertyRentDetailsSchema>;
export type Property = z.infer<typeof PropertySchema>;
