import { useMutation } from '@tanstack/react-query'
import { login } from '../services/session'

export function useLogin() {
  return useMutation({ mutationFn: login, meta: { errorToast: false } })
}
