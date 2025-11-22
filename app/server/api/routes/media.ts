import { Hono } from "hono";
import { _media } from "../open-api/media";
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
    _media.getPresignedUrl,
    async (c) => {
      const body = c.req.valid("json");
      const { data, error } = await tryCatch(s3GetPresignedUrl(body));

      if (error) {
        console.error(error);
        return c.json(
          { ok: false as const, error: "Failed to get presigned URL" },
          500,
        );
      }

      return c.json({ ok: true as const, data }, 200);
    },
  )

  .post("/", _media.insert, validator("json", MediaInsertSchema), async (c) => {
    const body = c.req.valid("json");

    const { data, error } = await tryCatch(db.media.mutations.insert(body));

    if (error) {
      return c.json(
        { ok: false as const, error: "Failed to insert media" },
        500,
      );
    }

    return c.json(
      {
        ok: true as const,
        data: {
          mediaId: data.id,
          url: body.url,
          name: body.name,
          mimeType: body.mimeType,
        },
      },
      200,
    );
  });
