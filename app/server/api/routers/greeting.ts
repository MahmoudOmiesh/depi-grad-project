import { authedProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const greetingRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return "Hello, world!";
  }),

  user: authedProcedure.query(({ ctx }) => {
    return {
      name: ctx.session.user.name,
    };
  }),
});
