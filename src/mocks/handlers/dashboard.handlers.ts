import { http, HttpResponse } from "msw";
import type { DashboardStats } from "@/modules/dashboard";
import { users } from "../db";
import { apiUrl, authenticate, networkDelay } from "../utils";

export const dashboardHandlers = [
  http.get(apiUrl("/dashboard/stats"), async ({ request }) => {
    await networkDelay();
    const { error } = authenticate(request, "dashboard:view");
    if (error) return error;

    const stats: DashboardStats = {
      totalUsers: { value: users.length, change: 12.4 },
      activeUsers: {
        value: users.filter((user) => user.status === "active").length,
        change: 4.1,
      },
      newSignups: { value: 38, change: -6.2 },
      revenue: { value: 48_290, change: 8.7 },
    };
    return HttpResponse.json(stats);
  }),
];
