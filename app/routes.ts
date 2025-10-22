import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("/api/auth/*", "routes/api/auth.ts"),

  layout("routes/layout.tsx", [index("routes/home.tsx")]),
] satisfies RouteConfig;
