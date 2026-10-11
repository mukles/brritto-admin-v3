# Brritto Admin

A modular admin dashboard built with React 19, Vite, TypeScript, TanStack Router, Tailwind CSS v4 and shadcn/ui.

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
| `npm run lint`                | Lint with oxlint (`lint:fix` to apply auto-fixes)         |
| `npm run format`              | Format with oxfmt (`format:check` for CI)                 |

## Project structure

```text
src/
├── app/                     # Application shell: wires everything together
│   ├── app.tsx              # Root component (providers + router)
│   ├── layout/              # Sidebar layout, navigation config, user menu
│   ├── providers/           # Theme, tooltip and toast providers
│   └── router/
│       ├── router.tsx       # Router instance
│       ├── context.ts       # Router context type
│       ├── guards.ts        # requirePermission() and other route guards
│       ├── route-tree.gen.ts  # Generated, never edit by hand
│       └── routes/          # File-based routes (thin: URL → module page)
│           ├── _public/     # Pages for signed-out users (login)
│           └── _protected/  # Pages that need a session
├── modules/                 # Feature modules, one folder per domain
│   ├── auth/
│   ├── dashboard/
│   └── users/
├── shared/                  # Code with no feature knowledge, used by many modules
│   ├── components/          # App-wide components (Logo, PageHeader, ErrorState…)
│   │   └── ui/              # shadcn components, managed by the shadcn CLI
│   ├── config/              # env.ts: validated environment variables
│   ├── hooks/               # useFetch, useMutation, useMobile
│   ├── services/
│   │   ├── http/            # fetch-based API client (api, ApiError)
│   │   ├── storage/         # Encrypted cookies, localStorage, token storage
│   │   └── encryption/      # AES encryption and JWT helpers
│   ├── types/               # Types shared across modules (Paginated…)
│   └── utils/               # Pure helpers (cn…)
├── mocks/                   # MSW mock API used in development
├── assets/                  # Static images imported by code
└── styles/                  # Global CSS, theme tokens, animations
```

### Inside a module

Every module has the same layout. Create only the folders you need.

```text
src/modules/<feature>/
├── components/    # UI pieces of this feature            login-form.tsx, brand-panel.tsx
├── constants/     # Fixed values for this feature        demo-accounts.ts
├── hooks/         # React hooks                          use-login.ts, use-users.ts
├── pages/         # One component per route              login-page.tsx
├── services/      # API calls and non-React logic        auth.api.ts, session.ts
├── stores/        # Zustand stores                       auth.store.ts
├── types/         # TypeScript types                     auth.types.ts
├── utils/         # Pure helper functions                permissions.ts
├── validations/   # zod schemas for forms                login-schema.ts
└── index.ts       # Public API: the only file other code may import
```

Folders that hold several files (`constants/`, `validations/`) have their own `index.ts` that re-exports them.

### Where does it go?

| I'm adding…                                        | Put it in                                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------------------- |
| A new URL                                          | `app/router/routes/_protected/` (or `_public/`)                               |
| The screen for that URL                            | `modules/<feature>/pages/<name>-page.tsx`                                     |
| A piece of UI used by one feature                  | `modules/<feature>/components/`                                               |
| A piece of UI used by several features             | `shared/components/`                                                          |
| A shadcn component                                 | `npx shadcn@latest add <name>` → `shared/components/ui/`                      |
| An API call                                        | `modules/<feature>/services/<feature>.api.ts`                                 |
| A hook that loads data                             | `modules/<feature>/hooks/use-<thing>.ts`, built on `useFetch` / `useMutation` |
| A form schema                                      | `modules/<feature>/validations/<form>-schema.ts`                              |
| A fixed list or value (options, demo data, limits) | `modules/<feature>/constants/`                                                |
| A type for one feature                             | `modules/<feature>/types/<feature>.types.ts`                                  |
| A type used by several features                    | `shared/types/`                                                               |
| Global client state                                | `modules/<feature>/stores/<feature>.store.ts` (Zustand)                       |
| A pure helper for one feature                      | `modules/<feature>/utils/`                                                    |
| A pure helper used everywhere                      | `shared/utils/`                                                               |
| A sidebar link                                     | `app/layout/navigation.ts`                                                    |
| A new permission                                   | `PERMISSIONS` in `modules/auth/types/auth.types.ts`                           |
| A new environment variable                         | `shared/config/env.ts` and `.env.example`                                     |
| A mock endpoint                                    | `mocks/handlers/<feature>.handlers.ts`                                        |

Rules of thumb:

- **Page or component?** A page lays out the screen and connects hooks, constants and props. Anything you can name as a separate visual piece is a component, even if only one page uses it.
- **Module or shared?** Start in the module. Move to `shared/` only when a second module needs it, and remove anything feature-specific when you do.
- **Hook or service?** If it uses React (`useState`, `useEffect`, other hooks), it's a hook. Plain async functions and API calls are services.

### Naming

- File names are kebab-case everywhere, matching what shadcn generates: `login-form.tsx`, `use-login.ts`, `auth.store.ts`.
- Names inside files stay idiomatic: components `LoginForm`, hooks `useLogin`, constants `DEMO_ACCOUNTS`, schemas `loginSchema`.
- Suffixes show a file's role: `.api.ts`, `.store.ts`, `.types.ts`, `-schema.ts`, `-page.tsx`, `.handlers.ts`.

### Dependency rules

- Code outside a module imports only from its `index.ts` (`@/modules/auth`), never from its internal files.
- `shared/` never imports from `modules/` or `app/`.
- Modules may import from `shared/` and from other modules' `index.ts`, never from `app/`.
- Route files stay thin: guards, loaders and search-param validation live there, and the UI comes from module pages.

### Adding a feature module

1. Create `src/modules/<feature>/` with the folders you need and an `index.ts`.
2. Put API calls in `services/<feature>.api.ts`, using `api` from `@/shared/services/http`.
3. Wrap them in hooks in `hooks/`, using `useFetch` (reads) from `@/shared/hooks/use-fetch` or `useMutation` (writes) from `@/shared/hooks/use-mutation`.
4. Build the screen in `pages/` from components in `components/`, and export the page from `index.ts`.
5. Add a route under `src/app/router/routes/_protected/`. The route tree regenerates while the dev server runs.
6. Guard the route with `requirePermission(context, '<feature>:read')` in `beforeLoad`.
7. Add a nav entry to `src/app/layout/navigation.ts`, with the same permission.
8. Add the new permissions to `PERMISSIONS` in `modules/auth/types/auth.types.ts`.

## Formatting and linting

Formatting uses [oxfmt](https://oxc.rs/docs/guide/usage/formatter) with `.oxfmtrc.json` (Prettier-compatible: double quotes, semicolons, `trailingComma: "es5"`, Tailwind class sorting). Linting uses oxlint with `.oxlintrc.json`.

In VS Code, install the recommended **Oxc** extension (`oxc.oxc-vscode`). The workspace settings turn Prettier off for this project, so Cmd+S applies oxlint fixes and formats with oxfmt, giving the same result as `npm run lint:fix && npm run format`.

## Authentication

- **Tokens:** login returns `{ accessToken, refreshToken, user }`. Both tokens are stored in AES-encrypted cookies (`shared/services/storage/token-storage.ts`) and the user in encrypted `localStorage`. The encryption key is `VITE_STORAGE_SECRET_KEY`.
- **Requests:** the API client (`shared/services/http/api-client.ts`) adds `Authorization: Bearer <accessToken>`. Pass `{ auth: false }` for public endpoints such as login.
- **Refresh:** when a request gets a 401, the client calls `POST /auth/refresh` with the refresh token as `Bearer`, saves the new pair and retries once. Concurrent 401s share a single refresh request.
- **Rotation:** each refresh issues a new refresh token and spends the old one. If a spent token is used again, the mock revokes the whole token family. This is the reuse detection a real backend should implement.
- **Session restore:** on startup, `initAuth()` restores the user from storage when the refresh token hasn't expired.
- **Session end:** when a refresh fails or the user logs out, tokens and the stored user are cleared, and route guards redirect to `/login`.

### Role-based access control

The server sends each user's `permissions` along with the user. The client checks permissions, never roles, in four places:

- **Routes:** `requirePermission()` in `beforeLoad` redirects to `/forbidden`.
- **Navigation:** nav items are hidden when the user lacks their `permission`.
- **UI:** `<Can permission="users:write">…</Can>` or `usePermission('users:write')`.
- **Server:** the mock API returns 403 as well. Client-side checks only hide UI, so a real backend must enforce every permission itself.

## API contract

The mock in `src/mocks/` defines the backend contract:

| Endpoint               | Notes                                                         |
| ---------------------- | ------------------------------------------------------------- |
| `POST /auth/login`     | `{ email, password }` → `{ accessToken, refreshToken, user }` |
| `POST /auth/refresh`   | `Authorization: Bearer <refreshToken>` → new token pair       |
| `POST /auth/logout`    | Bearer access token → revokes the user's refresh tokens       |
| `GET /dashboard/stats` | Requires `dashboard:view`                                     |
| `GET /users`           | `?page&pageSize`, requires `users:read`                       |

`user` is `{ id, name, email, role, permissions }`. Error responses use the shape `{ message }`.

## Security headers

`vite.config.ts` defines a CSP and related headers, which `npm run preview` applies. Configure the same headers on whatever serves the production build. If the API is on another origin, add that origin to `connect-src`.

## Not built yet

These are in the project goals but not built:

- Charts and analytics. The dashboard currently shows stat cards only.
- A full data-table component with sorting and filtering.
- User create, edit and invite flows.
- Automated tests.
