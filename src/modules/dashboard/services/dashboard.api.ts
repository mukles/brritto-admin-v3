import { api } from "@/shared/services/http";
import type { DashboardStats } from "../types/dashboard.types";

export const dashboardApi = {
  getStats: (signal?: AbortSignal) =>
    api.get<DashboardStats>("/dashboard/stats", { signal }),
};
