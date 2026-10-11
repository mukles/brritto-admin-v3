import type { AxiosError, AxiosRequestConfig } from "axios";

export type ApiClient = {
  post<T = any, R = T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  get<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
  patch<T = any, R = T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  put<T = any, R = T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  delete<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
};

export type ApiResponse<T> = Promise<{
  data: T;
  limit?: number;
  page?: number;
  total?: number;
}>;

export interface ApiErrorResponse extends AxiosError<{
  message: string;
  code: number;
}> {}

export type User = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;
