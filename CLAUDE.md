# LMS Frontend — Conventions

Next.js 14 (App Router) · TypeScript · Tailwind · React Query · Zustand · next-intl (en/ar, RTL).

## Non-negotiable rules

- **TypeScript everywhere — never use `any`.** Model real shapes in `lib/types`. Reach for `unknown` + narrowing if a type is genuinely unknown.
- **Server data → React Query** (`useQuery` / `useMutation`). Never store fetched server data in Zustand or `useState`.
- **Auth & UI state → Zustand** (`lib/store`). This is for client/session state only, not server data.
- **Forms → react-hook-form + zod.** Define a zod schema, resolve with `@hookform/resolvers/zod`. No uncontrolled ad-hoc form state.
- **Styling → Tailwind only.** No inline `style={{}}`, no CSS-in-JS. Compose classes with `cn()` from `lib/utils/cn`.
- **Components stay small and single-responsibility.** Split when a component grows past one clear job.
- **Every async operation has a loading state.** Use `isPending` / `isLoading` from the hook — never leave a blank screen.
- **Every query handles its error state.** Surface `isError` / `error`; don't ignore failures.
- **Never use `dangerouslySetInnerHTML`.** Render content safely.
- **Images → always `next/image`.** Never `<img>`.
- **API calls → always through `lib/api/` functions.** Never call `fetch` or `axios` directly inside a component; add/extend an endpoint function and a React Query hook instead.

## Where things live

- `lib/api/client.ts` — axios instance. Request interceptor attaches the bearer token from `authStore`; response interceptor redirects to `/login` on 401 and normalizes errors to the `ApiError` shape.
- `lib/api/*.ts` — typed endpoint functions (auth, courses, enrollments, quizzes, payments, admin).
- `lib/hooks/*.ts` — React Query hooks wrapping the endpoint functions. Co-locate query keys here.
- `lib/store/authStore.ts` — Zustand + persist; `token`, `user`, and `isAdmin/isInstructor/isStudent` selectors.
- `lib/types/index.ts` — shared domain types.
- `components/ui` — reusable primitives (toast lives here). `components/{layout,courses,quiz,auth,admin}` — feature components.

## i18n

- `next-intl` runs **without locale routing** — the active locale comes from the `NEXT_LOCALE` cookie (set by `middleware.ts`, read in `i18n/request.ts`), so routes stay un-prefixed.
- Translations live in `messages/{en,ar}.json`. Use the `useTranslations()` hook; don't hardcode user-facing strings.
- Arabic renders RTL: the root layout sets `dir` from `getDirection(locale)`. Use logical Tailwind utilities (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`) over `ml-`/`mr-`.

## Patterns

- New data feature: add the endpoint fn in `lib/api/<domain>.ts` → wrap it in a hook in `lib/hooks/use<Domain>.ts` → consume the hook in the component with loading + error states.
- Toasts: call `toast({ title, description, variant })` from `components/ui/use-toast`. `<Toaster />` is already mounted in `components/providers.tsx`.
- Dark mode: `next-themes` with `attribute="class"`; theme tokens are CSS vars in `app/globals.css`.

## Env

- `NEXT_PUBLIC_API_URL` — API base URL (see `.env.local`).
