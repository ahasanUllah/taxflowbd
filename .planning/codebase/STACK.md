# Technology Stack

**Analysis Date:** 2026-05-11

## Languages

**Primary:**
- TypeScript 5.x (strict mode) - All source files under `src/`

**Secondary:**
- CSS (Tailwind v4 utility classes) - Styling

## Runtime

**Environment:**
- Node.js (latest LTS compatible with Next.js 16)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 16.2.6 - App Router, SSR/SSG, API routes, proxy routing
- React 19.2.4 - UI rendering
- React DOM 19.2.4 - DOM bindings

**Build/Dev:**
- Turbopack - Configured in `next.config.ts` as dev bundler (`turbopack: { root: __dirname }`)
- ESLint 9 + `eslint-config-next` 16.2.6 - Linting (`eslint` script)

## Key Dependencies

**Auth:**
- `better-auth` ^1.6.10 - Authentication (email+password, session management, MongoDB adapter)
  - Server config: `src/lib/auth.ts`
  - Client config: `src/lib/auth-client.ts`
  - Route handler: `src/app/api/auth/[...all]/route.ts`

**Database:**
- `mongoose` ^9.6.2 - ODM for MongoDB, models and schema definitions
  - Connection util: `src/lib/mongodb.ts`
  - Models: `src/models/User.ts`, `src/models/TaxReturn.ts`
- `mongodb` ^7.2.0 - Native driver (used directly by Better Auth's mongodbAdapter)

**Styling:**
- `tailwindcss` ^4 - Utility-first CSS
- `@tailwindcss/postcss` ^4 - PostCSS integration for Tailwind v4

**Security:**
- `bcryptjs` ^3.0.3 - Password hashing
- `@types/bcryptjs` ^2.4.6 - Type definitions

**Data Fetching:**
- `swr` ^2.4.1 - Client-side data fetching and caching

**PDF Generation:**
- `pdf-lib` ^1.17.1 - Tax return PDF assembly (no server dependency)

**Observability:**
- `@vercel/speed-insights` ^2.0.0 - Vercel performance monitoring

**Planned (not yet installed):**
- `resend` - Transactional email (referenced in CLAUDE.md, not in package.json)
- `zod` - Input validation (referenced in CLAUDE.md, not in package.json)
- SSLCommerz SDK - Payment (referenced in CLAUDE.md, not in package.json)

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Target: ES2017
- Strict mode: enabled (`"strict": true`)
- Module resolution: `bundler`
- Path alias: `@/*` → `./src/*`
- Incremental compilation: enabled

**Next.js:**
- Config: `next.config.ts`
- Turbopack enabled for dev builds

**Tailwind:**
- Integration via `@tailwindcss/postcss` (v4 config — no `tailwind.config.js` needed)

**Tax Rules:**
- Centralized in `src/config/tax-config.ts` as `TAX_CONFIG` const
- Assessment Year: AY2025-26-v1
- Never hardcode tax values outside this file

**Environment:**
- `.env.local` present (contents not read)
- Required vars: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `ENCRYPTION_KEY`
- No `NEXT_PUBLIC_` prefix for sensitive data

**Proxy (Auth Guard):**
- `src/proxy.ts` — exports `proxy()` function (Next.js 16 pattern; NOT `middleware.ts`)
- Protects `/dashboard/:path*` routes; redirects unauthenticated users to `/login`

## Platform Requirements

**Development:**
- Node.js with npm
- MongoDB Atlas connection string in `.env.local`
- Run: `npm run dev` (uses Turbopack)

**Production:**
- Vercel (primary deployment target)
- `BETTER_AUTH_URL`: `https://taxflowbd.vercel.app`
- `npm run build` → `npm start`

---

*Stack analysis: 2026-05-11*
