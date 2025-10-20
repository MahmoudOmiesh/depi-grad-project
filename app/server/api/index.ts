import { createHonoServer } from "react-router-hono-server/node";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";

export const app = new Hono();

import { openAPIRouteHandler } from "hono-openapi";
import { propertiesRoute } from "./routes/properties";
import { usersRoute } from "./routes/users";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiRoutes = app
  .basePath("/api")
  .route("/properties", propertiesRoute)
  .route("/me", usersRoute);

app.get(
  "api/openapi",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "Real Estate API",
        version: "1.0.0",
      },
    },
  }),
);

app.get("/api/docs", Scalar({ url: "/api/openapi" }));

export default createHonoServer({ app });
export type ApiRoutes = typeof apiRoutes;
