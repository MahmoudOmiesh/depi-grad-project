import { createHonoServer } from "react-router-hono-server/node";
import { Hono } from "hono";
import { propertiesRoute } from "./routes/properties";

export const app = new Hono();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiRoutes = app.basePath("/api").route("/properties", propertiesRoute);

export default createHonoServer({ app });
export type ApiRoutes = typeof apiRoutes;
