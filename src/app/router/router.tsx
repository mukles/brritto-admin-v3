import { createRouter } from "@tanstack/react-router";
import { useAuthStore } from "@/modules/auth";
import { ErrorState } from "@/shared/components/error-state";
import { PageLoader } from "@/shared/components/page-loader";
import { routeTree } from "./route-tree.gen";

export const router = createRouter({
  routeTree,
  context: {
    auth: () => useAuthStore.getState(),
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultPendingComponent: PageLoader,
  defaultErrorComponent: ({ error }) => (
    <ErrorState
      title="Something went wrong"
      description={error instanceof Error ? error.message : undefined}
    />
  ),
});

useAuthStore.subscribe((state, previous) => {
  if (previous.status === "authenticated" && state.status !== "authenticated") {
    void router.invalidate();
  }
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
