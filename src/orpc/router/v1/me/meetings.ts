import {
  deleteMeeting,
  getMeeting,
  listMeetings,
  searchMeetings,
} from "#/orpc/procedures/me";

const meMeetingsRouter = {
  list: listMeetings,
  get: getMeeting,
  delete: deleteMeeting,
  search: searchMeetings,
};

export default meMeetingsRouter;
