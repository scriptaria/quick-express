import { Request, Response } from "express";
import { Validator } from "src/core/validator";
import { Task } from "src/models/task";
import { User } from "src/models/user";
import { validators } from "src/validators";

/**
 * @api {get} /users/:id/tasks Get Tasks from a User
 * @apiName GetUsersIdTasks
 * @apiGroup Users
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *    [
 *      {
 *        "id": 1,
 *        "title": "task title",
 *        "done": true
 *      }
 *    ]
 */
export const getIdTasks = async (request: Request, response: Response) => {

  const validator = Validator.validate(request, {
    query: {
      limit: {
        numericality: {
          message: "must be a number",
        },
      },
    },
  });

  if (!validator.success) {
    response.status(400);
    response.send({ errors: validator.errors });
    return;
  }

  const limit = request.query.limit ?? 10;
  const userId = request.params.id === "me" ? response.locals.userId : request.params.id;

  const user: User = await User.findOne({ id: userId }).catch(() => null);

  if (!user) {
    response.status(404);
    response.send({ error: "User not found." });
    return;
  }

  const tasks: Task = await Task.find({ where: { user }, take: limit }).catch(() => null);

  if (!tasks) {
    response.status(500);
    response.send({ error: "Server error." });
    return;
  }

  response.status(200);
  response.send(tasks);
};
