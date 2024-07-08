import {
  string,
  number,
  minLength,
  minValue,
  integer,
  maxLength,
  maxValue,
  pipe,
  object,
  regex,
  boolean,
  optional,
  omit,
  partial,
  transform,
  checkItems,
  mapItems,
} from 'valibot';
import { SORT_REGEX } from './const';
import { formatPrismaSort } from './utils';

const defaultString = (v = 191) =>
  pipe(string(), minLength(1, 'Must not be empty'), maxLength(v, `Exceeds max length of ${toString()}`));

const defaultPositiveNumber = (v = 2147483647) =>
  pipe(
    number(),
    integer('Must be an integer'),
    minValue(0, 'Must be a positive number'),
    maxValue(v, `Exceeds max value of ${toString()}`),
  );

const passwordValidation = pipe(
  string(),
  minLength(8, 'Must be at least 8 characters'),
  maxLength(191, 'Must be at most 191 characters'),
  regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  ),
);

const userInfoSchema = object({
  address: defaultString(),
  phone: defaultString(20),
  birthYear: defaultPositiveNumber(),
  name: optional(defaultString()),
});

const pagniationQuery = object({
  page: pipe(string(), transform(Number), defaultPositiveNumber(), minValue(1, 'Must be at least 1')),
  limit: pipe(string(), transform(Number), defaultPositiveNumber(100)),
});

//#region Prisma
export const PrismaCreateUserSchema = object({
  email: defaultString(),
  password: passwordValidation,
  role: object({
    connect: object({
      id: defaultPositiveNumber(),
    }),
  }),
  userInfo: object({
    create: userInfoSchema,
  }),
});

export const PrismaUpdateUserSchema = partial(
  object({
    ...omit(PrismaCreateUserSchema, ['password']).entries,
    userInfo: object({
      update: partial(userInfoSchema),
    }),
    isActive: boolean(),
  }),
);

const prismaSort = pipe(
  string(),
  transform((i) => i.split(';')),
  maxLength(5, 'Must not exceed 5 elements'),
  checkItems((i) => SORT_REGEX.test(i), `Must match regex ${SORT_REGEX.toString()}`),
  mapItems((i) => formatPrismaSort(i)),
);

export const PrismaSearchQuerySchema = optional(partial(object({ ...pagniationQuery.entries, sort: prismaSort })));
//#endregion
