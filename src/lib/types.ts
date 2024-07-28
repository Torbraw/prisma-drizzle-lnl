import { PrismaUserWithRelationsInclude } from './const';
import { Prisma } from '@prisma/client';
import { InferOutput } from 'valibot';
import { PrismaSearchQuerySchema, PrismaCreateUserSchema, PrismaUpdateUserSchema } from './schemas';

type Satisfies<T extends U, U> = T;

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  code?: string;
};

export type SortOrder = 'asc' | 'desc';

export type PrismaNestedSortOrder = { [key: string]: PrismaNestedSortOrder | SortOrder };

export type PrismaSearchQuery = InferOutput<typeof PrismaSearchQuerySchema>;

export type PrismaUserWithRelations = Prisma.UserGetPayload<{
  include: typeof PrismaUserWithRelationsInclude;
}>;

export type PrismaUserWithInfo = Prisma.UserGetPayload<{
  include: { userInfo: true };
}>;

export type PrismaUserWithAge = Omit<PrismaUserWithRelations, 'userInfo'> & {
  userInfo: Omit<PrismaUserWithRelations['userInfo'], 'birthYear'> & {
    age: number;
  };
};

export type PrismaUserWithMaturity = PrismaUserWithInfo & {
  userInfo: {
    maturity: 'MINOR' | 'ADULT';
  };
};

export type PrismaUserWithPermissionCount = PrismaUserWithInfo & {
  permissionCount: number;
};

export type PrismaCreateUser = Satisfies<
  InferOutput<typeof PrismaCreateUserSchema>,
  Omit<Prisma.UserCreateInput, 'createdBy' | 'updatedAt'>
>;

export type PrismaUpdateUser = Satisfies<
  InferOutput<typeof PrismaUpdateUserSchema>,
  Omit<Prisma.UserUpdateInput, 'createdBy' | 'updatedAt'>
>;
