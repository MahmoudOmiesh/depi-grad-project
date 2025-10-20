import type { User } from "better-auth";
import { createFactory } from "hono/factory";
import { auth } from "~/lib/auth";
import { tryCatch } from "~/lib/utils";

type Env = {
  Variables: {
    user: User;
  };
};

const { createMiddleware } = createFactory<Env>();

export const getUser = createMiddleware(async (c, next) => {
  const { data: session, error: sessionError } = await tryCatch(
    auth.api.getSession({
      headers: c.req.header(),
    }),
  );

  if (sessionError || !session) {
    return c.json(
      {
        ok: false,
        error: {
          code: "UNAUTHORIZED" as const,
          message: "Unauthorized",
        },
      },
      401,
    );
  }

  c.set("user", session.user);
  await next();
});
