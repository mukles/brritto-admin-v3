import { ThemeToggle } from "@/shared/components/theme-toggle";
import { ENV } from "@/shared/constant";
import { BrandPanel } from "../components/brand-panel";
import { LoginForm } from "../components/login-form";
import { MobileBrandHeader } from "../components/mobile-brand-header";
import { DEMO_ACCOUNTS } from "../constants";
import type { AuthUser } from "../types/auth.types";

type LoginPageProps = {
  onSuccess: (user: AuthUser) => void;
};

export function LoginPage({ onSuccess }: LoginPageProps) {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <BrandPanel />
      <MobileBrandHeader />

      <main className="relative -mt-6 flex flex-col rounded-t-3xl bg-background px-6 pt-8 pb-6 sm:px-10 lg:mt-0 lg:rounded-none lg:p-10">
        <div className="hidden justify-end lg:flex">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-start justify-center sm:items-center lg:py-12">
          <div className="flex w-full max-w-sm flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-muted-foreground">
                Use your Brritto staff email and password.
              </p>
            </div>
            <LoginForm
              onSuccess={onSuccess}
              demoAccounts={ENV.ENABLE_MOCKS ? DEMO_ACCOUNTS : []}
            />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Need access? Ask a workspace admin to invite you.
        </p>
      </main>
    </div>
  );
}
