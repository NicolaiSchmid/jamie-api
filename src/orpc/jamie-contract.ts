import { z } from "zod";

const isoDateTimeStringSchema = z.iso.datetime();
const isoDateStringSchema = z.iso.date();

export const upstreamErrorResponseSchema = z.object({
  error: z.string(),
});

export const eventResponseStatusSchema = z.enum([
  "accepted",
  "declined",
  "tentative",
  "needsAction",
]);

export const meetingListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  generatedTitle: z.string().nullable(),
  startTime: isoDateTimeStringSchema,
  endTime: isoDateTimeStringSchema.nullable(),
  calendarEventId: z.string().nullable(),
  userId: z.string(),
});

export const meetingUserSchema = z.object({
  id: z.string(),
  email: z.email(),
});

export const meetingSummarySchema = z.object({
  markdown: z.string(),
  html: z.string(),
  short: z.string(),
});

export const meetingParticipantSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email().nullable(),
});

export const meetingTaskAssigneeSchema = z.object({
  name: z.string(),
  email: z.email().nullable(),
});

export const meetingTaskSchema = z.object({
  content: z.string(),
  completed: z.boolean(),
  assignee: meetingTaskAssigneeSchema.nullable(),
});

export const meetingTagSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export const meetingEventAttendeeSchema = z.object({
  name: z.string(),
  email: z.email(),
  responseStatus: eventResponseStatusSchema.nullable(),
  organizer: z.boolean(),
});

export const meetingEventSchema = z.object({
  id: z.string().nullable(),
  externalId: z.string().nullable(),
  title: z.string(),
  scheduledTime: isoDateTimeStringSchema,
  endTime: isoDateTimeStringSchema.nullable(),
  attendees: z.array(meetingEventAttendeeSchema),
});

export const meetingDetailResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  generatedTitle: z.string().nullable(),
  startTime: isoDateTimeStringSchema,
  endTime: isoDateTimeStringSchema.nullable(),
  user: meetingUserSchema,
  summary: meetingSummarySchema,
  transcript: z.string(),
  participants: z.array(meetingParticipantSchema),
  tasks: z.array(meetingTaskSchema),
  tags: z.array(meetingTagSchema),
  event: meetingEventSchema,
});

export const taskAssigneeSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  email: z.email().nullable(),
});

export const taskListItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  assignee: taskAssigneeSchema.nullable(),
  meetingId: z.string(),
  meetingTitle: z.string().nullable(),
  createdAt: isoDateTimeStringSchema,
  userId: z.string(),
});

export const tagListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  shared: z.boolean(),
});

export const searchResultItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  meetingId: z.string(),
  meetingTitle: z.string().nullable(),
  meetingDate: isoDateStringSchema,
});

export const meetingsListResponseSchema = z.object({
  meetings: z.array(meetingListItemSchema),
  nextCursor: z.string().nullable(),
});

export const tasksListResponseSchema = z.object({
  tasks: z.array(taskListItemSchema),
  nextCursor: z.string().nullable(),
});

export const tagsListResponseSchema = z.object({
  tags: z.array(tagListItemSchema),
});

export const searchMeetingsResponseSchema = z.object({
  results: z.array(searchResultItemSchema),
});

export const deleteMeetingResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  deletedMeetingId: z.string(),
});

const paginationQueryShape = {
  limit: z.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
  startDate: isoDateTimeStringSchema.optional(),
  endDate: isoDateTimeStringSchema.optional(),
};

export const meListMeetingsQuerySchema = z.object({
  ...paginationQueryShape,
  tag: z.string().optional(),
});

export const workspaceListMeetingsQuerySchema = z.object({
  ...paginationQueryShape,
  userEmail: z.email().optional(),
});

export const getMeetingInputSchema = z.object({
  meetingId: z.string(),
});

export const deleteMeetingInputSchema = z.object({
  meetingId: z.string(),
});

export const searchMeetingsQuerySchema = z.object({
  query: z.string().min(1),
  startDate: isoDateTimeStringSchema.optional(),
  endDate: isoDateTimeStringSchema.optional(),
});

export const meListTasksQuerySchema = z.object({
  ...paginationQueryShape,
  completed: z.boolean().optional(),
  meetingId: z.string().optional(),
});

export const workspaceListTasksQuerySchema = z.object({
  ...paginationQueryShape,
  userEmail: z.email().optional(),
  completed: z.boolean().optional(),
  meetingId: z.string().optional(),
});

export const listTagsQuerySchema = z.object({});

export type UpstreamErrorResponse = z.infer<typeof upstreamErrorResponseSchema>;

export type MeetingsListResponse = z.infer<typeof meetingsListResponseSchema>;
export type MeetingDetailResponse = z.infer<typeof meetingDetailResponseSchema>;
export type DeleteMeetingResponse = z.infer<typeof deleteMeetingResponseSchema>;
export type SearchMeetingsResponse = z.infer<typeof searchMeetingsResponseSchema>;
export type TasksListResponse = z.infer<typeof tasksListResponseSchema>;
export type TagsListResponse = z.infer<typeof tagsListResponseSchema>;

export type MeListMeetingsQuery = z.infer<typeof meListMeetingsQuerySchema>;
export type WorkspaceListMeetingsQuery = z.infer<
  typeof workspaceListMeetingsQuerySchema
>;
export type GetMeetingInput = z.infer<typeof getMeetingInputSchema>;
export type DeleteMeetingInput = z.infer<typeof deleteMeetingInputSchema>;
export type SearchMeetingsQuery = z.infer<typeof searchMeetingsQuerySchema>;
export type MeListTasksQuery = z.infer<typeof meListTasksQuerySchema>;
export type WorkspaceListTasksQuery = z.infer<
  typeof workspaceListTasksQuerySchema
>;
export type ListTagsQuery = z.infer<typeof listTagsQuerySchema>;
