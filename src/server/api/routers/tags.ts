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
        await ctx.db.tag.create({
          data: { label: input.label, value: input.value },
        });
        return {
          status: 200,
          success: true, // You can return a success message or any other relevant data.
        };
      } catch (error) {
        throw new Error('Error creating a tag');
      }
    }),
  getAllTag: publicProcedure.query(({ ctx }) => {
    return ctx.db.tag.findMany();
  }),
});
