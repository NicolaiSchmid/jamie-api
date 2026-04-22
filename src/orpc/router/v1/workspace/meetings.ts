import {
  deleteMeeting,
  getMeeting,
  listMeetings,
} from "#/orpc/procedures/workspace";

const workspaceMeetingsRouter = {
  list: listMeetings,
  get: getMeeting,
  delete: deleteMeeting,
};

export default workspaceMeetingsRouter;
