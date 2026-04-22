# jamie-api

> A typed, cleaner wrapper around the uglier tRPC-based API behind [meetjamie.ai](https://www.meetjamie.ai/).

`jamie-api` exists to put a stable, documented, ergonomic layer in front of an
upstream API that is useful but not especially pleasant to consume directly.
Instead of spreading raw tRPC shapes and transport quirks through every client,
this project uses oRPC, Zod, and TanStack Start to expose a clearer contract.

It aims to be:

- Typed end to end
- Easy to document and inspect
- Safer to evolve than a direct upstream integration
- Focused on wrapper correctness rather than app UI

## Why this exists

The API behind `meetjamie.ai` does the job, but it is not the interface most
people would choose to build against directly.

This wrapper is the nicer layer on top:

- It gives consumers explicit request and response shapes
- It creates room to normalize awkward upstream payloads
- It keeps auth and header forwarding in one place
- It exposes both RPC and OpenAPI surfaces from the same router
- It makes the public contract easier to reason about than raw upstream tRPC

## Current shape

The repository already has the core wrapper structure in place:

- An oRPC router in `src/orpc/`
- An RPC handler at `/api/rpc`
- An OpenAPI handler and docs surface at `/api`
- Zod schemas for public shapes
- A TanStack Start server shell around the API

The current router is still minimal and includes example `todo` procedures, but
the repo structure is set up for the real job: turning Jamie's upstream API
into a cleaner, typed interface.

## API surfaces

| Route | Purpose |
| --- | --- |
| `/api` | OpenAPI-backed HTTP surface and interactive docs |
| `/api/rpc` | oRPC RPC endpoint |

The goal is to keep these surfaces aligned so the documented HTTP contract and
the RPC contract do not drift apart.

## Tech stack

- [oRPC](https://orpc.unnoq.com/) for typed procedures and router composition
- [TanStack Start](https://tanstack.com/start) for the server runtime and route
  handling
- [Zod](https://zod.dev/) for request and response validation
- [Biome](https://biomejs.dev/) for formatting and linting
- [Vitest](https://vitest.dev/) for tests

## Project structure

```text
src/
  env.ts                 Environment validation
  orpc/
    client.ts            Shared oRPC client setup
    schema.ts            Shared Zod schemas
    router/              Public wrapper procedures
  routes/
    api.$.ts             OpenAPI handler
    api.rpc.$.ts         RPC handler
```

## Local development

```bash
pnpm install
pnpm dev
```

The dev server runs on `http://localhost:3000`.

Useful endpoints:

- `http://localhost:3000/api`
- `http://localhost:3000/api/rpc`

## Deploy

```bash
pnpm deploy
```

## Quality checks

```bash
pnpm test
pnpm lint
pnpm format
pnpm check
pnpm build
```

## Design principles

This project should stay narrow and intentional:

- Be a wrapper, not a generic app
- Prefer explicit public schemas over leaking upstream response shapes
- Keep shared auth and transport logic centralized
- Preserve headers and context when proxying upstream requests
- Keep OpenAPI metadata accurate for anything public

## Direction

As this wrapper grows, the main job is not to mirror the upstream API
perfectly. The job is to make it nicer to use.

That means stable shapes, better names, clear docs, and a public contract that
feels designed instead of inherited.
