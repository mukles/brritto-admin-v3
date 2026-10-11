import { useFetch } from "@/shared/hooks/use-fetch";
import { dashboardService } from "../services";

export function useDashboardStats() {
  return useFetch(() => dashboardService.getStats());
}
