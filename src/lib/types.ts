import { PrismaUserWithRelationsInclude } from './const';
import { Prisma } from '@prisma/client';
import { InferOutput } from 'valibot';
import {
  PrismaSearchQuerySchema,
  PrismaCreateUserSchema,
  PrismaUpdateUserSchema,
  DrizzleCreateUserSchema,
  DrizzleUpdateUserSchema,
  DrizzleSearchQuerySchema,
} from './schemas';
import {
  DrizzleInsertUserInfo,
  DrizzleInsertUser,
  DrizzleUser,
  DrizzleUserInfo,
  DrizzleRole,
  DrizzlePermission,
} from './drizzle/schema';

type Satisfies<T extends U, U> = T;

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  code?: string;
};

export type SortOrder = 'asc' | 'desc';

//#region Prisma

export type PrismaNestedSortOrder = { [key: string]: PrismaNestedSortOrder | SortOrder };

export type PrismaSearchQuery = InferOutput<typeof PrismaSearchQuerySchema>;

export type PrismaUserWithRelations = Prisma.UserGetPayload<{
  include: typeof PrismaUserWithRelationsInclude;
}>;

export type PrismaUserWithAge = Omit<PrismaUserWithRelations, 'userInfo'> & {
  userInfo: Omit<PrismaUserWithRelations['userInfo'], 'birthYear'> & {
    age: number;
  };
};

type PrismaUserWithInfo = Prisma.UserGetPayload<{
  include: { userInfo: true };
}>;

export type PrismaFindAllResponse = {
  users: PrismaUserWithInfo[];
  totalCount: number;
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

//#endregion

//#region Drizzle

export type DrizzleSearchQuery = InferOutput<typeof DrizzleSearchQuerySchema>;

type DrizzleWithUserInfo = Omit<DrizzleUser, 'password'> & {
  userInfo: DrizzleUserInfo;
};
export type DrizzleFindAllResponse = {
  users: DrizzleWithUserInfo[];
  totalCount: number;
};

export type DrizzleUserWithPermissionCount = DrizzleWithUserInfo & {
  permissionCount: number;
};

export type DrizzleUserWithMaturity = DrizzleWithUserInfo & {
  userInfo: {
    maturity: 'MINOR' | 'ADULT';
  };
};

export type DrizzleUserWithAge = Omit<DrizzleUserWithRelations, 'userInfo'> & {
  userInfo: Omit<DrizzleUserInfo, 'birthYear'> & {
    age: number;
  };
};

export type DrizzleUserWithRelations = Omit<DrizzleUser, 'password'> & {
  userInfo: DrizzleUserInfo;
  role: DrizzleRole & {
    permissions: DrizzlePermission[];
  };
};

export type DrizzleCreateUser = Satisfies<
  InferOutput<typeof DrizzleCreateUserSchema>,
  Omit<DrizzleInsertUser, 'userInfoId'> & {
    userInfo: DrizzleInsertUserInfo;
  }
>;

export type DrizzleUpdateUser = Satisfies<
  InferOutput<typeof DrizzleUpdateUserSchema>,
  Partial<
    Omit<DrizzleInsertUser, 'password'> & {
      userInfo: Partial<DrizzleInsertUserInfo>;
    }
  >
>;

//#endregion
