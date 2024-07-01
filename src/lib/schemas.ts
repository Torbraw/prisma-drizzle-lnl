import { string, number, minLength, minValue, integer, maxLength, maxValue, pipe } from 'valibot';

const defaultString = pipe(string(), minLength(1, 'Must not be empty'), maxLength(191, 'Exceeds max length of 191'));

const defaultPositiveNumber = (v = 2147483647) =>
  pipe(
    number(),
    minValue(0, 'Must be a positive number'),
    integer('Must be an integer'),
    maxValue(v, 'Exceeds max value of 2147483647'),
  );
