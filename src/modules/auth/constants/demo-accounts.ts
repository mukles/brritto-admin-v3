import type { DemoAccount } from "../types/auth.types";

/** Seeded mock users (see src/mocks/db.ts). Only shown when mocks are enabled. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "admin", email: "admin@brritto.dev", password: "password123" },
  { role: "manager", email: "manager@brritto.dev", password: "password123" },
  { role: "viewer", email: "viewer@brritto.dev", password: "password123" },
];
