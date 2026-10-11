import type { AxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/shared/types";
import type { DashboardStats } from "../types/dashboard.types";

export interface DashboardService {
  getStats: (config?: AxiosRequestConfig) => ApiResponse<DashboardStats>;
}
