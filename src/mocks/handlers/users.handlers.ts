import { http, HttpResponse } from "msw";
import type { User } from "@/modules/users";
import { users } from "../db";
import { apiUrl, authenticate, networkDelay } from "../utils";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const usersHandlers = [
  http.get(apiUrl("/users"), async ({ request }) => {
    await networkDelay();
    const { error } = authenticate(request, "users:read");
    if (error) return error;

    const params = new URL(request.url).searchParams;
    const page = clamp(
      Number(params.get("page")) || 1,
      1,
      Number.MAX_SAFE_INTEGER
    );
    const pageSize = clamp(Number(params.get("pageSize")) || 10, 1, 100);
    const start = (page - 1) * pageSize;

    const body: { data: User[]; limit: number; page: number; total: number } = {
      data: users.slice(start, start + pageSize),
      limit: pageSize,
      page,
      total: users.length,
    };
    return HttpResponse.json(body);
  }),
];
