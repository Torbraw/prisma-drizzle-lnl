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
} from 'valibot';

const defaultString = (v = 191) =>
  pipe(string(), minLength(1, 'Must not be empty'), maxLength(v, `Exceeds max length of ${v.toString()}`));

const defaultPositiveNumber = (v = 2147483647) =>
  pipe(
    number(),
    integer('Must be an integer'),
    minValue(0, 'Must be a positive number'),
    maxValue(v, `Exceeds max value of ${v.toString()}`),
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

export const PaginationQuerySchema = optional(
  partial(
    object({
      page: pipe(string(), transform(Number), defaultPositiveNumber(), minValue(1, 'Must be at least 1')),
      limit: pipe(string(), transform(Number), defaultPositiveNumber(100)),
    }),
  ),
);
