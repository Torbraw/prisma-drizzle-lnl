import { Prisma } from '@prisma/client';
import { InferOutput } from 'valibot';
import { PrismaCreateUserSchema, PrismaUpdateUserSchema } from './schemas';

type Satisfies<T extends U, U> = T;

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  code?: string;
};

export type CreateUser = Satisfies<
  InferOutput<typeof PrismaCreateUserSchema>,
  Omit<Prisma.UserCreateInput, 'createdBy' | 'updatedAt'>
>;

export type UpdateUser = Satisfies<
  InferOutput<typeof PrismaUpdateUserSchema>,
  Omit<Prisma.UserUpdateInput, 'updatedAt'>
>;
