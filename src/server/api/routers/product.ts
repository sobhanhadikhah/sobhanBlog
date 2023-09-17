import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const productRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.title}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany();
  }),
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        image: z.string(),
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.post.create({
          data: {
            title: input.title,
            content: input.content,
            image: input.image || null,
            tags: input.tags,
          },
        });
        return {
          status: 200,
          success: true, // You can return a success message or any other relevant data.
        };
      } catch (error) {
        throw new Error('Error creating a post'); // Handle the error as needed.
      }
    }),
  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    try {
      return {
        post: await ctx.db.post.findFirst({ where: { id: input.id } }),
      };
    } catch (error) {
      throw new Error('Error creating a post'); // Handle the error as needed.
    }
  }),
  deleteProduct: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.post.delete({ where: { id: input.id } });
        return {
          status: 200,
          success: true,
        };
      } catch (error) {
        throw new Error('Error creating a post'); // Handle the error as needed.
      }
    }),
  getProductMessage: protectedProcedure.query(() => {
    return 'this is product route';
  }),
});
