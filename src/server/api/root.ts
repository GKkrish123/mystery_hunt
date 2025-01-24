import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { mysteryRouter } from "@/server/api/routers/mystery";
import { userRouter } from "@/server/api/routers/hunter";
import { categoryRouter } from "./routers/category";
import { eventsRouter } from "./routers/events";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  mystery: mysteryRouter,
  category: categoryRouter,
  user: userRouter,
  events: eventsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
