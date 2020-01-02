import { boolean } from "boolean";
import { Request, Response } from "express";
import { Task } from "src/models/task";
import { Validator } from "src/core/validator";

/**
 * @api {post} /tasks Create a Task
 * @apiName PostTasks
 * @apiGroup Tasks
 *
 * @apiParam {String} title         The title for the task.
 * @apiParam {Boolean} [done=false] The status for the task.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 */
export const post = async (request: Request, response: Response) => {

  const validator = Validator.validate(request, {
    body: {
      title: {
        presence: {
          message: "is required to proceed",
        },
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

  const task = new Task();
  task.title = String(request.body.title);
  task.done = boolean(request.body.done);
  task.user = response.locals.user;

  if (!await task.save().catch(() => null)) {
    response.status(500);
    response.send({ error: "Server error." });
    return;
  }

  delete (task.user);
  response.status(201);
  response.send(task);
};
