import { Logo } from "@/shared/components/logo";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { env } from "@/shared/config/env";
import { AdminIllustration } from "../components/admin-illustration";
import { LoginForm, type DemoAccount } from "../components/login-form";
import type { AuthUser } from "../types/auth.types";

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "admin", email: "admin@brritto.dev", password: "password123" },
  { role: "manager", email: "manager@brritto.dev", password: "password123" },
  { role: "viewer", email: "viewer@brritto.dev", password: "password123" },
];

type LoginPageProps = {
  onSuccess: (user: AuthUser) => void;
};

function BrandPanel() {
  return (
    <aside className="bg-panel text-panel-foreground relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14">
      <div
        aria-hidden="true"
        className="bg-panel-glow/80 animate-spotlight pointer-events-none absolute top-[-25%] left-[-5%] h-[95%] w-[28%] rotate-[-45deg] rounded-full blur-[80px] motion-reduce:animate-none"
      />

      <Logo className="relative h-8 w-auto self-start" />

      <AdminIllustration className="relative mx-auto w-[min(92%,40rem)]" />

      <p className="text-panel-muted relative max-w-xs text-sm">
        The admin console behind Brritto. Organize Terms, review questions and
        publish Pathways.
      </p>
    </aside>
  );
}

function MobileBrandHeader() {
  return (
    <header className="bg-panel text-panel-foreground relative overflow-hidden px-6 pt-6 pb-12 lg:hidden">
      <div
        aria-hidden="true"
        className="bg-panel-glow/80 animate-spotlight pointer-events-none absolute top-[-30%] left-[-10%] h-[90%] w-[45%] rotate-[-45deg] rounded-full blur-[60px] motion-reduce:animate-none"
      />
      <div className="relative flex items-center justify-between">
        <Logo className="h-7 w-auto" />
        <ThemeToggle />
      </div>
      <AdminIllustration className="relative mx-auto mt-4 w-full max-w-88" />
    </header>
  );
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  return (
    <div className="bg-background grid min-h-svh lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <BrandPanel />
      <MobileBrandHeader />

      <main className="bg-background relative -mt-6 flex flex-col rounded-t-3xl px-6 pt-8 pb-6 sm:px-10 lg:mt-0 lg:rounded-none lg:p-10">
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
              demoAccounts={env.VITE_ENABLE_MOCKS ? DEMO_ACCOUNTS : []}
            />
          </div>
        </div>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          Need access? Ask a workspace admin to invite you.
        </p>
      </main>
    </div>
  );
}
