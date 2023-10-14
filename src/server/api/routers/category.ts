/* eslint-disable prettier/prettier */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../../server/api/trpc';

export const CategoryRoute = createTRPCRouter({
  getCategory: publicProcedure.query( async ({ctx})=>{
    try {
      return {
        categories: await ctx.db.category.findMany(),
        status:200
    }
    } catch (error) {
      
    }
  }),
  deleteCategory: protectedProcedure.
  input(z.object({id:z.string()})).
  mutation(async ({ctx,input})=>{
    try {
    await ctx.db.category.delete({where:{id:input.id}})
    return {
      status:200,
      message: "category delete it",
    }   
    } catch (error) {
      throw new Error("failed");
    }
  }),
  createCategory: protectedProcedure
  .input(z.object({ label: z.string(), value: z.string() }))
  .mutation(async ({ ctx, input }) => {
      try {
        const {label,value} = input
      const category = await ctx.db.category.create({
        data: {  label,value},
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

})
