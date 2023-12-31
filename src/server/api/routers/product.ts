/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        order: z.string().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { cursor, limit, order } = input;
        const orderBy = [];

        // Add the default ordering condition if 'order' is not specified
        if (!order) {
          orderBy.push({ createdAt: 'desc' });
        } else {
          // Parse the 'order' parameter and add multiple ordering conditions
          const orderFields = order.split(',');

          for (const field of orderFields) {
            if (field === 'createdAt') {
              orderBy.push({ createdAt: 'desc' });
            } else if (field === 'likeCount') {
              orderBy.push({ like: { _count: 'desc' } });
            }
            // Add more conditions for other fields as needed
          }
        }
        const posts = await ctx.db.post.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,

          orderBy: orderBy as never[],
          include: {
            tags: true,
            like: true,
            _count: {
              select: {
                like: true,
                comment: true,
              },
            },
            favorite: {
              where: {
                userId: ctx.session?.user.id,
              },
            },
            comment: true,
            user: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (posts.length > limit) {
          const nextItem = posts.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }
        const count = await ctx.db.post.count();
        const totalPages = Math.ceil(count / input.limit);

        return {
          posts,
          nextCursor,
          count,
          totalPages,
        };
      } catch (error) {
        // Handle errors appropriately
        throw error;
      }
    }),
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        image: z.string().nullable(),
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const tagIds = input.tags;
        const createdPost = await ctx.db.post.create({
          data: {
            title: input.title,
            content: input.content,
            userId: ctx.session.user.id,
            image: input.image,
            tags: {
              connect: tagIds.map((tagId) => ({ id: tagId })), // Connect the provided tag IDs to the post
            },
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
        const existingLike = await ctx.db.like.findFirst({
          where: { userId: input.userId, postId: input.postId },
        });

        if (existingLike) {
          // The user has already liked the post; let's remove the like.
          await ctx.db.like.delete({
            where: { id: existingLike.id, postId: existingLike.postId },
          });
        } else {
          // The user has not liked the post; let's create a new like record.
          await ctx.db.like.create({
            data: { userId: input.userId, postId: input.postId },
          });
        }

        return {
          status: 200,
          success: true,
        };
      } catch (error) {
        console.error('Error in likePost route:', error);
        return {
          status: 500,
          success: false,
          error: 'An error occurred while processing the like action.',
        };
      }
    }),

  createCategory: protectedProcedure
    .input(z.object({ label: z.string(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { label, value } = input;
        const category = await ctx.db.category.create({
          data: { label, value },
        });
        return {
          category,
          status: 200,
          message: 'category Create it .',
          success: true,
        };
      } catch (error) {
        throw new Error('Something went wrong');
      }
    }),
  isUserLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const userId = await ctx.session.user.id;
        console.log('userid', userId);
        const like = await ctx.db.like.findFirst({
          where: { userId: userId, postId: input.postId },
        });

        return {
          like,
          isLike: !!like,
          status: 200,
          success: true,
        };
      } catch (error) {
        // Handle errors appropriately, e.g., log the error
        console.error('Error in isUserLike route:', error);

        return {
          isLike: false,
          status: 500, // Internal Server Error
          success: false,
        };
      }
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
  setFavorite: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const isFavorite = await ctx.db.favorite.findFirst({
          where: { userId: ctx.session.user.id, postId: input.postId },
        });
        if (isFavorite) {
          await ctx.db.favorite.delete({
            where: { postId: input.postId, userId: ctx.session.user.id, id: isFavorite.id },
          });
        } else {
          await ctx.db.favorite.create({
            data: { postId: input.postId, userId: ctx.session.user.id },
          });
        }
        return {
          status: 200,
          message: 'Post Saved.',
          success: true,
        };
      } catch (error) {}
    }),
  /* getFavorite: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.favorite.findMany({
          take: input.limit,
          where: { userId: ctx.session.user.id },
          include: {
            post: {
              include: {
                user: true,
                _count: {
                  select: {
                    like: true,
                    comment: true,
                    favorite: true,
                  },
                },
              },
            },
            user: true,
          },
        });
        return {
          status: 200,
          data,
          success: true,
        };
      } catch (error) {}
    }), */
  getFavorite: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { cursor, limit } = input;

        const posts = await ctx.db.favorite.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          where: {
            userId: ctx.session?.user.id,
          },
          include: {
            post: {
              include: {
                user: true,
                _count: {
                  select: {
                    like: true,
                    comment: true,
                    favorite: true,
                  },
                },
              },
            },
            user: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (posts.length > limit) {
          const nextItem = posts.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }
        const count = await ctx.db.favorite.count({ where: { userId: ctx.session?.user.id } });
        const totalPages = Math.ceil(count / input.limit);

        return {
          posts,
          nextCursor,
          count,
          totalPages,
        };
      } catch (error) {
        // Handle errors appropriately
        throw error;
      }
    }),

  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    return {
      post: await ctx.db.post.findFirst({
        where: { id: input.id },
        include: {
          like: true,
          user: true,
          tags: true,
          favorite: { where: { userId: ctx.session?.user.id } },
          comment: { include: { user: true } },
          _count: { select: { like: true, comment: true, favorite: true } },
        },
      }),
    };
  }),
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.post.findMany({
          take: 10,
          include: {
            user: true,
            tags: true,
            _count: {
              select: {
                like: true,
                comment: true,
                favorite: true,
              },
            },
          },
          where: {
            OR: [
              {
                title: {
                  contains: input.query,
                },
              },
              {
                tags: {
                  some: {
                    value: input.query,
                  },
                },
              },
            ],
          },
        });
        return {
          query: input.query,
          result,
          status: 200,
          message: 'true',
        };
      } catch (error) {}
    }),
});
