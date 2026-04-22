import type { ZodType } from "zod";

import {
  deleteMeetingInputSchema,
  deleteMeetingResponseSchema,
  getMeetingInputSchema,
  listTagsQuerySchema,
  meListMeetingsQuerySchema,
  meListTasksQuerySchema,
  meetingDetailResponseSchema,
  meetingsListResponseSchema,
  searchMeetingsQuerySchema,
  searchMeetingsResponseSchema,
  tagsListResponseSchema,
  tasksListResponseSchema,
  workspaceListMeetingsQuerySchema,
  workspaceListTasksQuerySchema,
} from "#/orpc/jamie-contract";

export type JamieScope = "me" | "workspace";
export type JamieMethod = "GET" | "POST";

export type JamieEndpoint<
  TInputSchema extends ZodType,
  TOutputSchema extends ZodType,
  TScope extends JamieScope = JamieScope,
  TMethod extends JamieMethod = JamieMethod,
> = {
  scope: TScope;
  procedure: string;
  method: TMethod;
  inputSchema: TInputSchema;
  outputSchema: TOutputSchema;
  toUpstreamInput: (input: TInputSchema["_output"]) => unknown;
};

function defineJamieEndpoint<
  TInputSchema extends ZodType,
  TOutputSchema extends ZodType,
  TScope extends JamieScope,
  TMethod extends JamieMethod,
>(endpoint: JamieEndpoint<TInputSchema, TOutputSchema, TScope, TMethod>) {
  return endpoint;
}

export const meListMeetingsEndpoint = defineJamieEndpoint({
  scope: "me",
  procedure: "meetings.list",
  method: "GET",
  inputSchema: meListMeetingsQuerySchema,
  outputSchema: meetingsListResponseSchema,
  toUpstreamInput: (input) => input,
});

export const workspaceListMeetingsEndpoint = defineJamieEndpoint({
  scope: "workspace",
  procedure: "meetings.list",
  method: "GET",
  inputSchema: workspaceListMeetingsQuerySchema,
  outputSchema: meetingsListResponseSchema,
  toUpstreamInput: (input) => input,
});

export const meGetMeetingEndpoint = defineJamieEndpoint({
  scope: "me",
  procedure: "meetings.get",
  method: "GET",
  inputSchema: getMeetingInputSchema,
  outputSchema: meetingDetailResponseSchema,
  toUpstreamInput: (input) => input,
});

export const workspaceGetMeetingEndpoint = defineJamieEndpoint({
  scope: "workspace",
  procedure: "meetings.get",
  method: "GET",
  inputSchema: getMeetingInputSchema,
  outputSchema: meetingDetailResponseSchema,
  toUpstreamInput: (input) => input,
});

export const meDeleteMeetingEndpoint = defineJamieEndpoint({
  scope: "me",
  procedure: "meetings.delete",
  method: "POST",
  inputSchema: deleteMeetingInputSchema,
  outputSchema: deleteMeetingResponseSchema,
  toUpstreamInput: (input) => input,
});

export const workspaceDeleteMeetingEndpoint = defineJamieEndpoint({
  scope: "workspace",
  procedure: "meetings.delete",
  method: "POST",
  inputSchema: deleteMeetingInputSchema,
  outputSchema: deleteMeetingResponseSchema,
  toUpstreamInput: (input) => input,
});

export const meSearchMeetingsEndpoint = defineJamieEndpoint({
  scope: "me",
  procedure: "meetings.search",
  method: "GET",
  inputSchema: searchMeetingsQuerySchema,
  outputSchema: searchMeetingsResponseSchema,
  toUpstreamInput: (input) => input,
});

export const meListTasksEndpoint = defineJamieEndpoint({
  scope: "me",
  procedure: "tasks.list",
  method: "GET",
  inputSchema: meListTasksQuerySchema,
  outputSchema: tasksListResponseSchema,
  toUpstreamInput: (input) => input,
});

export const workspaceListTasksEndpoint = defineJamieEndpoint({
  scope: "workspace",
  procedure: "tasks.list",
  method: "GET",
  inputSchema: workspaceListTasksQuerySchema,
  outputSchema: tasksListResponseSchema,
  toUpstreamInput: (input) => input,
});

export const meListTagsEndpoint = defineJamieEndpoint({
  scope: "me",
  procedure: "tags.list",
  method: "GET",
  inputSchema: listTagsQuerySchema,
  outputSchema: tagsListResponseSchema,
  toUpstreamInput: () => undefined,
});
