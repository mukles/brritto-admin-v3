import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/modules/dashboard";
import { requirePermission } from "@/app/router/guards";

export const Route = createFileRoute("/_protected/")({
  beforeLoad: ({ context }) => requirePermission(context, "dashboard:view"),
  component: DashboardPage,
});
