import type { Role } from "@/modules/auth";

export type UserStatus = "active" | "invited" | "suspended";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
};

export type UsersQuery = {
  page: number;
  pageSize: number;
};
