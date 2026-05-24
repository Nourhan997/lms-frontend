# LMS Frontend

The web client for the Learning Management System — a bilingual (English / Arabic, RTL-aware) platform for browsing courses, learning with video/audio/text/PDF lessons, taking quizzes and placement tests, earning certificates, paying for courses, and managing everything through instructor and admin panels.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict, no `any`)
- **Tailwind CSS** (+ `@tailwindcss/typography`)
- **React Query** (`@tanstack/react-query`) for all server data
- **Zustand** (+ persist) for auth/session state
- **react-hook-form + zod** for forms
- **next-intl** for i18n (en/ar) without locale-prefixed routes
- **Radix UI** primitives, **lucide-react** icons, **react-player** for video
- **isomorphic-dompurify** for the single sanctioned rich-text injection

## Quick start

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000.

```bash
npm run build      # production build
npm run lint       # eslint
npx tsc --noEmit   # typecheck
```

## Environment variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API. |

## Folder structure

```
app/                       App Router routes
  (public)/                Public pages (landing, courses, blog, certificates, placement)
  (auth)/                  Login & register
  dashboard/               Student area (auth)
  instructor/              Instructor panel (auth)
  admin/                   Admin panel (auth)
  layout.tsx               Root layout (providers, fonts, RTL dir)
  loading.tsx / error.tsx / not-found.tsx
components/
  ui/                      Reusable primitives (Button, Input, Modal, Tabs, toast, ...)
  layout/                  Navbar, Sidebar, Footer, DashboardLayout, PageHeader
  courses/ quiz/ auth/ admin/ instructor/ payment/ landing/   Feature components
lib/
  api/                     Axios client + typed endpoint functions
  hooks/                   React Query hooks (co-located query keys)
  store/                   Zustand auth store (cookie-persisted)
  types/                   Shared domain types
  utils/                   cn(), formatting, helpers
i18n/                      next-intl config + request resolver
messages/                  en.json / ar.json translations
middleware.ts              Locale detection + role-based route protection
```

## Routes overview

**Public:** `/` landing · `/courses` catalog (+ `?category=`) · `/courses/[slug]` detail · `/courses/[slug]/checkout` · `/blog` · `/blog/[slug]` · `/certificates/[uid]` verification · `/placement` · `/placement/[subject]`

**Auth:** `/login` · `/register`

**Student** (`/dashboard`): home · `courses` (My Courses) · `courses/[enrollmentId]` player · `courses/[enrollmentId]/quiz/[sectionId]` · `certificates` · `payments` · `notifications` · `profile`

**Instructor** (`/instructor`): dashboard · `courses` · `courses/create` · `courses/[id]/edit` · `courses/[id]/builder` · `students`

**Admin** (`/admin`): dashboard · `courses` (+ create/edit) · `students` (+ detail) · `instructors` · `payments` · `reports` · `blog` (+ create/edit) · `settings` · `audit-log`

## Conventions

See [CLAUDE.md](./CLAUDE.md) for the engineering conventions (server data via React Query, forms via react-hook-form + zod, Tailwind-only styling, RTL logical utilities, etc.).

## Built by

The LMS team.
