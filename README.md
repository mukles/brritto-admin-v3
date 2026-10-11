# Brritto Admin

A modular admin dashboard built with React 19, Vite, TypeScript, TanStack Router, TanStack Query, Tailwind CSS v4 and shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

In development, the API is served by an in-browser mock ([MSW](https://mswjs.io)). Sign in with any of these accounts, using the password `password123`:

| Email                 | Role    | Can access                    |
| --------------------- | ------- | ----------------------------- |
| `admin@brritto.dev`   | admin   | Dashboard, users (read/write) |
| `manager@brritto.dev` | manager | Dashboard, users (read)       |
| `viewer@brritto.dev`  | viewer  | Dashboard only                |

To use a real backend, set `VITE_ENABLE_MOCKS=false` and point `VITE_API_BASE_URL` at it. See `.env.example`.

## Scripts

| Command                       | What it does                                              |
| ----------------------------- | --------------------------------------------------------- |
| `npm run dev`                 | Start the dev server                                      |
| `npm run build`               | Type-check and build for production                       |
| `npm run preview`             | Serve the build, with security headers                    |
| `npm run export:illustration` | Save the login animation as a standalone SVG in `design/` |
| `npm run typecheck`           | Type-check only                                           |
| `npm run lint`                | Lint with oxlint                                          |
| `npm run format`              | Format with oxfmt (`format:check` for CI)                 |

## Project structure

```text
src/
├── app/                 # Application shell
│   ├── layout/          # Sidebar layout, navigation config, user menu
│   ├── providers/       # Theme, React Query, tooltip and toast providers
│   └── router/          # Router instance, context type, permission guards
│       └── routes/      # File-based routes (thin: they wire module pages to URLs)
├── modules/             # Feature modules, one per domain
│   ├── auth/
│   ├── dashboard/
│   └── users/
├── shared/              # Code with no feature knowledge
│   ├── components/      # App-wide components; ui/ holds shadcn components
│   ├── config/          # Validated environment variables
│   ├── hooks/
│   ├── services/http/   # API client
│   ├── types/
│   └── utils/
├── mocks/               # MSW mock API used in development
└── styles/              # Global CSS and theme tokens
```

Each module uses the folders it needs from this set: `components/`, `hooks/`, `pages/`, `services/`, `stores/`, `types/` and `utils/`. Its `index.ts` is the public API.

File names are kebab-case everywhere, matching what shadcn generates: `login-form.tsx`, `use-login.ts`, `auth.store.ts`. Component and hook names inside the files stay `LoginForm` and `useLogin`.

Dependency rules:

- Code outside a module imports only from its `index.ts` (`@/modules/auth`), never from its internal files.
- `shared/` never imports from `modules/` or `app/`.
- Route files stay thin: guards, loaders and search-param validation live there, and the UI comes from module pages.

### Adding a feature module

1. Create `src/modules/<feature>/` with the folders you need and an `index.ts`.
2. Put API calls and `queryOptions` in `services/`, using `api` from `@/shared/services/http`.
3. Add a route under `src/app/router/routes/_protected/`. The route tree regenerates on save.
4. Guard the route with `requirePermission(context, '<feature>:read')` in `beforeLoad`.
5. Add a nav entry to `src/app/layout/navigation.ts`, with the same permission.
6. Add the new permissions to `PERMISSIONS` in `modules/auth/types/auth.types.ts`.

Add shadcn components with `npx shadcn@latest add <name>`. They're installed to `src/shared/components/ui/`.

## Authentication

- **Access token:** short-lived (15 minutes in the mock). It's held in memory only, in a Zustand store, and is never written to `localStorage`.
- **Refresh token:** long-lived (7 days in the mock). The server sets it as a cookie and the client code never reads it. On a real backend this cookie must be `HttpOnly; Secure; SameSite=Strict`. (MSW can't set `HttpOnly` cookies, so the mock leaves that flag off.)
- **Session restore:** on startup, `initAuth()` calls `/auth/refresh`, so a reload keeps you signed in.
- **Rotation:** each refresh issues a new refresh token and spends the old one. If a spent token is used again, the mock revokes the whole token family. This is the reuse detection a real backend should implement.
- **Automatic refresh:** the client refreshes a minute before the access token expires. If a request still gets a 401, it refreshes once and retries the request. Concurrent 401s share a single refresh request.
- **Session end:** when a refresh fails or the user logs out, the session is cleared, the query cache is dropped, and route guards redirect to `/login?redirect=…`. The redirect only accepts same-origin paths.
- **CSRF:** uses the double-submit pattern. The server sets a readable `csrf_token` cookie, and the client echoes it in `X-CSRF-Token` on every non-GET request.

### Role-based access control

The server sends each user's `permissions` along with the user. The client checks permissions, never roles, in four places:

- **Routes:** `requirePermission()` in `beforeLoad` redirects to `/forbidden`.
- **Navigation:** nav items are hidden when the user lacks their `permission`.
- **UI:** `<Can permission="users:write">…</Can>` or `usePermission('users:write')`.
- **Server:** the mock API returns 403 as well. Client-side checks only hide UI, so a real backend must enforce every permission itself.

## API contract

The mock in `src/mocks/` defines the backend contract:

| Endpoint               | Notes                                                  |
| ---------------------- | ------------------------------------------------------ |
| `POST /auth/login`     | `{ email, password }` → `AuthSession`, sets cookies    |
| `POST /auth/refresh`   | Cookie + CSRF header → `AuthSession`, rotates cookie   |
| `POST /auth/logout`    | Cookie + CSRF header → 204, revokes and clears cookies |
| `GET /dashboard/stats` | Requires `dashboard:view`                              |
| `GET /users`           | `?page&pageSize`, requires `users:read`                |

`AuthSession` is `{ accessToken, expiresIn, user: { id, name, email, role, permissions } }`. Error responses use the shape `{ message }`.

## Security headers

`vite.config.ts` defines a CSP and related headers, which `npm run preview` applies. Configure the same headers on whatever serves the production build. If the API is on another origin, add that origin to `connect-src`.

## Not built yet

These are in the project goals but not built:

- Charts and analytics. The dashboard currently shows stat cards only.
- A full data-table component with sorting and filtering.
- User create, edit and invite flows.
- Automated tests.
