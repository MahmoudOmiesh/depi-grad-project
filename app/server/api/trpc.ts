import superjson from "superjson";

import { ZodError } from "zod";
import { initTRPC, TRPCError } from "@trpc/server";

import { db } from "~/server/db/root";
import { auth } from "~/lib/auth";
import { tryCatch } from "~/lib/utils";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

// Middleware for timing procedure execution and adding an artificial delay in development.
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

const authMiddleware = t.middleware(async ({ next, ctx }) => {
  const { headers } = ctx;
  const { data: session, error: sessionError } = await tryCatch(
    auth.api.getSession({ headers })
  );

  if (sessionError || !session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session,
    },
  });
});

export const publicProcedure = t.procedure.use(timingMiddleware);
export const authedProcedure = t.procedure
  .use(timingMiddleware)
  .use(authMiddleware);
