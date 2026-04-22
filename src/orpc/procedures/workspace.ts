import {
  deleteMeetingInputSchema,
  deleteMeetingResponseSchema,
  getMeetingInputSchema,
  meetingDetailResponseSchema,
  meetingsListResponseSchema,
  tasksListResponseSchema,
  workspaceListMeetingsQuerySchema,
  workspaceListTasksQuerySchema,
} from "#/orpc/jamie-contract";
import {
  workspaceDeleteMeetingEndpoint,
  workspaceGetMeetingEndpoint,
  workspaceListMeetingsEndpoint,
  workspaceListTasksEndpoint,
} from "#/orpc/jamie-endpoints";
import { callJamieEndpoint } from "#/orpc/jamie-client";
import { jamieProtected } from "#/orpc/base";

function getJamieApiKey(context: { jamieApiKey?: string }) {
  if (!context.jamieApiKey) {
    throw new Error("Jamie API key missing from context");
  }

  return context.jamieApiKey;
}

export const listMeetings = jamieProtected
  .route({
    method: "GET",
    path: "/v1/workspace/meetings",
    tags: ["Meetings"],
    summary: "List workspace meetings",
  })
  .input(workspaceListMeetingsQuerySchema)
  .output(meetingsListResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      workspaceListMeetingsEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );

export const getMeeting = jamieProtected
  .route({
    method: "GET",
    path: "/v1/workspace/meetings/{meetingId}",
    tags: ["Meetings"],
    summary: "Get a workspace meeting",
  })
  .input(getMeetingInputSchema)
  .output(meetingDetailResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      workspaceGetMeetingEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );

export const deleteMeeting = jamieProtected
  .route({
    method: "DELETE",
    path: "/v1/workspace/meetings/{meetingId}",
    tags: ["Meetings"],
    summary: "Delete a workspace meeting",
  })
  .input(deleteMeetingInputSchema)
  .output(deleteMeetingResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      workspaceDeleteMeetingEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );

export const listTasks = jamieProtected
  .route({
    method: "GET",
    path: "/v1/workspace/tasks",
    tags: ["Tasks"],
    summary: "List workspace tasks",
  })
  .input(workspaceListTasksQuerySchema)
  .output(tasksListResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      workspaceListTasksEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );
