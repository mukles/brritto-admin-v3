import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { toError } from "@/shared/services/http";

type FetchConfig<T> = {
  skip?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

type FetchState<T> = {
  data: T | undefined;
  error: Error | null;
  /** Identifies the request this state belongs to; differs from the current one while fetching. */
  requestId: string | null;
};

/**
 * Runs `callback` on mount and whenever `deps` change (compared by value).
 * The in-flight request is aborted when deps change or the component unmounts,
 * so a slow stale response never overwrites a newer one. Previous data is kept
 * while the next request loads.
 */
export function useFetch<T>(
  callback: (signal: AbortSignal) => Promise<T>,
  { skip = false, ...config }: FetchConfig<T> = {},
  deps: readonly unknown[] = []
) {
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    error: null,
    requestId: null,
  });
  const [version, setVersion] = useState(0);
  const latestRef = useRef({ callback, config });
  const requestId = `${version}:${JSON.stringify(deps)}`;

  useLayoutEffect(() => {
    latestRef.current = { callback, config };
  });

  useEffect(() => {
    if (skip) return;
    const controller = new AbortController();
    const { callback, config } = latestRef.current;
    callback(controller.signal).then(
      (data) => {
        if (controller.signal.aborted) return;
        setState({ data, error: null, requestId });
        config.onSuccess?.(data);
      },
      (cause: unknown) => {
        if (controller.signal.aborted) return;
        const error = toError(cause);
        setState((prev) => ({ data: prev.data, error, requestId }));
        config.onError?.(error);
      }
    );
    return () => controller.abort();
  }, [skip, requestId]);

  const isFetching = !skip && state.requestId !== requestId;
  const error = isFetching ? null : state.error;

  return {
    data: state.data,
    error,
    isLoading: isFetching && state.data === undefined,
    isFetching,
    isSuccess: !isFetching && state.requestId !== null && error === null,
    isError: error !== null,
    refetch: useCallback(() => setVersion((v) => v + 1), []),
  };
}
