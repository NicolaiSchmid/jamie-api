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
import {
  meDeleteMeetingEndpoint,
  meGetMeetingEndpoint,
  meListMeetingsEndpoint,
  meListTagsEndpoint,
  meListTasksEndpoint,
  meSearchMeetingsEndpoint,
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
    path: "/v1/me/meetings",
    tags: ["Meetings"],
    summary: "List personal meetings",
  })
  .input(meListMeetingsQuerySchema)
  .output(meetingsListResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      meListMeetingsEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );

export const getMeeting = jamieProtected
  .route({
    method: "GET",
    path: "/v1/me/meetings/{meetingId}",
    tags: ["Meetings"],
    summary: "Get a personal meeting",
  })
  .input(getMeetingInputSchema)
  .output(meetingDetailResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      meGetMeetingEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );

export const deleteMeeting = jamieProtected
  .route({
    method: "DELETE",
    path: "/v1/me/meetings/{meetingId}",
    tags: ["Meetings"],
    summary: "Delete a personal meeting",
  })
  .input(deleteMeetingInputSchema)
  .output(deleteMeetingResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      meDeleteMeetingEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );

export const searchMeetings = jamieProtected
  .route({
    method: "GET",
    path: "/v1/me/meetings/search",
    tags: ["Meetings"],
    summary: "Search personal meetings",
  })
  .input(searchMeetingsQuerySchema)
  .output(searchMeetingsResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      meSearchMeetingsEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );

export const listTasks = jamieProtected
  .route({
    method: "GET",
    path: "/v1/me/tasks",
    tags: ["Tasks"],
    summary: "List personal tasks",
  })
  .input(meListTasksQuerySchema)
  .output(tasksListResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      meListTasksEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );

export const listTags = jamieProtected
  .route({
    method: "GET",
    path: "/v1/me/tags",
    tags: ["Tags"],
    summary: "List personal tags",
  })
  .input(listTagsQuerySchema)
  .output(tagsListResponseSchema)
  .handler(({ context, input }) =>
    callJamieEndpoint(
      meListTagsEndpoint,
      input,
      getJamieApiKey(context),
    ),
  );
