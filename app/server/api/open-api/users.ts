import { describeRoute, resolver } from "hono-openapi";
import z from "zod";
import { UserGetPropertiesPageResponseSchema } from "~/lib/schemas/queries/users";

export const _users = {
  getProperties: describeRoute({
    description: "Get all properties of the authenticated user",
    parameters: [
      {
        in: "query",
        name: "cursor",
        schema: { type: "string" },
        required: false,
      },
      {
        in: "query",
        name: "pageSize",
        schema: { type: "number" },
        required: true,
      },
    ],
    responses: {
      200: {
        description: "Properties retrieved successfully",
        content: {
          "application/json": {
            schema: resolver(UserGetPropertiesPageResponseSchema),
          },
        },
      },
    },
  }),

  createProperty: describeRoute({
    description: "Create a property for the authenticated user",
    responses: {
      200: {
        description: "Property created successfully",
        content: {
          "application/json": {
            schema: resolver(z.object({ id: z.number() })),
          },
        },
      },
    },
  }),

  deleteProperty: describeRoute({
    description: "Delete a property of the authenticated user",
    parameters: [
      {
        in: "path",
        name: "id",
        schema: { type: "number" },
        required: true,
      },
    ],
    responses: {
      200: {
        description: "Property deleted successfully",
        content: {
          "application/json": {
            schema: resolver(z.object({ id: z.number() })),
          },
        },
      },
    },
  }),
};
