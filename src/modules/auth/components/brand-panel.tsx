import { Logo } from "@/shared/components/logo";
import { AdminIllustration } from "./admin-illustration";

/** Branded left column of the login screen, shown from `lg` up. */
export function BrandPanel() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-panel p-10 text-panel-foreground lg:flex xl:p-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-25%] left-[-5%] h-[95%] w-[28%] rotate-[-45deg] animate-spotlight rounded-full bg-panel-glow/80 blur-[80px] motion-reduce:animate-none"
      />

      <Logo className="relative h-8 w-auto self-start" />

      <AdminIllustration className="relative mx-auto w-[min(92%,40rem)]" />

      <p className="relative max-w-xs text-sm text-panel-muted">
        The admin console behind Brritto. Organize Terms, review questions and
        publish Pathways.
      </p>
    </aside>
  );
}
