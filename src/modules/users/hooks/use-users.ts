import { useFetch } from "@/shared/hooks/use-fetch";
import type { RoutePagination } from "@/shared/constant";
import { usersService } from "../services";

export function useUsers(params: RoutePagination) {
  return useFetch(() => usersService.getUsers(params), {}, [
    params.page,
    params.pageSize,
    params.search,
    params.startDate,
    params.endDate,
  ]);
}
