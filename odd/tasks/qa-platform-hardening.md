# QA platform hardening
Branch: current workspace; delivery: ask-on-risk; test runner: pnpm

## Specs

1. S1 — The Next.js production build must complete without unresolved Node runtime modules from server-only upload code.
2. S2 — The Playwright test command must discover the repository's configuration from the package scripts and preserve the existing E2E suites.
3. S3 — The frontend must provide runnable unit/component, accessibility, SEO, and bounded initial-performance checks without requiring the Django API.
4. S4 — Verification must distinguish frontend-local failures from the unavailable external Django GraphQL service.

## Tasks

- T1 [S1] inline — isolate server-only upload code from instrumentation build analysis; status: complete; evidence: `pnpm build`
- T2 [S2] inline — fix Playwright script/config discovery and preserve existing projects; status: complete; evidence: package script includes `--config=test/e2e/playwright.config.ts`
- T3 [S3] inline — add unit/component, accessibility, SEO, and performance smoke infrastructure; status: complete; evidence: Vitest plus Playwright axe/performance specs
- T4 [S4] inline — run typecheck, lint, build, unit, accessibility, and E2E verification; status: complete with external blocker; evidence: typecheck/build/unit/a11y/performance pass; authenticated E2E remains blocked by Django API availability

## Log

L1: "hazlo"

Risk: item 3 (changed the shared test/build configuration and login form markup used by existing flows)
