import { useQuery } from '@tanstack/react-query'
import { usersListQuery } from '../services/users.api'
import type { UsersQuery } from '../types/user.types'

export function useUsers(query: UsersQuery) {
  return useQuery(usersListQuery(query))
}
