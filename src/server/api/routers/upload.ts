/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable prettier/prettier */
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '~/env.mjs';
import { z } from "zod";
import { client } from '~/lib/aws/aws';
import Jimp from 'jimp';

export const uploadRoute = createTRPCRouter({
  uploadCover: protectedProcedure
    .input(z.object({ file: z.string(), path: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const fileName = Date.now().toString();
        const { file, path } = input;

        // Convert base64 image to a buffer
        const imageBuffer = Buffer.from(file, 'base64');

        // Load the image with Jimp
        const image = await Jimp.read(imageBuffer);

        // Resize the image (you can adjust width and height as needed)
         // For example, resize to 200x200 pixels

        // Convert the image back to a buffer
        const processedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        const param = {
          Body: processedImageBuffer,
          Bucket: env.LIARA_BUCKET_NAME,
          Key: `${path}/${fileName}.jpg`,
          ContentType: 'image/jpeg',
        };

       await client.send(new PutObjectCommand(param));

        return {
          status: 200,
          message: 'true',
          url: `https://sobhanblog.storage.iran.liara.space/${path}/${fileName}.jpg`,
        };
      } catch (error) {
        throw new Error('An error occurred while processing the image.');
      }
    }),
});
