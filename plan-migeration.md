# Portfolio v2 Migration Plan

## Objective

Create a new TanStack Start portfolio on Alchemy v2 without deleting or
silently changing the current website. The current portfolio remains available
as a versioned archive while the new website is built and validated separately.

## Target Structure

```text
apps/
├── archive/        # Current portfolio, preserved as v1
├── web/            # New TanStack Start portfolio
└── server/         # Existing Hono app, retained but initially disconnected

packages/
├── infra/          # Alchemy v2 stack
├── ui/             # Existing v1 design system
├── config/
├── db/
└── env/
```

## Migration Principles

- Keep the current production website working until the final cutover.
- Preserve the current portfolio in Git and as a separately deployable app.
- Migrate infrastructure before beginning the visual redesign.
- Keep the new app independent from the existing UI package.
- Do not introduce a database, API, CMS, or new dependencies until a real
  portfolio feature needs them.
- Run an Alchemy plan before every infrastructure deployment.
- Never use the Alchemy v1 destroy command after production resources have been
  adopted by Alchemy v2.

## Phase 1: Preserve the Current Portfolio

### Goal

Turn the current website into an explicit, buildable v1 archive before changing
its infrastructure or creating the replacement.

### Work

1. Create a migration branch from the current clean `master`.
2. Tag the current commit as the final untouched v1 snapshot.
3. Rename `apps/web` to `apps/archive` using Git-aware moves.
4. Rename the archived workspace package so it cannot conflict with the new
   `web` package.
5. Keep the existing routes, content, media, and visual behavior unchanged.
6. Treat `packages/ui` as the archived site's legacy design system.
7. Update only paths and package references required by the directory move.
8. Narrow the legacy Tailwind source paths so the archive does not scan the new
   application's files.

### Verification

- The archive installs without adding unrelated dependencies.
- Type checking and production build pass.
- The homepage and existing routes render as they did before the move.
- Existing public assets, videos, metadata, and direct route navigation work.
- A Git diff confirms that application content was moved rather than rewritten.

### Exit Criteria

`apps/archive` is a faithful, independently buildable copy of portfolio v1, and
the original snapshot can be recovered from its Git tag.

## Phase 2: Normalize the Monorepo

### Goal

Give the archive, new app, and infrastructure clear package boundaries and
predictable Turborepo commands.

### Work

1. Give each relevant package its own `dev`, `build`, and `check-types` scripts.
2. Make root scripts delegate through explicit `turbo run` commands.
3. Add filtered commands for the archive and infrastructure now; add the
   matching new-website commands when its workspace is created in Phase 4.
4. Keep deployment logic inside `packages/infra`; root scripts only delegate to
   it.
5. Remove obsolete website dependencies only after confirming they have no
   callers.
6. Keep `apps/server`, `packages/db`, and `packages/env` in the repository, but
   do not connect them to the new portfolio.
7. Keep dependencies installed in the workspace that uses them.
8. Pin the currently deployed Alchemy v1 version exactly so it cannot drift
   before migration. Upgrade to an exact Alchemy v2 beta as part of Phase 3 so
   the dependency and infrastructure API change atomically.

### Verification

- Bun resolves every workspace without duplicate package names.
- Filtered archive and infrastructure tasks select the expected package; the
  web equivalents are deferred until that workspace exists in Phase 4.
- `bun run check` and `bun run check-types` pass.
- The archive production build still passes after workspace normalization.
- No root script contains package-specific build implementation.

### Exit Criteria

The monorepo has stable task boundaries and is ready to host both portfolio
versions without accidental cross-coupling.

## Phase 3: Migrate Infrastructure to Alchemy v2

### Goal

Replace the Alchemy v1 deployment program with an Alchemy v2 stack while
protecting the existing production Worker and domain.

### Work

1. Rewrite `packages/infra/alchemy.run.ts` around:
   - `Alchemy.Stack`
   - `Cloudflare.providers()`
   - `Cloudflare.state()`
   - `Cloudflare.Website.Vite`
2. Upgrade Alchemy to a reviewed, exact v2 beta version.
3. Declare the archive website resource now. Add the new website resource in
   Phase 4, after `apps/web` exists, so the stack never references a missing
   build root.
4. Remove the legacy `TanStackStart` infrastructure resource.
5. Remove the app-side Alchemy Vite plugin and
   `@cloudflare/vite-plugin`; Alchemy v2 injects its own Cloudflare Vite
   integration.
6. Stop using `wrangler.jsonc` for Alchemy-managed website deployment.
7. Keep website resources free of runtime bindings and secrets until a
   concrete feature requires them.
8. Configure isolated stages:
   - developer stages for local work;
   - preview stages without production domains;
   - an explicit production stage.
9. Add infrastructure scripts for plan, development, deployment, and explicit
   stage-scoped destruction.
10. Document the v1-to-v2 adoption rehearsal for a non-production stage.
11. Run the rehearsal and inspect the production plan only after explicitly
    approving Alchemy's state-store bootstrap and Cloudflare access.

### Verification

- The v2 stack and Alchemy CLI type-check and load locally.
- The archive builds with the Vite version required by Alchemy v2.
- `alchemy plan` contains only expected creates, updates, and adoptions.
- `alchemy dev` starts the TanStack Vite server with HMR.
- A preview deployment serves SSR routes, static assets, and direct links.
- Repeating the same deployment produces no unexpected changes.

The last four checks are cloud validation gates. They intentionally remain
pending until the state-store bootstrap and non-production deployment are
approved.

### Exit Criteria

The local Alchemy v2 migration is reproducible and the production adoption
procedure is documented. Alchemy v2 owns a validated non-production stack only
after the separately approved cloud rehearsal passes.

## Phase 4: Scaffold the New TanStack Start App

### Goal

Create a minimal, modern application shell for the new portfolio without
carrying over the old website's architecture or visual identity.

### Work

1. Create a minimal React and TanStack Start application in `apps/web`.
2. Use Vite, TypeScript, React 19, Tailwind CSS, and Ultracite.
3. Keep application dependencies local to `apps/web`.
4. Create app-local global styles, design tokens, and components.
5. Do not import `packages/ui` into the new app.
6. Add only:
   - the root document;
   - one placeholder homepage;
   - metadata defaults;
   - not-found and error boundaries;
   - accessible document structure.
7. Keep the new preview unindexed until the production launch.
8. Defer animation libraries, WebGL, React Query, shadcn components, analytics,
   database access, and server APIs until the design or product requirements
   justify them.

### Verification

- Local development starts through the filtered Turborepo command.
- Type checking, Ultracite checks, and production build pass.
- SSR output contains useful HTML without requiring client JavaScript.
- The placeholder route works with JavaScript disabled.
- The initial client bundle contains no legacy portfolio dependencies.

### Exit Criteria

`apps/web` is a small, deployable TanStack Start foundation ready for design and
content work.

## Phase 5: Preview, Cut Over, and Preserve Rollback

### Goal

Publish both applications safely, validate the new deployment, and move the
primary domain only after approval.

### Work

1. Deploy the archived site to `v1.1bye.dev`.
2. Confirm the archive works before changing `1bye.dev`.
3. Deploy the new website through an isolated preview stage.
4. Validate:
   - SSR HTML and hydration;
   - direct route loading;
   - static assets and media;
   - metadata, canonical URLs, robots, and sitemap;
   - narrow and wide layouts;
   - keyboard navigation and reduced motion;
   - production logs and controlled error reporting.
5. Record the tested commit, Alchemy version, stage, hostname, and results.
6. Adopt the existing production Worker into Alchemy v2 using the verified
   resource identity.
7. Attach `1bye.dev` to the new production website.
8. Verify the public hostname after deployment.
9. Retain `v1.1bye.dev` as the rollback target and historical archive.
10. Delete or retire obsolete Alchemy v1 state only after confirming v2 owns the
    live resources; do not destroy the old v1 stack.

### Verification

- `1bye.dev` serves the tested new build.
- `v1.1bye.dev` continues to serve the archived portfolio.
- HTTPS, redirects, metadata, assets, and direct routes work on both domains.
- A second production plan contains no unexplained changes.
- The documented rollback can restore the previous site without rebuilding it.

### Exit Criteria

The new portfolio infrastructure is live on Alchemy v2, the original portfolio
remains accessible, and the repository is ready for the separate design phase.

## Deferred Until After Migration

- New visual direction and interaction concept
- Portfolio content architecture
- CMS or database integration
- Contact form backend
- Analytics and monitoring vendors
- Automatic pull-request environments
- Shared component extraction

## References

- [Alchemy: TanStack Start](https://alchemy.run/cloudflare/frontend/tanstack-start/)
- [Alchemy: Migrating from v1](https://alchemy.run/migrating-from-v1/)
- [Alchemy: Stages](https://alchemy.run/environments/stages/)
- [TanStack Start: Production Checklist](https://tanstack.com/start/latest/docs/framework/react/guide/production-checklist)
