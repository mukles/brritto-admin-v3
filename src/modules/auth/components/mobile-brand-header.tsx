import { Logo } from "@/shared/components/logo";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { AdminIllustration } from "./admin-illustration";

/** Compact branded header that replaces `BrandPanel` below `lg`. */
export function MobileBrandHeader() {
  return (
    <header className="relative overflow-hidden bg-panel px-6 pt-6 pb-12 text-panel-foreground lg:hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-30%] left-[-10%] h-[90%] w-[45%] rotate-[-45deg] animate-spotlight rounded-full bg-panel-glow/80 blur-[60px] motion-reduce:animate-none"
      />
      <div className="relative flex items-center justify-between">
        <Logo className="h-7 w-auto" />
        <ThemeToggle />
      </div>
      <AdminIllustration className="relative mx-auto mt-4 w-full max-w-88" />
    </header>
  );
}
