# Jamie REST Wrapper Plan

## Goal

Build a thin, typed wrapper around the Jamie API in this repo that preserves:

- the same `x-api-key` passthrough authentication model
- the same personal vs workspace scope rules
- the same upstream functionality and status-code behavior
- the same upstream business fields

while replacing Jamie's transport shape with a more normal REST contract:

- normal REST-style paths instead of procedure names like `meetings.list`
- normal query params instead of `?input={"json":{...}}`
- normal `DELETE` semantics instead of `POST /meetings.delete`
- unwrapped JSON responses instead of `result.data.json`

This is a plan only. No implementation is included in this document.

## Validated Facts

Validated against Jamie docs on 2026-04-23.

Base upstream API:

- `https://beta-api.meetjamie.ai`

Auth:

- every request uses `x-api-key: jk_...`
- no OAuth flow is documented for this API
- wrong key type on the wrong route family returns `403`

Scopes:

- personal keys use `/v1/me/*`
- workspace keys use `/v1/workspace/*`

Current documented upstream endpoints:

- `GET /v1/workspace/meetings.list`
- `GET /v1/workspace/meetings.get`
- `POST /v1/workspace/meetings.delete`
- `GET /v1/workspace/tasks.list`
- `GET /v1/me/meetings.list`
- `GET /v1/me/meetings.get`
- `POST /v1/me/meetings.delete`
- `GET /v1/me/meetings.search`
- `GET /v1/me/tasks.list`
- `GET /v1/me/tags.list`

Transport rules:

- read endpoints use `GET` with optional `?input={"json": {...}}`
- delete uses `POST` with a JSON body `{"json": {...}}`
- success payloads wrap data under `result.data.json`
- errors are plain JSON objects with an `error` string

Rate limiting:

- `100` requests per minute
- personal keys are limited per user
- workspace keys are limited per workspace
- upstream exposes `X-RateLimit-Limit`
- upstream exposes `X-RateLimit-Remaining`
- upstream exposes `X-RateLimit-Reset`

## Current Repo State

This repo is still in starter-template shape.

Current API surface:

- `src/orpc/router/todos.ts` contains only demo procedures
- `src/orpc/router/index.ts` exports only the demo todo router
- `src/routes/api.$.ts` exposes OpenAPI for the current oRPC router
- `src/routes/api.rpc.$.ts` exposes the raw oRPC RPC transport
- `src/schema.ts` does not exist yet; shared schemas live in `src/orpc/schema.ts`
- `src/env.ts` only validates `SERVER_URL` and `VITE_APP_TITLE`

Implication:

- we are effectively replacing the demo router with a Jamie-specific proxy layer
- we should remove or retire the demo RPC starter surface as part of the wrapper work

## Scope

In scope:

- model the full currently documented Jamie API surface
- preserve upstream auth passthrough
- preserve upstream access rules and status codes
- translate REST-style path/query/body input into Jamie's transport format
- unwrap the Jamie success envelope
- keep Jamie business payload fields intact for the first pass
- generate accurate OpenAPI docs for the wrapper
- add tests for auth forwarding, query translation, response shaping, and error passthrough

Out of scope:

- adding any Jamie business logic
- changing Jamie field semantics
- caching
- retries, circuit breakers, or queueing
- webhooks
- undocumented/private Jamie endpoints
- UI work beyond what is needed to expose the API route

## Wrapper Principles

- keep the wrapper thin and reversible
- normalize transport, not business meaning
- do not rename Jamie fields in v1 unless a field is structurally impossible to expose cleanly
- pass `x-api-key` through unchanged
- preserve upstream status codes and rate-limit headers
- centralize request translation and response unwrapping
- keep OpenAPI and route behavior aligned
- avoid keeping the raw oRPC RPC transport as a public primary surface

## Target Public Contract

### Full routing table

| Wrapper route | Wrapper method | Upstream route | Upstream method | Wrapper input | Upstream transport | Wrapper output |
|---|---|---|---|---|---|---|
| `/api/v1/me/meetings` | `GET` | `/v1/me/meetings.list` | `GET` | query string | `?input={"json":...}` | `MeetingsListResponse` |
| `/api/v1/workspace/meetings` | `GET` | `/v1/workspace/meetings.list` | `GET` | query string | `?input={"json":...}` | `MeetingsListResponse` |
| `/api/v1/me/meetings/:meetingId` | `GET` | `/v1/me/meetings.get` | `GET` | path param | `?input={"json":{"meetingId":"..."}}` | `MeetingDetailResponse` |
| `/api/v1/workspace/meetings/:meetingId` | `GET` | `/v1/workspace/meetings.get` | `GET` | path param | `?input={"json":{"meetingId":"..."}}` | `MeetingDetailResponse` |
| `/api/v1/me/meetings/:meetingId` | `DELETE` | `/v1/me/meetings.delete` | `POST` | path param | body `{"json":{"meetingId":"..."}}` | `DeleteMeetingResponse` |
| `/api/v1/workspace/meetings/:meetingId` | `DELETE` | `/v1/workspace/meetings.delete` | `POST` | path param | body `{"json":{"meetingId":"..."}}` | `DeleteMeetingResponse` |
| `/api/v1/me/meetings/search` | `GET` | `/v1/me/meetings.search` | `GET` | query string | `?input={"json":...}` | `SearchMeetingsResponse` |
| `/api/v1/me/tasks` | `GET` | `/v1/me/tasks.list` | `GET` | query string | `?input={"json":...}` | `TasksListResponse` |
| `/api/v1/workspace/tasks` | `GET` | `/v1/workspace/tasks.list` | `GET` | query string | `?input={"json":...}` | `TasksListResponse` |
| `/api/v1/me/tags` | `GET` | `/v1/me/tags.list` | `GET` | none | no `input` when empty | `TagsListResponse` |

### Wrapper to upstream parameter mapping

- `GET /api/v1/me/meetings?limit=5&tag=Product`
  -> `GET /v1/me/meetings.list?input={"json":{"limit":5,"tag":"Product"}}`
- `GET /api/v1/workspace/meetings?limit=5&userEmail=sarah@example.com`
  -> `GET /v1/workspace/meetings.list?input={"json":{"limit":5,"userEmail":"sarah@example.com"}}`
- `GET /api/v1/me/meetings/:meetingId`
  -> `GET /v1/me/meetings.get?input={"json":{"meetingId":"..."}}`
- `GET /api/v1/workspace/meetings/:meetingId`
  -> `GET /v1/workspace/meetings.get?input={"json":{"meetingId":"..."}}`
- `DELETE /api/v1/me/meetings/:meetingId`
  -> `POST /v1/me/meetings.delete` with body `{"json":{"meetingId":"..."}}`
- `DELETE /api/v1/workspace/meetings/:meetingId`
  -> `POST /v1/workspace/meetings.delete` with body `{"json":{"meetingId":"..."}}`
- `GET /api/v1/me/meetings/search?query=roadmap`
  -> `GET /v1/me/meetings.search?input={"json":{"query":"roadmap"}}`
- `GET /api/v1/me/tasks?completed=false&meetingId=...`
  -> `GET /v1/me/tasks.list?input={"json":{"completed":false,"meetingId":"..."}}`
- `GET /api/v1/workspace/tasks?completed=false&userEmail=sarah@example.com&meetingId=...`
  -> `GET /v1/workspace/tasks.list?input={"json":{"completed":false,"userEmail":"sarah@example.com","meetingId":"..."}}`
- `GET /api/v1/me/tags`
  -> `GET /v1/me/tags.list`

### Full TypeScript contract

The wrapper should define the public request/response contract explicitly in
TypeScript, then mirror it in Zod.

```ts
export type IsoDateTimeString = string;
export type IsoDateString = string;
export type HexColorString = string;
export type CursorString = string;
export type MeetingId = string;
export type TaskId = string;
export type TagId = string;
export type UserId = string;
export type ParticipantId = string;
export type PersonId = string;

export type UpstreamErrorResponse = {
  error: string;
};

export type EventResponseStatus =
  | "accepted"
  | "declined"
  | "tentative"
  | "needsAction"
  | null;

export type MeetingListItem = {
  id: MeetingId;
  title: string;
  generatedTitle: string | null;
  startTime: IsoDateTimeString;
  endTime: IsoDateTimeString | null;
  calendarEventId: string | null;
  userId: UserId;
};

export type MeetingUser = {
  id: UserId;
  email: string;
};

export type MeetingSummary = {
  markdown: string;
  html: string;
  short: string;
};

export type MeetingParticipant = {
  id: ParticipantId;
  name: string;
  email: string | null;
};

export type MeetingTaskAssignee = {
  name: string;
  email: string | null;
};

export type MeetingTask = {
  content: string;
  completed: boolean;
  assignee: MeetingTaskAssignee | null;
};

export type MeetingTag = {
  name: string;
  color: HexColorString;
};

export type MeetingEventAttendee = {
  name: string;
  email: string;
  responseStatus: EventResponseStatus;
  organizer: boolean;
};

export type MeetingEvent = {
  id: string | null;
  externalId: string | null;
  title: string;
  scheduledTime: IsoDateTimeString;
  endTime: IsoDateTimeString | null;
  attendees: MeetingEventAttendee[];
};

export type MeetingDetailResponse = {
  id: MeetingId;
  title: string;
  generatedTitle: string | null;
  startTime: IsoDateTimeString;
  endTime: IsoDateTimeString | null;
  user: MeetingUser;
  summary: MeetingSummary;
  transcript: string;
  participants: MeetingParticipant[];
  tasks: MeetingTask[];
  tags: MeetingTag[];
  event: MeetingEvent;
};

export type TaskAssignee = {
  id: PersonId | null;
  name: string;
  email: string | null;
};

export type TaskListItem = {
  id: TaskId;
  text: string;
  completed: boolean;
  assignee: TaskAssignee | null;
  meetingId: MeetingId;
  meetingTitle: string | null;
  createdAt: IsoDateTimeString;
  userId: UserId;
};

export type TagListItem = {
  id: TagId;
  name: string;
  shared: boolean;
};

export type SearchResultItem = {
  id: string;
  text: string;
  meetingId: MeetingId;
  meetingTitle: string | null;
  meetingDate: IsoDateString;
};

export type MeetingsListResponse = {
  meetings: MeetingListItem[];
  nextCursor: CursorString | null;
};

export type TasksListResponse = {
  tasks: TaskListItem[];
  nextCursor: CursorString | null;
};

export type TagsListResponse = {
  tags: TagListItem[];
};

export type SearchMeetingsResponse = {
  results: SearchResultItem[];
};

export type DeleteMeetingResponse = {
  success: boolean;
  message: string;
  deletedMeetingId: MeetingId;
};

export type MeListMeetingsQuery = {
  limit?: number;
  cursor?: CursorString;
  startDate?: IsoDateTimeString;
  endDate?: IsoDateTimeString;
  tag?: string;
};

export type WorkspaceListMeetingsQuery = {
  limit?: number;
  cursor?: CursorString;
  startDate?: IsoDateTimeString;
  endDate?: IsoDateTimeString;
  userEmail?: string;
};

export type GetMeetingPathParams = {
  meetingId: MeetingId;
};

export type DeleteMeetingPathParams = {
  meetingId: MeetingId;
};

export type SearchMeetingsQuery = {
  query: string;
  startDate?: IsoDateTimeString;
  endDate?: IsoDateTimeString;
};

export type MeListTasksQuery = {
  limit?: number;
  cursor?: CursorString;
  startDate?: IsoDateTimeString;
  endDate?: IsoDateTimeString;
  completed?: boolean;
  meetingId?: MeetingId;
};

export type WorkspaceListTasksQuery = {
  limit?: number;
  cursor?: CursorString;
  startDate?: IsoDateTimeString;
  endDate?: IsoDateTimeString;
  userEmail?: string;
  completed?: boolean;
  meetingId?: MeetingId;
};

export type ListTagsQuery = Record<string, never>;
```

### Route-by-route request and response types

```ts
export type RouteContract =
  | {
      method: "GET";
      path: "/api/v1/me/meetings";
      input: MeListMeetingsQuery;
      output: MeetingsListResponse;
    }
  | {
      method: "GET";
      path: "/api/v1/workspace/meetings";
      input: WorkspaceListMeetingsQuery;
      output: MeetingsListResponse;
    }
  | {
      method: "GET";
      path: "/api/v1/me/meetings/:meetingId";
      input: GetMeetingPathParams;
      output: MeetingDetailResponse;
    }
  | {
      method: "GET";
      path: "/api/v1/workspace/meetings/:meetingId";
      input: GetMeetingPathParams;
      output: MeetingDetailResponse;
    }
  | {
      method: "DELETE";
      path: "/api/v1/me/meetings/:meetingId";
      input: DeleteMeetingPathParams;
      output: DeleteMeetingResponse;
    }
  | {
      method: "DELETE";
      path: "/api/v1/workspace/meetings/:meetingId";
      input: DeleteMeetingPathParams;
      output: DeleteMeetingResponse;
    }
  | {
      method: "GET";
      path: "/api/v1/me/meetings/search";
      input: SearchMeetingsQuery;
      output: SearchMeetingsResponse;
    }
  | {
      method: "GET";
      path: "/api/v1/me/tasks";
      input: MeListTasksQuery;
      output: TasksListResponse;
    }
  | {
      method: "GET";
      path: "/api/v1/workspace/tasks";
      input: WorkspaceListTasksQuery;
      output: TasksListResponse;
    }
  | {
      method: "GET";
      path: "/api/v1/me/tags";
      input: ListTagsQuery;
      output: TagsListResponse;
    };
```

### Response behavior

Wrapper responses should return the unwrapped Jamie payload directly:

- `GET /api/v1/me/meetings` returns `MeetingsListResponse`
- `GET /api/v1/me/meetings/:meetingId` returns `MeetingDetailResponse`
- `GET /api/v1/me/tasks` returns `TasksListResponse`
- `GET /api/v1/me/tags` returns `TagsListResponse`
- `GET /api/v1/me/meetings/search` returns `SearchMeetingsResponse`
- `DELETE /api/v1/me/meetings/:meetingId` returns `DeleteMeetingResponse`

### Error behavior

For the first pass, preserve upstream error style:

- status code should match upstream
- body should stay `{ "error": "..." }` when upstream returns that format

Do not introduce a new local error envelope in the wrapper v1.

## Recommended Internal Architecture

### Environment

Extend `src/env.ts` with:

- `JAMIE_API_BASE_URL`

Recommendation:

- default to `https://beta-api.meetjamie.ai`
- allow override through env for tests and local integration harnesses

### New modules

Add a small Jamie-specific proxy layer under `src/orpc/`.

Recommended file layout:

- `src/orpc/jamie-client.ts`
- `src/orpc/jamie-errors.ts`
- `src/orpc/jamie-schema.ts`
- `src/orpc/procedures/base.ts`
- `src/orpc/procedures/me.ts`
- `src/orpc/procedures/workspace.ts`
- `src/orpc/router/index.ts`

Optional if the schemas grow:

- `src/orpc/schema/meetings.ts`
- `src/orpc/schema/tasks.ts`
- `src/orpc/schema/tags.ts`

### Module responsibilities

`src/orpc/jamie-client.ts`

- read `x-api-key` from request context
- build upstream URLs
- encode Jamie `input={"json":...}` query strings
- send upstream requests
- unwrap `result.data.json` on success
- preserve upstream status and selected headers

`src/orpc/jamie-errors.ts`

- normalize transport-layer failures we produce locally
- distinguish upstream API errors from local runtime failures
- keep error messages stable

`src/orpc/jamie-schema.ts` or split schema files

- input schemas for wrapper query/path params
- output schemas for each endpoint based on documented Jamie shapes
- shared field schemas such as `User`, `Participant`, `Task`, `Tag`, `Event`

`src/orpc/procedures/base.ts`

- shared context shape
- shared metadata helpers
- shared auth/header extraction
- common upstream-call helper wrapping `jamie-client`

`src/orpc/procedures/me.ts`

- personal-scope endpoints only
- list meetings
- get meeting
- delete meeting
- search meetings
- list tasks
- list tags

`src/orpc/procedures/workspace.ts`

- workspace-scope endpoints only
- list meetings
- get meeting
- delete meeting
- list tasks

## OpenAPI Strategy

The OpenAPI surface should reflect the clean REST wrapper, not Jamie's procedure URLs.

Required outcomes:

- path parameters for `:meetingId`
- standard query parameters instead of `input.json`
- documented `x-api-key` header auth
- documented direct success payloads without the Jamie envelope
- documented upstream error shape for expected failures

Recommendation:

- keep `src/routes/api.$.ts` as the canonical public API surface
- treat `src/routes/api.rpc.$.ts` as non-canonical
- preferred implementation is to stop documenting the raw RPC surface and, if practical, remove it entirely once the wrapper routes exist

## Phase 0: Replace Demo Surface With Jamie Skeleton

### Changes

1. Remove the todo demo procedures from:
   - `src/orpc/router/todos.ts`
   - `src/orpc/schema.ts`
2. Create the Jamie-oriented module structure under `src/orpc/`
3. Update `src/orpc/router/index.ts` to export Jamie procedures only
4. Update `src/env.ts` for the Jamie base URL

### Deliverable

- the repo no longer presents starter todo APIs
- the codebase has a dedicated place for the Jamie wrapper

## Phase 1: Build The Shared Upstream Client

### Changes

Implement a single shared upstream client that can:

1. accept:
   - route family: `me` or `workspace`
   - upstream procedure name
   - method
   - optional input object
   - current request headers/context
2. require and forward `x-api-key`
3. generate:
   - `GET /v1/<scope>/<procedure>?input={"json":...}`
   - `POST /v1/<scope>/<procedure>` with `{"json":...}`
4. unwrap `result.data.json`
5. return upstream JSON errors unchanged when upstream returns non-2xx
6. expose rate-limit headers back to the caller

### Deliverable

- every wrapper procedure can use one shared transport adapter

## Phase 2: Add Typed Schemas For The Full Documented Surface

### Changes

Define explicit input/output schemas for:

1. meetings list
2. meeting detail
3. meeting delete
4. meeting search
5. tasks list
6. tags list

Important choices:

- preserve Jamie field names in outputs
- use wrapper-native input shapes
- model scope-specific input differences explicitly

Examples:

- `workspace meetings.list` allows `userEmail`
- `me meetings.list` allows `tag`
- `workspace tasks.list` allows `userEmail`
- `workspace tasks.list` allows `meetingId`
- `me tasks.list` allows `meetingId`
- `me meetings.search` is personal-only
- `me tags.list` is personal-only

### Deliverable

- the entire public wrapper contract is typed in Zod

## Phase 3: Implement Wrapper Procedures

### Changes

Implement oRPC procedures for the full route map.

Procedure responsibilities:

1. validate wrapper-native input
2. map path/query/body params to Jamie `input.json`
3. call the shared Jamie client
4. return unwrapped success payloads
5. preserve upstream error semantics

Recommended procedure grouping:

- `meListMeetings`
- `meGetMeeting`
- `meDeleteMeeting`
- `meSearchMeetings`
- `meListTasks`
- `meListTags`
- `workspaceListMeetings`
- `workspaceGetMeeting`
- `workspaceDeleteMeeting`
- `workspaceListTasks`

### Deliverable

- the wrapper supports the full documented Jamie API surface

## Phase 4: Shape The Public REST Surface

### Changes

Ensure the OpenAPI-exposed route contract uses clean REST paths.

Required behavior:

1. list endpoints use query parameters
2. get endpoints use path params
3. delete endpoints use `DELETE`
4. no public route exposes Jamie procedure names like `meetings.list`
5. no public route requires `input={"json":...}`

If necessary, add orRPC metadata carefully so the generated OpenAPI contract uses:

- `/api/v1/me/meetings`
- `/api/v1/workspace/meetings`
- `/api/v1/me/meetings/{meetingId}`
- `/api/v1/workspace/meetings/{meetingId}`
- `/api/v1/me/meetings/search`
- `/api/v1/me/tasks`
- `/api/v1/workspace/tasks`
- `/api/v1/me/tags`

### Deliverable

- generated OpenAPI shows the normalized REST wrapper contract

## Phase 5: Retire Or Demote The Raw RPC Surface

### Recommendation

The repo should not present the oRPC RPC transport as the main product surface.

Preferred options, in order:

1. remove `src/routes/api.rpc.$.ts`
2. keep it but mark it internal and undocumented
3. keep it only temporarily during migration while OpenAPI/REST is stabilized

Reason:

- the user-facing goal of this repo is to hide the tRPC-shaped transport, not to re-expose it under a second route

### Deliverable

- the wrapper has one clearly canonical API surface

## Test Plan

Add focused tests before any broad integration harness.

### Unit tests

Recommended test files:

- `src/orpc/__tests__/jamie-client.test.ts`
- `src/orpc/__tests__/me-procedures.test.ts`
- `src/orpc/__tests__/workspace-procedures.test.ts`
- `src/routes/__tests__/api-openapi.test.ts`

### Required cases

1. auth forwarding
   - forwards `x-api-key` unchanged
   - fails predictably when the header is missing

2. query translation
   - wrapper query params become Jamie `input.json`
   - scope-specific params are accepted only where valid

3. method translation
   - wrapper `DELETE` becomes upstream `POST /meetings.delete`

4. envelope removal
   - `result.data.json` is unwrapped on success

5. upstream error passthrough
   - preserve status codes
   - preserve `{ error }` body

6. rate-limit passthrough
   - forward `X-RateLimit-*` headers

7. OpenAPI contract
   - generated paths reflect RESTful wrapper routes
   - no `input.json` query parameter appears in the public spec

## Verification Checklist

After implementation:

1. run `pnpm test`
2. run `pnpm check`
3. inspect generated OpenAPI paths on `/api`
4. verify the public docs show REST paths, not Jamie procedure names
5. manually call at least one endpoint from each family against a real Jamie key:
   - `GET /api/v1/me/meetings`
   - `GET /api/v1/me/meetings/{meetingId}`
   - `DELETE /api/v1/me/meetings/{meetingId}`
   - `GET /api/v1/me/meetings/search`
   - `GET /api/v1/me/tasks`
   - `GET /api/v1/me/tags`
   - `GET /api/v1/workspace/meetings`
   - `GET /api/v1/workspace/tasks`
6. confirm upstream `403` behavior still matches key-scope mistakes
7. confirm rate-limit headers are visible on wrapper responses

## Risks And Decisions

### 1. REST path generation with oRPC/OpenAPI

Risk:

- the current repo uses oRPC and its OpenAPI tooling, which may encourage procedure naming unless metadata is configured carefully

Decision:

- verify early that OpenAPI generation can emit the target paths cleanly
- if not, use thin explicit route handlers for the public REST surface and keep oRPC internal

### 2. Field normalization creep

Risk:

- it is tempting to rename or reshape Jamie fields while touching schemas

Decision:

- do not add business-field normalization in wrapper v1
- only normalize transport

### 3. Header passthrough leakage

Risk:

- forwarding too many headers upstream can create unstable behavior

Decision:

- forward only what is required, starting with `x-api-key`
- add other forwarded headers only with a clear need

### 4. Undocumented upstream drift

Risk:

- the Jamie docs may lag real upstream behavior

Decision:

- build the wrapper to the documented contract first
- when real-key testing finds drift, document the delta and update the wrapper intentionally

## Implementation Order

1. create the Jamie module skeleton and remove demo todos
2. add `JAMIE_API_BASE_URL` env support
3. implement the shared Jamie client
4. add endpoint schemas
5. implement `me` procedures
6. implement `workspace` procedures
7. expose clean OpenAPI routes
8. retire or demote the raw RPC route
9. add tests
10. run verification against a real Jamie key
