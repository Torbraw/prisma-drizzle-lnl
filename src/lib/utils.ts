import { SearchQuery } from './types';

export const getPrismaArgsFromQuery = (query: SearchQuery) => {
  const args: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>[];
  } = {};

  if (query) {
    if (query.limit !== undefined) {
      args.take = query.limit;
      if (query.page !== undefined) {
        args.skip = query.limit * (query.page - 1);
      }
    }
    if (query.sort !== undefined) {
      args.orderBy = query.sort;
    }
  }

  return args;
};
