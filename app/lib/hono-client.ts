import type { ApiRoutes } from "~/server/api";
import { hc } from "hono/client";

const honoClient = hc<ApiRoutes>("/");
export const api = honoClient.api;
