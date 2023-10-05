import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({ include: { like: true, comment: true, user: true } });
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
          message: 'Delete it !',
          status: 200,
          success: true,
        };
      } catch (error) {
        throw new Error('Error deleting a product'); // Handle the error as needed.
      }
    }),
  likePost: protectedProcedure
    .input(z.object({ userId: z.string(), postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.db.like.findFirst({
          where: { userId: input.userId, postId: input.postId },
        });
        if (post) {
          await ctx.db.like.delete({
            where: { userId: input.userId, postId: input.postId, id: post.id },
          });
        } else {
          await ctx.db.like.create({
            data: { userId: input.userId, postId: input.postId },
          });
        }
        return {
          status: 200,
          success: true,
        };
      } catch (error) {
        return {
          status: 500,
          success: true,
        };
      }
    }),
  isUserLike: protectedProcedure
    .input(z.object({ userId: z.string(), postId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const like = await ctx.db.like.findFirst({
          where: { userId: input.userId, postId: input.postId },
        });
        return {
          isLike: !!like,
          status: 200,
          success: true,
        };
      } catch (error) {}
    }),
  createComment: protectedProcedure
    .input(z.object({ userId: z.string(), postId: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = await ctx.db.comment.create({
          data: { userId: input.userId, postId: input.postId, text: input.text },
        });
        return {
          comment,
          status: 200,
          message: 'Comment Create it .',
          success: true,
        };
      } catch (error) {
        throw new Error('Something went wrong');
      }
    }),

  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    return {
      post: await ctx.db.post.findFirst({
        where: { id: input.id },
        include: { like: true, user: true, comment: { include: { user: true } } },
      }),
    };
  }),
});
