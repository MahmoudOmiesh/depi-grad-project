import { Hono } from "hono";
import { getUser } from "../middleware/auth";
import { UserGetPropertiesPageSchema } from "~/lib/schemas/queries/users";
import { validator } from "hono-openapi";
import { docs } from "../open-api";
import { tryCatch } from "~/lib/utils";
import { paginate } from "../paginate";
import { db } from "~/server/db";
import z from "zod";
import { PropertyInsertSchema } from "~/lib/schemas/queries/properties";

export const usersRoute = new Hono()
  .use(getUser)
  .get(
    "/properties",
    docs.users.getProperties,
    validator("query", UserGetPropertiesPageSchema),
    async (c) => {
      const user = c.get("user");
      const query = c.req.valid("query");

      const { data, error } = await tryCatch(
        paginate({
          input: query,
          getPage: (options) =>
            db.users.queries.getProperties(user.id, options),
        }),
      );

      if (error) {
        return c.json({ error: "Failed to get properties" }, 500);
      }

      return c.json(data, 200);
    },
  )

  .post(
    "/properties",
    docs.users.createProperty,
    validator("json", PropertyInsertSchema),
    async (c) => {
      const user = c.get("user");
      const body = c.req.valid("json");

      const { data, error } = await tryCatch(
        db.users.mutations.createProperty(user.id, body),
      );

      if (error) {
        return c.json({ error: "Failed to create property" }, 500);
      }

      return c.json(data, 200);
    },
  )

  .delete(
    "/properties/:id",
    docs.users.deleteProperty,
    validator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const user = c.get("user");
      const id = c.req.valid("param").id;

      const { data, error } = await tryCatch(
        db.users.mutations.deleteProperty(user.id, id),
      );

      if (error) {
        // Prisma throws P2025 when the record to delete is not found
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2025"
        ) {
          return c.json({ error: "Property not found" }, 404);
        }

        return c.json({ error: "Failed to delete property" }, 500);
      }

      return c.json(data, 200);
    },
  );
