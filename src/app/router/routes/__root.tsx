import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { ErrorState } from "@/shared/components/error-state";
import { Button } from "@/shared/components/ui/button";
import type { RouterContext } from "@/app/router/context";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  notFoundComponent: () => (
    <ErrorState
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved."
      action={
        <Button asChild variant="outline">
          <Link to="/">Back to dashboard</Link>
        </Button>
      }
    />
  ),
});
