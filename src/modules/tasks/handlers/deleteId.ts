import { Request, Response } from "express";
import { Task } from "src/models/task";

/**
 * @api {delete} /tasks/:id Delete a Task by Id
 * @apiName DeleteTasksId
 * @apiGroup Tasks
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 No Content
 */
export const deleteId = async (request: Request, response: Response) => {

  const task: Task = await Task.findOne({ where: { id: request.params.id }, relations: ["user"] }).catch(() => null);

  if (!task) {
    response.status(404);
    response.send({ error: "Task not Found." });
    return;
  }

  if (task.user.id !== response.locals.userId) {
    response.status(403);
    response.send({ error: "Not allowed." });
    return;
  }

  if (! await task.remove().catch(() => null)) {
    response.status(500);
    response.send({ error: "Server error." });
    return;
  }

  response.status(204);
  response.send();
};
