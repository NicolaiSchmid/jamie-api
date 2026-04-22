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
} from "#/orpc/jamie-contract";
import { jamieProtected } from "#/orpc/base";

function notImplemented(name: string): never {
  throw new Error(`${name} is not implemented yet`);
}

export const listMeetings = jamieProtected
  .route({
    method: "GET",
    path: "/v1/me/meetings",
    tags: ["Meetings"],
    summary: "List personal meetings",
  })
  .input(meListMeetingsQuerySchema)
  .output(meetingsListResponseSchema)
  .handler(() => notImplemented("me.listMeetings"));

export const getMeeting = jamieProtected
  .route({
    method: "GET",
    path: "/v1/me/meetings/{meetingId}",
    tags: ["Meetings"],
    summary: "Get a personal meeting",
  })
  .input(getMeetingInputSchema)
  .output(meetingDetailResponseSchema)
  .handler(() => notImplemented("me.getMeeting"));

export const deleteMeeting = jamieProtected
  .route({
    method: "DELETE",
    path: "/v1/me/meetings/{meetingId}",
    tags: ["Meetings"],
    summary: "Delete a personal meeting",
  })
  .input(deleteMeetingInputSchema)
  .output(deleteMeetingResponseSchema)
  .handler(() => notImplemented("me.deleteMeeting"));

export const searchMeetings = jamieProtected
  .route({
    method: "GET",
    path: "/v1/me/meetings/search",
    tags: ["Meetings"],
    summary: "Search personal meetings",
  })
  .input(searchMeetingsQuerySchema)
  .output(searchMeetingsResponseSchema)
  .handler(() => notImplemented("me.searchMeetings"));

export const listTasks = jamieProtected
  .route({
    method: "GET",
    path: "/v1/me/tasks",
    tags: ["Tasks"],
    summary: "List personal tasks",
  })
  .input(meListTasksQuerySchema)
  .output(tasksListResponseSchema)
  .handler(() => notImplemented("me.listTasks"));

export const listTags = jamieProtected
  .route({
    method: "GET",
    path: "/v1/me/tags",
    tags: ["Tags"],
    summary: "List personal tags",
  })
  .input(listTagsQuerySchema)
  .output(tagsListResponseSchema)
  .handler(() => notImplemented("me.listTags"));
