import { jamieProtected } from "#/orpc/base";
import { callJamieEndpoint } from "#/orpc/jamie-client";
import {
	deleteMeetingInputSchema,
	deleteMeetingResponseSchema,
	getMeetingInputSchema,
	listTagsQuerySchema,
	meetingDetailResponseSchema,
	meetingsListResponseSchema,
	meListMeetingsQuerySchema,
	meListTasksQuerySchema,
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
			context.jamieApiKey,
			context.resHeaders,
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
			context.jamieApiKey,
			context.resHeaders,
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
			context.jamieApiKey,
			context.resHeaders,
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
			context.jamieApiKey,
			context.resHeaders,
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
			context.jamieApiKey,
			context.resHeaders,
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
			context.jamieApiKey,
			context.resHeaders,
		),
	);
