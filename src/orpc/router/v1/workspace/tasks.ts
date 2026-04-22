import { listTasks } from "#/orpc/procedures/workspace";

const workspaceTasksRouter = {
  list: listTasks,
};

export default workspaceTasksRouter;
