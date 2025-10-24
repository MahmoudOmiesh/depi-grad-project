import { Hono } from "hono";
import { docs } from "../open-api";
import { validator } from "hono-openapi";
import {
  MediaInsertSchema,
  PresignedURLInsertSchema,
} from "~/lib/schemas/queries/media";
import { s3GetPresignedUrl } from "~/lib/s3";
import { tryCatch } from "~/lib/utils";
import { db } from "~/server/db";
import { getUser } from "../middleware/auth";

export const mediaRoute = new Hono()
  .use(getUser)
  .post(
    "/presigned-url",
    validator("json", PresignedURLInsertSchema),
    docs.media.getPresignedUrl,
    async (c) => {
      const body = c.req.valid("json");
      const { data, error } = await tryCatch(s3GetPresignedUrl(body));

      if (error) {
        console.error(error);
        return c.json({ error: "Failed to get presigned URL" }, 500);
      }

      return c.json(data, 200);
    },
  )

  .post(
    "/",
    docs.media.insert,
    validator("json", MediaInsertSchema),
    async (c) => {
      const body = c.req.valid("json");

      const { data, error } = await tryCatch(db.media.mutations.insert(body));

      if (error) {
        return c.json({ error: "Failed to insert media" }, 500);
      }

      return c.json(
        {
          mediaId: data.id,
          url: body.url,
          name: body.name,
          mimeType: body.mimeType,
        },
        200,
      );
    },
  );
