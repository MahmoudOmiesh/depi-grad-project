import type {
  ApartmentSubtype,
  CommercialSubtype,
  LandSubtype,
  VillaSubtype,
} from "@prisma/client";
import type { PropertyTypeName } from "../entities/property-type";

export const PropertyTypeNamesMapping = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  COMMERCIAL: "Commercial",
  LAND: "Land",
} as const satisfies Record<PropertyTypeName, string>;

export const ApartmentSubtypesMapping = {
  APARTMENT: "Classic Apartment",
  DUPLEX: "Duplex",
  PENTHOUSE: "Penthouse",
  STUDIO: "Studio",
  HOTEL_APARTMENT: "Hotel Apartment",
  ROOF: "Roof",
} as const satisfies Record<ApartmentSubtype, string>;

export const VillaSubtypesMapping = {
  STAND_ALONE_VILLA: "Stand Alone Villa",
  TOWN_HOUSE: "Town Villa",
  TWIN_HOUSE: "Twin Villa",
} as const satisfies Record<VillaSubtype, string>;

export const CommercialSubtypesMapping = {
  OFFICE: "Office",
  CLINIC: "Clinic",
  PHARMACY: "Pharmacy",
  FACTORY: "Factory",
  GARAGE: "Garage",
  WAREHOUSE: "Warehouse",
  RESTAURANT: "Restaurant",
  OTHER: "Other",
} as const satisfies Record<CommercialSubtype, string>;

export const LandSubtypesMapping = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
  AGRICULTURAL: "Agricultural",
  ANY: "Any Use",
} as const satisfies Record<LandSubtype, string>;
