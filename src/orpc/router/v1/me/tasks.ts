import { listTasks } from "#/orpc/procedures/me";

const meTasksRouter = {
  list: listTasks,
};

export default meTasksRouter;
