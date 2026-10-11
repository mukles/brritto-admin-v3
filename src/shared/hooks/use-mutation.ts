import { useState } from "react";
import type { ApiErrorResponse } from "../types";

type Init<TData> = {
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
  data: null | TData;
};

type Config<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
};

const defaultConfig = {
  onSuccess: () => {},
  onError: () => {},
};

export const useMutation = <TData, TVariables = void>(
  callback: (variables: TVariables) => Promise<TData>,
  config: Config<TData> = defaultConfig,
): [
  (variables: TVariables) => Promise<TData | null>,
  Init<TData> & { reset: () => void },
] => {
  const [state, setState] = useState<Init<TData>>({
    isLoading: false,
    isSuccess: false,
    error: "",
    data: null,
  });

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    setState({
      isLoading: true,
      isSuccess: false,
      error: "",
      data: null,
    });

    try {
      const data = await callback(variables);
      config.onSuccess?.(data);
      setState({
        isLoading: false,
        isSuccess: true,
        error: "",
        data,
      });
      return data;
    } catch (error) {
      const err = error as ApiErrorResponse;
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      setState({
        isLoading: false,
        isSuccess: false,
        error: message,
        data: null,
      });
      config.onError?.(message);
      return null;
    }
  };

  const reset = () => {
    setState({
      isLoading: false,
      isSuccess: false,
      error: "",
      data: null,
    });
  };

  return [mutate, { ...state, reset }];
};
