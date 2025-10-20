import { Hono } from "hono";
import { validator } from "hono-openapi";
import { PropertiesGetPageSchema } from "~/lib/schemas/queries/properties";
import { db } from "~/server/db";
import { tryCatch } from "~/lib/utils";
import { paginate } from "../paginate";
import { docs } from "../open-api";

export const propertiesRoute = new Hono().get(
  "/",
  docs.properties.getPage,
  validator("query", PropertiesGetPageSchema),
  async (c) => {
    const query = c.req.valid("query");

    console.log("Query:", query);

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
);
