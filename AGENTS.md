# AGENTS.md — Coding Agent Guidelines for jamie-api

> `jamie-api` is a TypeScript API wrapper built with oRPC, TanStack Start,
> Biome, Vitest, and Zod.

## Purpose

- This repo should stay focused on being a typed wrapper around Jamie's
  tRPC-backed API.
- Prefer server and schema correctness over starter-template UI work.
- Keep the public API explicit. Avoid leaking upstream response shapes when a
  local normalized shape is clearer.

## Workspace Structure

- `src/orpc/`: oRPC client, router, schemas, and procedure definitions
- `src/routes/api.$.ts`: OpenAPI handler and docs surface
- `src/routes/api.rpc.$.ts`: RPC handler
- `src/env.ts`: environment variable validation
- `src/routeTree.gen.ts`: generated file; do not edit manually

## Build Commands

```bash
pnpm dev
pnpm build
pnpm preview
```

## Lint / Format / Check

Biome is the sole formatter and linter in this repo.

```bash
pnpm lint
pnpm format
pnpm check
```

## Testing

Vitest is the test runner.

```bash
pnpm test
```

- Add tests for router behavior, schema validation, auth/header propagation,
  and wrapper-specific response shaping.
- Prefer small unit tests around procedure builders and route handlers before
  adding broader integration coverage.

## Git

- Use Conventional Commits for new commits.
- Preferred format: `type(scope): short summary`
- Common scopes here are `api`, `orpc`, `routes`, `schema`, and `docs`.

## Code Style

Follow the repo configuration instead of copying defaults from other repos.

### Formatting

- Respect Biome settings in `biome.json`
- Double quotes
- Semicolons
- Let Biome organize imports

### TypeScript

- Keep `strict` mode assumptions intact
- Prefer explicit named types for public request and response shapes
- Use `import type` for type-only imports
- Avoid `any`; use `unknown` or proper narrowing
- Prefer union literals over `enum`
- Use `satisfies` and `as const` where they improve API safety

### Naming

- Files: kebab-case
- Components/types/interfaces: PascalCase
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE

### Error Handling

- Use explicit typed oRPC errors for expected API failures
- Do not swallow errors silently
- Log unexpected server errors in handlers and interceptors
- Keep error messages stable and suitable for API consumers

## oRPC Conventions

- Keep shared procedure setup centralized instead of repeating context and auth
  logic in each endpoint.
- Prefer versioned procedure builders if the upstream API has versioned
  behavior.
- Co-locate input/output schemas with the procedures they protect, or in
  `src/orpc/schema.ts` when reused across endpoints.
- Keep the router surface intentional. Export only supported procedures from
  `src/orpc/router/index.ts`.
- Preserve request headers and auth context when proxying upstream calls.
- Keep OpenAPI metadata accurate whenever a procedure becomes part of the
  public wrapper surface.

## Environment Variables

- Validate env vars in `src/env.ts`
- Client-facing vars must use the `VITE_` prefix
- Do not commit secrets or local env files

## Generated Files

- Do not manually edit `src/routeTree.gen.ts`
- If routing changes regenerate the file through the repo's normal toolchain
  instead of patching generated output by hand

## Common Pitfalls

- Do not let starter-template UI concerns drive API structure
- Do not duplicate schema definitions across route handlers and procedures
- Do not mix transport concerns with response normalization when a separate
  helper keeps the wrapper clearer
- Keep OpenAPI and RPC behavior aligned when both surfaces expose the same
  procedure
