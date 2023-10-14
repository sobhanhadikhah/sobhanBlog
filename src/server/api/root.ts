import { exampleRouter } from '~/server/api/routers/example';
import { productRouter } from './routers/product';
import { createTRPCRouter } from '~/server/api/trpc';
import { tagsRouter } from './routers/tags';
import { UserInfoRoute } from './routers/user';
import { CategoryRoute } from './routers/category';
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  post: productRouter,
  tag: tagsRouter,
  user: UserInfoRoute,
  category: CategoryRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
