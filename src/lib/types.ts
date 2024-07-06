import { PrismaUserWithRelationsInclude } from './const';
import { Prisma } from '@prisma/client';
import { InferOutput } from 'valibot';
import { PaginationQuerySchema, PrismaCreateUserSchema, PrismaUpdateUserSchema } from './schemas';

type Satisfies<T extends U, U> = T;

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  code?: string;
};

export type PrismaUserWithRelations = Prisma.UserGetPayload<{
  include: typeof PrismaUserWithRelationsInclude;
}>;

export type PrismaUserWithAge = Omit<PrismaUserWithRelations, 'userInfo'> & {
  userInfo: Omit<PrismaUserWithRelations['userInfo'], 'birthYear'> & {
    age: number;
  };
};

export type PrismaUserWithMaturity = PrismaUserWithRelations & {
  userInfo: {
    maturity: 'MINOR' | 'ADULT';
  };
};

export type PrismaCreateUser = Satisfies<
  InferOutput<typeof PrismaCreateUserSchema>,
  Omit<Prisma.UserCreateInput, 'createdBy' | 'updatedAt'>
>;

export type PrismaUpdateUser = Satisfies<
  InferOutput<typeof PrismaUpdateUserSchema>,
  Omit<Prisma.UserUpdateInput, 'createdBy' | 'updatedAt'>
>;

export type PaginationQuery = InferOutput<typeof PaginationQuerySchema>;
