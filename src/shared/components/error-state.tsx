import type { ReactNode } from "react";

type ErrorStateProps = {
  code?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function ErrorState({
  code,
  title,
  description,
  action,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-3 p-6 text-center">
      {code && (
        <p className="text-sm font-medium text-muted-foreground">{code}</p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
