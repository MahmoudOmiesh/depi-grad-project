import { describeRoute, resolver } from "hono-openapi";
import * as z from "zod";
import { PresignedURLResponseSchema } from "~/lib/schemas/queries/media";

export const _media = {
  getPresignedUrl: describeRoute({
    description: "Get a presigned URL for a media file",
    responses: {
      200: {
        description: "Presigned URL retrieved successfully",
        content: {
          "application/json": {
            schema: resolver(PresignedURLResponseSchema),
          },
        },
      },
    },
  }),

  insert: describeRoute({
    description: "Insert a media file",
    responses: {
      200: {
        description: "Media file inserted successfully",
        content: {
          "application/json": {
            schema: resolver(z.object({ id: z.number() })),
          },
        },
      },
    },
  }),
};
