import { Prisma } from '@prisma/client';

export const PrismaUserWithRelationsInclude = {
  role: {
    include: { permissions: true },
  },
  userInfo: true,
} satisfies Prisma.UserInclude;

export const SORT_REGEX = /^([A-z]+\.)*([A-z]+){1}:{1}(asc|desc){1}$/;

export const PERMISSION_TYPES = {
  UI: 'UI',
  API: 'API',
} as const;
