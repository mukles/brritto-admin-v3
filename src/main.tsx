import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/app";
import { initAuth } from "@/modules/auth";
import { env } from "@/shared/config/env";
import "@/styles/globals.css";

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === "true" && env.VITE_ENABLE_MOCKS) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  initAuth();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

void bootstrap();
