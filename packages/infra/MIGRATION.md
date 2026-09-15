# Alchemy v2 Migration Guardrails

This stack is prepared for Alchemy `2.0.0-beta.77`. It must be validated on an
isolated stage before production adoption.

Alchemy currently declares compatible Effect prerelease ranges that can resolve
to an incompatible mixed dependency graph. The workspace pins the complete
runtime family to `4.0.0-rc.112`, the API used by this Alchemy release. Upgrade
Alchemy and Effect together.

Phase 3 declares only the archive resource because `apps/web` does not exist
yet. Phase 4 must add the new website resource before the final production
plan.

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
- `prod`: production only. The archive targets `v1.1bye.dev` and the existing
  v1 Worker name.

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

After approval, first deploy the tagged v1 stack to a disposable stage without
its production domain. Confirm its physical Worker name is
`portfolio-web-migration-preview`, then inspect the v2 plan:

```sh
bun run plan -- --stage migration-preview --profile personal
```

`alchemy plan` has no adoption flag. Preview the adoption through a deployment
dry run and proceed only when it identifies the expected existing Worker by
physical name:

```sh
bun run deploy -- --stage migration-preview --profile personal --adopt --dry-run
```

Then perform the disposable-stage adoption:

```sh
bun run deploy -- --stage migration-preview --profile personal --adopt
```

Destroy only disposable stages, always naming the stage:

```sh
bun run destroy:stage -- migration-preview --profile personal
```

Production adoption remains a Phase 5 cutover action. Do not run it during the
infrastructure migration.

## Production Gate

After Phase 4 adds the new website resource, inspect both the normal plan and
the adoption dry run:

```sh
bun run plan -- --stage prod --profile personal
bun run deploy -- --stage prod --profile personal --adopt --dry-run
```

Proceed only when the archive resolves to `portfolio-web-yuriihulyk`, the new
website has a distinct Worker name, and the only custom-domain transition is
the approved move from `1bye.dev` to `v1.1bye.dev` for the archive and to
`1bye.dev` for the new website.
