import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/services/http'
import type { Paginated } from '@/shared/types/api'
import type { User, UsersQuery } from '../types/user.types'

export const usersApi = {
  list: ({ page, pageSize }: UsersQuery) =>
    api.get<Paginated<User>>(`/users?page=${page}&pageSize=${pageSize}`),
}

export const usersListQuery = (query: UsersQuery) =>
  queryOptions({
    queryKey: ['users', 'list', query],
    queryFn: () => usersApi.list(query),
    placeholderData: keepPreviousData,
  })
