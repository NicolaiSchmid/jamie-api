import { jamieProtected } from "#/orpc/base";
import { callJamieEndpoint } from "#/orpc/jamie-client";
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
			context.jamieApiKey,
			context.resHeaders,
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
			context.jamieApiKey,
			context.resHeaders,
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
			context.jamieApiKey,
			context.resHeaders,
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
			context.jamieApiKey,
			context.resHeaders,
		),
	);
