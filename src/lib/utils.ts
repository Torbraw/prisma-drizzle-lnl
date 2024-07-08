import { PrismaNestedSortOrder, PrismaSearchQuery, SortOrder } from './types';

export const getPrismaArgsFromQuery = (query: PrismaSearchQuery) => {
  const args: {
    skip?: number;
    take?: number;
    orderBy?: PrismaNestedSortOrder[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where?: any;
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
    if (query.search) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      args.where = query.search;
    }
  }

  return args;
};

export const formatPrismaSort = (sort: string): PrismaNestedSortOrder => {
  const [key, value] = sort.split(':');

  if (key.includes('.')) {
    const arr = key.split('.');
    const last = arr.pop()!;
    let nestedObject: PrismaNestedSortOrder = { [last]: value as SortOrder };
    // Iterate in reverse order to build the nested structure.
    for (let i = arr.length - 1; i >= 0; i--) {
      nestedObject = { [arr[i]]: nestedObject };
    }
    return nestedObject;
  }
  return { [key]: value as SortOrder };
};

// /**
//  * @param keysValues All the valid keys separated by '|'
//  * @returns A regex that matches the format of a sort query
//  */
// export const getSortRegex = (keysValues: string) => `^(${keysValues}+\.)*(${keysValues}+){1}:{1}(asc|desc){1}$`;
