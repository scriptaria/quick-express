import { boolean } from "boolean";
import { Request, Response } from "express";
import { Task } from "src/models/task";
import { Validator } from "src/core/validator";

/**
 * @api {patch} /tasks/:id Modify a Task by Id
 * @apiName PatchTasksId
 * @apiGroup Tasks
 *
 * @apiParam {String} [title] A new title for the task.
 * @apiParam {Boolean} [done] A new status for the task.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 */
export const patchId = async (request: Request, response: Response) => {

  const validator = Validator.validate(request, {
    body: {
      title: {
        length: {
          minimum: 3,
          message: "seems to be too short",
        },
      },
    },
  });

  if (!validator.success) {
    response.status(400);
    response.send({ errors: validator.errors });
    return;
  }

  const task: Task = await Task.findOne({ where: { id: request.params.id }, relations: ["user"] }).catch(() => null);

  if (!task) {
    response.status(404);
    response.send({ error: "Not found." });
    return;
  }

  if (task.user.id !== response.locals.userId) {
    response.status(403);
    response.send({ error: "Not allowed." });
    return;
  }

  task.title = request.body.title ?? task.title;
  task.done = "done" in request.body ? boolean(request.body.done) : task.done;

  if (!await task.save().catch(() => null)) {
    response.status(500);
    response.send({ error: "Server error." });
    return;
  }

  response.status(200);
  response.send(task);
};
