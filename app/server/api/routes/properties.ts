import { Hono } from "hono";
import { validator } from "hono-openapi";
import { PropertiesGetPageSchema } from "~/lib/schemas/queries/properties";
import { db } from "~/server/db";
import { tryCatch } from "~/lib/utils";
import { paginate } from "../paginate";
import { docs } from "../open-api";
import z from "zod";

export const propertiesRoute = new Hono()
  .get(
    "/",
    docs.properties.getPage,
    validator("query", PropertiesGetPageSchema),
    async (c) => {
      const query = c.req.valid("query");

      const { data, error } = await tryCatch(
        paginate({
          input: query,
          getPage: db.properties.queries.getPage,
        }),
      );

      if (error) {
        return c.json({ error: "Failed to get properties" }, 500);
      }

      return c.json(data, 200);
    },
  )
  .get(
    "/:id",
    docs.properties.getById,
    validator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const id = c.req.valid("param").id;
      const { data, error } = await tryCatch(db.properties.queries.getById(id));

      if (error) {
        return c.json({ error: "Failed to get property" }, 500);
      }

      if (!data) {
        return c.json({ error: "Property not found" }, 404);
      }

      return c.json(data, 200);
    },
  );
