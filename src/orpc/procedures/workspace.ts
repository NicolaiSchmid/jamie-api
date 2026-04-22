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
import { jamieProtected } from "#/orpc/base";

function notImplemented(name: string): never {
  throw new Error(`${name} is not implemented yet`);
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
  .handler(() => notImplemented("workspace.listMeetings"));

export const getMeeting = jamieProtected
  .route({
    method: "GET",
    path: "/v1/workspace/meetings/{meetingId}",
    tags: ["Meetings"],
    summary: "Get a workspace meeting",
  })
  .input(getMeetingInputSchema)
  .output(meetingDetailResponseSchema)
  .handler(() => notImplemented("workspace.getMeeting"));

export const deleteMeeting = jamieProtected
  .route({
    method: "DELETE",
    path: "/v1/workspace/meetings/{meetingId}",
    tags: ["Meetings"],
    summary: "Delete a workspace meeting",
  })
  .input(deleteMeetingInputSchema)
  .output(deleteMeetingResponseSchema)
  .handler(() => notImplemented("workspace.deleteMeeting"));

export const listTasks = jamieProtected
  .route({
    method: "GET",
    path: "/v1/workspace/tasks",
    tags: ["Tasks"],
    summary: "List workspace tasks",
  })
  .input(workspaceListTasksQuerySchema)
  .output(tasksListResponseSchema)
  .handler(() => notImplemented("workspace.listTasks"));
