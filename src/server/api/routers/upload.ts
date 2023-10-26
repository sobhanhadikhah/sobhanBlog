/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable prettier/prettier */
import { createTRPCRouter, protectedProcedure, } from '~/server/api/trpc';
import {  PutObjectCommand,  } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { env } from '~/env.mjs';
import {z} from "zod";
import { client } from '~/lib/aws/aws';

export const uploadRoute = createTRPCRouter({
  uploadCover: protectedProcedure
    .input(z.object({ file: z.string(), path: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        
        
        const fileName = Date.now();
        const { file, path } = input;
        const jpegBuffer = await sharp(Buffer.from(file, 'base64')).toFormat('jpeg').toBuffer();
        const param = {
          Body: jpegBuffer,
          Bucket: env.LIARA_BUCKET_NAME,
          Key: `${path}/${ctx.session.user.id}/${fileName}.jpg`,
          ContentType: 'image/jpeg',
        };
        await client.send(new PutObjectCommand(param), (er, data) => {
          if (er) {
            console.log(er);
          } else {
            console.log(data);
          }
        });
        return {
          status: 200,
          message: 'true',
          url: `https://sobhanblog.storage.iran.liara.space/${path}/${ctx.session.user.id}/${fileName}.jpg`,
        };
      } catch (error) {
        throw new Error('wrong');
      }
    }),
});
