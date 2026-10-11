export type ApiResponse<T> = Promise<{
  data: T;
  limit?: number;
  page?: number;
  total?: number;
}>;

export type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;
