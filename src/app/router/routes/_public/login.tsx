import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { LoginPage } from "@/modules/auth";

const searchSchema = z.object({
  redirect: z
    .string()
    .regex(/^\/(?![/\\])/)
    .optional()
    .catch(undefined),
});

export const Route = createFileRoute("/_public/login")({
  validateSearch: searchSchema,
  component: LoginRoute,
});

function LoginRoute() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <LoginPage
      onSuccess={() => void navigate({ href: redirect ?? "/", replace: true })}
    />
  );
}
