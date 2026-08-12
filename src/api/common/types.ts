export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export enum QueryKey {
  //Add more
  USER = 'user',
}
