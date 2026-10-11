import { createFileRoute, Link } from '@tanstack/react-router'
import { ErrorState } from '@/shared/components/error-state'
import { Button } from '@/shared/components/ui/button'

export const Route = createFileRoute('/_protected/forbidden')({
  component: () => (
    <ErrorState
      code="403"
      title="You don't have access to this page"
      description="Ask an administrator if you think you should."
      action={
        <Button asChild variant="outline">
          <Link to="/">Back to dashboard</Link>
        </Button>
      }
    />
  ),
})
