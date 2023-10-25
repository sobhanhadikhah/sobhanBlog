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
  postByTag: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    try {
      const posts = await ctx.db.post.findMany({
        include: {
          tags: true,
          user: true,
          comment: true,
          like: true,
          _count: {
            select: {
              comment: true,
              like: true,
              favorite: true,
            },
          },
        },
        where: {
          tags: {
            some: {
              id: input.id,
            },
          },
        },
      });
      return {
        posts,
        status: 200,
        success: true,
      };
    } catch (error) {}
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
  getAllTag: publicProcedure.query(({ ctx }) => {
    return ctx.db.tag.findMany({});
  }),
});
