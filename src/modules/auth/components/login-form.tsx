import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleAlertIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/shared/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/components/ui/input-group";
import { ApiError } from "@/shared/services/http";
import { useLogin } from "../hooks/use-login";
import type { AuthUser, LoginCredentials, Role } from "../types/auth.types";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export type DemoAccount = LoginCredentials & { role: Role };

type LoginFormProps = {
  onSuccess: (user: AuthUser) => void;
  demoAccounts?: DemoAccount[];
};

export function LoginForm({ onSuccess, demoAccounts = [] }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, error, reset } = useLogin();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit((values) =>
    mutate(values, {
      onSuccess: (user) => {
        toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
        onSuccess(user);
      },
    }),
  );

  const fillDemoAccount = ({ email, password }: DemoAccount) => {
    reset();
    form.clearErrors();
    form.setValue("email", email);
    form.setValue("password", password);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {error && (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
        >
          <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
          <span>
            {error instanceof ApiError
              ? error.message
              : "Something went wrong. Please try again."}
          </span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="h-10 w-full"
      >
        {isPending && <Loader2Icon className="animate-spin" />}
        {isPending ? "Signing in…" : "Sign in"}
      </Button>

      {demoAccounts.length > 0 && (
        <div className="flex flex-col gap-4">
          <FieldSeparator>Try a demo account</FieldSeparator>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline-primary"
                onClick={() => fillDemoAccount(account)}
                className="capitalize"
              >
                {account.role}
              </Button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
