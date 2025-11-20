import { createHonoServer } from "react-router-hono-server/node";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";

export const app = new Hono();

import { openAPIRouteHandler } from "hono-openapi";
import { propertiesRoute } from "./routes/properties";
import { usersRoute } from "./routes/users";
import { mediaRoute } from "./routes/media";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiRoutes = app
  .basePath("/api")
  .use(
    cors({
      origin: (origin) => {
        //TODO: remove this in prod
        if (
          origin &&
          (origin.startsWith("http://localhost:") ||
            origin.startsWith("http://127.0.0.1:") ||
            origin.startsWith("https://localhost:") ||
            origin.startsWith("https://127.0.0.1:"))
        ) {
          return origin;
        }

        if (!origin) {
          return "*";
        }

        return origin;
      },
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .route("/properties", propertiesRoute)
  .route("/me", usersRoute)
  .route("/media", mediaRoute);

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
