import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("/api/auth/*", "routes/api/auth.ts"),

  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("/add-property", "routes/add-property.tsx"),
    route("/properties", "routes/properties.tsx"),
    route("/properties/:id", "routes/property.tsx"),
    route("/my-properties", "routes/my-properties.tsx"),
    route("/register", "routes/register.tsx"),
  ]),
] satisfies RouteConfig;
