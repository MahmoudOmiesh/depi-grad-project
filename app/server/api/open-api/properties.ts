import { describeRoute, resolver } from "hono-openapi";
import {
  GovernorateSchema,
  PropertyPurposeSchema,
  PropertySchema,
} from "~/lib/schemas/entities/property";
import { ProperyTypeNameSchema } from "~/lib/schemas/entities/property-type";
import { PropertiesGetPageResponseSchema } from "~/lib/schemas/queries/properties";

export const _properties = {
  getPage: describeRoute({
    description: "Get all properties",
    parameters: [
      {
        in: "query",
        name: "cursor",
        schema: { type: "string" },
        required: false,
        description: "Cursor for pagination",
      },
      {
        in: "query",
        name: "pageSize",
        schema: { type: "number" },
        required: true,
        description: "Number of items per page (must be non-negative)",
      },
      {
        in: "query",
        name: "title",
        schema: { type: "string" },
        required: false,
        description: "Filter by property title",
      },
      {
        in: "query",
        name: "propertyTypes",
        schema: {
          type: "array",
          items: {
            type: "string",
            enum: Object.values(ProperyTypeNameSchema.enum),
          },
        },
        required: false,
        description: "Filter by property type(s)",
      },
      {
        in: "query",
        name: "purpose",
        schema: {
          type: "string",
          enum: Object.values(PropertyPurposeSchema.enum),
        },
        required: false,
        description: "Filter by property purpose",
      },
      {
        in: "query",
        name: "minPrice",
        schema: { type: "number", minimum: 0 },
        required: false,
        description: "Minimum price filter (must be positive)",
      },
      {
        in: "query",
        name: "maxPrice",
        schema: { type: "number", minimum: 0 },
        required: false,
        description: "Maximum price filter (must be positive)",
      },
      {
        in: "query",
        name: "governorates",
        schema: {
          type: "array",
          items: {
            type: "string",
            enum: Object.values(GovernorateSchema.enum),
          },
        },
        required: false,
        description: "Filter by governorate(s)",
      },
      {
        in: "query",
        name: "city",
        schema: { type: "string" },
        required: false,
        description: "Filter by city",
      },
    ],
    responses: {
      200: {
        description: "Properties retrieved successfully",
        content: {
          "application/json": {
            schema: resolver(PropertiesGetPageResponseSchema),
          },
        },
      },
    },
  }),

  getById: describeRoute({
    description: "Get a property by ID",
    parameters: [
      {
        in: "path",
        name: "id",
        schema: { type: "number" },
        required: true,
        description: "Property ID",
      },
    ],
    responses: {
      200: {
        description: "Property retrieved successfully",
        content: {
          "application/json": {
            schema: resolver(PropertySchema),
          },
        },
      },
    },
  }),
};
