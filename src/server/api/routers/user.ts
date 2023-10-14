/* eslint-disable prettier/prettier */
import { protectedProcedure,  createTRPCRouter } from '../trpc';
import {z} from "zod"
export const UserInfoRoute = createTRPCRouter({
  userInfo: protectedProcedure.input(z.object({id:z.string() || z.undefined()})).query(async ({ ctx,input }) => {
    try {
      return {
        user: await ctx.db.user.findFirst({where:{id:input.id},include:{favorite:true}}),
      };
    } catch (error) {
      throw new Error("wrong")
    }
  }),
});
