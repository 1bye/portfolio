# Alchemy v2 Migration Guardrails

This stack is prepared for Alchemy `2.0.0-beta.77`. It must be validated on an
isolated stage before production adoption.

Alchemy currently declares compatible Effect prerelease ranges that can resolve
to an incompatible mixed dependency graph. The workspace pins the complete
runtime family to `4.0.0-rc.112`, the API used by this Alchemy release. Upgrade
Alchemy and Effect together.

Phase 4 adds the new website as a separate resource. It uses
`portfolio-v2-<stage>` as its Worker name. The production Worker remains
available at its `workers.dev` URL until the new portfolio is ready. It has no
service or secret bindings; the public `VITE_IS_PRODUCTION` string is the only
environment binding and keeps the unfinished deployment out of search indexes.

## Recorded v1 Identity

The ignored local v1 state currently records:

- app: `portfolio`
- stage: `yuriihulyk`
- Worker: `portfolio-web-yuriihulyk`
- domain: `1bye.dev`

The production v2 archive resource pins that Worker name so `--adopt` can take
ownership without creating a replacement. Confirm the name in Cloudflare
before production adoption; local state is evidence, not authority.

## Stage Policy

- `dev_<user>`: local development, no custom domain.
- `live_<user>` or an explicit preview stage: isolated cloud preview, no custom
  domain.
- `prod`: production only. The existing v1 Worker serves `1bye.dev` and retains
  `v1.1bye.dev` as an alias. The v2 Worker has no custom domain.

Pass `--profile personal` for Cloudflare commands to preserve the account
selection used by the v1 stack. Alchemy v2 resolves both providers and the state
store from the active CLI profile.

Never point `alchemy dev` at `prod`. Never run the Alchemy v1 `destroy` command
after v2 adopts a resource.

## Local Validation

Run from the repository root:

```sh
bun install --frozen-lockfile
bun run check
bun run check-types
bun run build:archive
```

These commands do not access Cloudflare.

## Cloud Validation

`Cloudflare.state()` may ask to create the shared Alchemy state-store resources
on its first `plan`, `dev`, or `deploy`. Review and approve that bootstrap
separately.

The Phase 5 rehearsal used the isolated `preview` stage:

```sh
bun run plan -- --stage preview --profile personal --detailed --no-input
bun run deploy -- --stage preview --profile personal --no-input
```

It created `portfolio-web-preview` and `portfolio-v2-preview` without custom
domains. Both Worker URLs served their SSR routes and assets. The v2 preview
returned `noindex, nofollow, noarchive`.

Destroy only disposable stages, always naming the stage:

```sh
bun run destroy:stage -- preview --profile personal
```

The preview stack remains deployed as migration evidence. It can be removed
later without touching either production Worker.

## Historical Production Gate

Before adopting the existing Worker, inspect both the normal plan and the
adoption dry run:

```sh
bun run plan -- --stage prod --profile personal
bun run deploy -- --stage prod --profile personal --adopt --dry-run
```

Proceed only when the archive resolves to `portfolio-web-yuriihulyk`, the new
website has a distinct Worker name, and the only custom-domain transition is
the approved move from `1bye.dev` to `v1.1bye.dev` for the archive and to
`1bye.dev` for the new website.

## Phase 5 Release Record

- Cutover: `2026-09-15T14:24:44+01:00`
- Status: rolled back while the new portfolio is unfinished
- Tested source commit: `fe45db9`
- Alchemy: `2.0.0-beta.77`
- Preview stage: `preview`
- Production stage: `prod`
- New Worker: `portfolio-v2-prod`
- New public hostname: `https://1bye.dev`
- Archived Worker: `portfolio-web-yuriihulyk`
- Archive hostname: `https://v1.1bye.dev`

The production adoption used the existing archived Worker name and did not
create a replacement. The cutover was intentionally sequenced:

1. Adopt the existing archive, add `v1.1bye.dev`, and deploy the new Worker
   without its production domain.
2. Verify the archive on both hostnames and the new Worker on its Worker URL.
3. Move `1bye.dev` from the archive to the new Worker.
4. Repeat the production plan and require `noop` for both resources.

Alchemy scheduled the two domain updates concurrently during step 3. The
archive detached successfully, while the first new-site attachment saw the
still-attached hostname and failed. Repeating the same deployment reconciled
the remaining attachment safely. The final production plan reported no
changes.

Validation passed for SSR HTML, hydration, a real 404 route, static assets,
archive direct routes, canonical URLs, production and preview robots policies,
sitemaps, wide and `390x844` layouts, keyboard skip navigation, and a clean
browser console. Alchemy production logs were readable and contained no Worker
exceptions during validation. Common secret and framework probe paths returned
the controlled 404 page.

Both custom hostnames have valid HTTPS service. No redirect hostname is
configured, and the existing Cloudflare zone policy still allows direct HTTP
responses; forcing HTTP-to-HTTPS is intentionally outside this Worker migration.

## Current Deployment

- Rollback: `2026-09-15T14:46:19+01:00`
- Primary hostname: `https://1bye.dev`
- Primary Worker: `portfolio-web-yuriihulyk`
- Archive alias: `https://v1.1bye.dev`
- Unfinished v2 Worker:
  `https://portfolio-v2-prod.nouro-flow.workers.dev`
- V2 indexing policy: `noindex, nofollow, noarchive`

The rollback used two deployments so the shared hostname was detached before
it was reassigned. The first deployment removed the v2 custom domain and
disabled indexing. The second made `1bye.dev` the archive's canonical domain,
retained `v1.1bye.dev` as an alias, and updated its sitemap and metadata. The
final production plan reported no changes.

## Rollback Procedure

The archive remains live and needs no rebuild. Use two explicit production
deployments so the shared hostname is detached before it is reassigned:

1. Temporarily set the new Website resource to `domain: null`, leave the
   archive on `v1.1bye.dev`, run the production plan, and deploy.
2. Change the archive domain to
   `{ name: "1bye.dev", aliases: ["v1.1bye.dev"] }`, keep the new Website at
   `domain: null`, run the production plan, and deploy again.
3. Confirm the archived homepage and direct routes on both hostnames.

Do not destroy either production stage or the old Alchemy v1 state during a
rollback. To launch v2 later, first keep the archive stable on
`v1.1bye.dev`, verify it, and only then move `1bye.dev` to the v2 Worker.
