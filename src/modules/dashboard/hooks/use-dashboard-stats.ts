import { useFetch } from "@/shared/hooks/use-fetch";
import { dashboardApi } from "../services/dashboard.api";

export function useDashboardStats() {
  return useFetch(dashboardApi.getStats);
}
