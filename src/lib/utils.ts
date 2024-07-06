import { PaginationQuery } from './types';

export const getPrismaArgsFromQuery = (query: PaginationQuery) => {
  const args: {
    skip?: number;
    take?: number;
  } = {};
  if (query) {
    if (query.limit !== undefined) {
      args.take = query.limit;
      if (query.page !== undefined) {
        args.skip = query.limit * (query.page - 1);
      }
    }
  }

  return args;
};
