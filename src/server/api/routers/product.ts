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
        const createdPost = await ctx.db.post.create({
          data: {
            title: input.title,
            content: input.content,
            userId: ctx.session.user.id,
            image: input.image || null,
            tags: input.tags,
            writerInfoEmail: ctx.session.user.email ?? '',
            writerInfoImage: ctx.session.user.image ?? '',
            writerInfoName: ctx.session.user.name ?? '',
          },
        });

        return {
          status: 200,
          success: true,
          post: createdPost,
        };
      } catch (error) {
        throw new Error('Error creating a post');
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
  likePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.db.post.findUnique({ where: { id: input.id } });

        if (post) {
          const updatedLikes = post.like! + 1;
          // If the post doesn't exist, you can handle it accordingly (e.g., return an error)
          const updateProduct = await ctx.db.post.update({
            where: { id: input.id },
            data: { like: updatedLikes },
          });
          return updateProduct;
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {}
    }),
  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    return {
      post: await ctx.db.post.findFirst({ where: { id: input.id } }),
    };
  }),
});
