import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/app";
import { initAuth } from "@/modules/auth";
import { ENV } from "@/shared/constant";
import "@/styles/globals.css";

async function bootstrap() {
  if (ENV.ENABLE_MOCKS) {
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
