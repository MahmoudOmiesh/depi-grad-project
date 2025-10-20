import { Hono } from "hono";

export const propertiesRoute = new Hono().get("/", async (c) => {
  return c.json({ message: "Hello, from properties!" });
});
