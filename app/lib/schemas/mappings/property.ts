import type {
  Amenity,
  PaymentMethod,
  PropertyPurpose,
  RentFrequency,
} from "@prisma/client";
import type { PropertyTypeName } from "../entities/property-type";

export const AmenitiesPerPropertyType = {
  APARTMENT: [
    "BALCONY",
    "BUILT_IN_KITCHEN_APPLIANCES",
    "PRIVATE_GARDEN",
    "CENTRAL_AC",
    "SECURITY",
    "COVERED_PARKING",
    "MAIDS_ROOM",
    "PETS_ALLOWED",
    "POOL",
    "ELECTRICITY_METER",
    "WATER_METER",
    "NATURAL_GAS",
    "LANDLINE",
    "ELEVATOR",
  ],
  VILLA: [
    "BALCONY",
    "BUILT_IN_KITCHEN_APPLIANCES",
    "PRIVATE_GARDEN",
    "CENTRAL_AC",
    "SECURITY",
    "COVERED_PARKING",
    "MAIDS_ROOM",
    "PETS_ALLOWED",
    "POOL",
    "ELECTRICITY_METER",
    "WATER_METER",
    "NATURAL_GAS",
    "LANDLINE",
    "ELEVATOR",
  ],
  COMMERCIAL: ["AIR_CONDITIONING", "COVERED_PARKING", "SECURITY", "STORAGE"],
  LAND: [],
} as const satisfies Record<PropertyTypeName, readonly Amenity[]>;

export const AmenitiesMapping = {
  BALCONY: "Balcony",
  BUILT_IN_KITCHEN_APPLIANCES: "Built-in Kitchen Appliances",
  PRIVATE_GARDEN: "Private Garden",
  CENTRAL_AC: "Central AC",
  SECURITY: "Security",
  COVERED_PARKING: "Covered Parking",
  MAIDS_ROOM: "Maids Room",
  PETS_ALLOWED: "Pets Allowed",
  POOL: "Pool",
  ELECTRICITY_METER: "Electricity Meter",
  WATER_METER: "Water Meter",
  NATURAL_GAS: "Natural Gas",
  LANDLINE: "Landline",
  ELEVATOR: "Elevator",
  AIR_CONDITIONING: "Air Conditioning",
  STORAGE: "Storage",
} as const satisfies Record<Amenity, string>;

export const PropertyPurposeNamesMapping = {
  SELL: "Sell",
  RENT: "Rent",
} as const satisfies Record<PropertyPurpose, string>;

export const PaymentMethodNamesMapping = {
  CASH: "Cash",
  INSTALLMENT: "Installment",
  BOTH: "Both",
} as const satisfies Record<PaymentMethod, string>;

export const RentFrequencyNamesMapping = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
} as const satisfies Record<RentFrequency, string>;
