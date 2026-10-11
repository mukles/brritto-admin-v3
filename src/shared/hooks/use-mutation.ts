import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage, toError } from "@/shared/services/http";

type MutationConfig<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  /** Show a toast when the mutation fails. Defaults to true. */
  errorToast?: boolean;
};

type MutationState<TData> = {
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  data: TData | null;
};

const IDLE = { isLoading: false, isSuccess: false, error: null, data: null };

/**
 * Returns `[mutate, state]`. `mutate` never throws: it resolves to the result,
 * or `null` on failure (the error is in `state.error` and passed to `onError`).
 */
export function useMutation<TData, TVariables = void>(
  callback: (variables: TVariables) => Promise<TData>,
  config: MutationConfig<TData> = {}
) {
  const [state, setState] = useState<MutationState<TData>>(IDLE);
  const latestRef = useRef({ callback, config });
  const callIdRef = useRef(0);

  useLayoutEffect(() => {
    latestRef.current = { callback, config };
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      const { callback, config } = latestRef.current;
      const callId = ++callIdRef.current;
      const isLatest = () => callId === callIdRef.current;
      setState({ ...IDLE, isLoading: true });

      try {
        const data = await callback(variables);
        if (isLatest())
          setState({ isLoading: false, isSuccess: true, error: null, data });
        config.onSuccess?.(data);
        return data;
      } catch (cause) {
        const error = toError(cause);
        if (isLatest()) setState({ ...IDLE, error });
        if (config.errorToast !== false) toast.error(getErrorMessage(error));
        config.onError?.(error);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    callIdRef.current++;
    setState(IDLE);
  }, []);

  return [mutate, { ...state, reset }] as const;
}
