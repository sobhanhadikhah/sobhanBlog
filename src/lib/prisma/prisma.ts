/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient;
}

let prisma: PrismaClient;

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
} else {
  if (!window.prisma) {
    window.prisma = new PrismaClient();
  }
  prisma = window.prisma;
}

export default prisma;
