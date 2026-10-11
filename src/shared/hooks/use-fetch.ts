import { useEffect, useState } from "react";
import type { ApiErrorResponse } from "../types";

type Init<T> = {
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
  data: null | T;
};

type Config<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  skip?: boolean;
  initialData?: Init<T>;
};

const defaultConfig = {
  onSuccess: () => {},
  onError: () => {},
  skip: false,
  initialData: {
    isLoading: false,
    isSuccess: false,
    error: "",
    data: null,
  },
};

export const useFetch = <T>(
  callback: () => Promise<T>,
  config: Config<T> = defaultConfig,
  deps: any[] = [],
) => {
  const { onSuccess, onError, skip, initialData } = config;
  const [state, setState] = useState<Init<T>>(
    initialData || defaultConfig.initialData,
  );

  useEffect(() => {
    if (skip) return;

    fetching();
  }, [skip, ...deps]);

  const fetching = async () => {
    setState({
      isLoading: true,
      isSuccess: false,
      error: "",
      data: state.data,
    });
    try {
      const data = await callback();
      setState({
        isLoading: false,
        isSuccess: true,
        data,
        error: "",
      });
      onSuccess?.(data);
    } catch (error: unknown) {
      const err = error as ApiErrorResponse;
      const message =
        err.response?.data.message || err.message || "Something went wrong";
      setState({
        isLoading: false,
        isSuccess: false,
        data: state.data,
        error: message,
      });
      onError?.(message);
    }
  };

  return { ...state, refetch: fetching };
};
