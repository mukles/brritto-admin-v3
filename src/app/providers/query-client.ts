import { MutationCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/shared/services/http'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      errorToast?: boolean
    }
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.errorToast === false) return
      toast.error(
        error instanceof ApiError ? error.message : 'Something went wrong. Please try again.',
      )
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status < 500) && failureCount < 2,
    },
  },
})
