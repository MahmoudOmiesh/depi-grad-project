import { createRoute, z } from "@hono/zod-openapi";

export const _properties = {
  get: createRoute({
    method: "get",
    path: "/",
    tags: ["Properties"],
    summary: "Get all properties",
    description: "Retrieve a paginated list of properties",
    request: {},
    responses: {
      200: {
        description: "Successful response with paginated properties",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
      400: {
        description: "Bad request - invalid query parameters",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  }),

  getById: createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Properties"],
    summary: "Get property by ID",
    description: "Retrieve a property by its ID",
    request: {
      params: z.object({
        id: z.string().openapi({
          param: {
            name: "id",
            in: "path",
          },
          example: "123",
        }),
      }),
    },
    responses: {
      200: {
        description: "Successful response with property",
        content: {
          "application/json": {
            schema: z.object({
              property: z.string(),
            }),
          },
        },
      },
      400: {
        description: "Bad request - invalid query parameters",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  }),
};
