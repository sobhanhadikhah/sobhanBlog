/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const tagsRouter = createTRPCRouter({
  createTag: protectedProcedure
    .input(z.object({ label: z.string(), value: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const isTag = await ctx.db.tag.findFirst({
          where: { value: input.value, AND: { label: input.label } },
        });
        if (isTag) {
          return {
            message: 'we have tag',
            status: 200,
            success: true, // You can return a success message or any other relevant data.
          };
        } else {
          await ctx.db.tag.create({
            data: { label: input.label, value: input.value },
          });
          return {
            status: 200,
            success: true, // You can return a success message or any other relevant data.
          };
        }
      } catch (error) {
        throw new Error('Error creating a tag');
      }
    }),
  postByTag: publicProcedure
    .input(
      z.object({
        id: z.string(),
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
          where: {
            tags: {
              some: {
                id: input.id,
              },
            },
          },
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
  getAllTagResult: publicProcedure.query(({ ctx }) => {
    return ctx.db.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      where: {
        posts: {
          some: {},
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
    });
  }),
  tagInfoById: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    const { id } = input;
    return ctx.db.tag.findFirst({
      where: { id },
      include: { _count: { select: { posts: true } } },
    });
  }),
  getAllTag: publicProcedure.query(({ ctx }) => {
    return ctx.db.tag.findMany({});
  }),
});
