import apiClient from "@/shared/services/api-client";
import type { DashboardService } from "./type";

export const dashboardService: DashboardService = {
  getStats: (config) => apiClient.get("/dashboard/stats", config),
};
