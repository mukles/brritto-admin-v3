import { Loader2Icon } from "lucide-react";

export function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[60svh] items-center justify-center"
    >
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
