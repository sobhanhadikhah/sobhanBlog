/* eslint-disable prettier/prettier */
import { protectedProcedure, publicProcedure, createTRPCRouter } from '../trpc';
import {z} from "zod"
export const UserInfoRoute = createTRPCRouter({
  userInfo: protectedProcedure.input(z.object({id:z.string() || z.undefined()})).query(async ({ ctx,input }) => {
    try {
      return {
        user: await ctx.db.user.findFirst({where:{id:input.id}}),
      };
    } catch (error) {
      console.log(error);
    }
  }),
});
