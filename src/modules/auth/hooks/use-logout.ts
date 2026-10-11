import { useMutation } from '@tanstack/react-query'
import { logout } from '../services/session'

export function useLogout() {
  return useMutation({ mutationFn: logout })
}
