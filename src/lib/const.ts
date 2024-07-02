import { Prisma } from '@prisma/client';

export const PrismaUserWithRelationsInclude = {
  role: {
    include: { permissions: true },
  },
  userInfo: true,
} satisfies Prisma.UserInclude;
