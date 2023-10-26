/* eslint-disable prettier/prettier */
import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';
import { env } from '~/env.mjs';

const s3Config: S3ClientConfig = {
  region: 'default', // Replace 'your-aws-region' with the appropriate AWS region, e.g., 'us-east-1'
  endpoint: env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: env.LIARA_ACCESS_KEY,
    secretAccessKey: env.LIARA_SECRET_KEY,
  },
};
export const client = new S3Client(s3Config);
