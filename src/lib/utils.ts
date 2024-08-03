import { PrismaNestedSortOrder, SortOrder } from './types';

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
