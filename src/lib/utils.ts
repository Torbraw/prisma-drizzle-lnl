import { NestedSortOrder, SearchQuery, SortOrder } from './types';

export const getPrismaArgsFromQuery = (query: SearchQuery) => {
  const args: {
    skip?: number;
    take?: number;
    orderBy?: NestedSortOrder[];
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

export const formatSort = (sort: string): NestedSortOrder => {
  const [key, value] = sort.split(':');

  if (key.includes('.')) {
    const arr = key.split('.');
    const last = arr.pop()!;
    let nestedObject: NestedSortOrder = { [last]: value as SortOrder };
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
