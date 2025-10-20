import { createHonoServer } from "react-router-hono-server/node";
import { propertiesRoute } from "./routes/properties";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

export const app = new OpenAPIHono();

app.route("/api/properties", propertiesRoute);

app.doc("/api/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Real Estate API",
  },
});

app.get("/api/docs", Scalar({ url: "/api/doc" }));

export default createHonoServer({ app });
export type ApiRoutes = typeof app;
