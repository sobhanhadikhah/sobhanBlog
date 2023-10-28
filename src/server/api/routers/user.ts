/* eslint-disable prettier/prettier */
import { protectedProcedure,  createTRPCRouter, publicProcedure } from '../trpc';
import {z} from "zod"
export const UserInfoRoute = createTRPCRouter({
  userInfo: protectedProcedure.input(z.object({id:z.string() || z.undefined()})).query(async ({ ctx,input }) => {
    try {
      return {
        user: await ctx.db.user.findFirst({where:{id:input.id},include:{favorite:true,}}),
      };
    } catch (error) {
      throw new Error("wrong")
    }
  }),
  userInfoProfile: publicProcedure.input(z.object({id:z.string() || z.undefined()})).query(async ({ ctx,input }) => {
    try {
      return {
        user: await ctx.db.user.findFirst({where:{id:input.id},include:
          {favorite:true,posts:{
            include:{
              user:true,
              like:true,
              favorite:true,
              tags:true,
              comment:true,
              _count:{
                select:{
                  like:true,
                  comment:true,
                   favorite:true
                }
              }
            }
          },comment:true,likes:true,sessions:true,_count:{
            select:{
              likes:true,
              comment:true,
              posts:true,
              favorite:true
            }
          }}}),
      };
    } catch (error) {
      throw new Error("wrong")
    }
  }),
});
