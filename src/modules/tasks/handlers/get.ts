import { Request, Response } from "express";
import { Task } from "src/models/task";
import { Validator } from "src/core/validator";

/**
 * @api {get} /tasks Get Tasks
 * @apiName GetTasks
 * @apiGroup Tasks
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
export const get = async (request: Request, response: Response) => {

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

  const tasks = await Task.find({ where: { user: response.locals.user }, take: limit }).catch(() => null);

  if (!tasks) {
    response.status(500);
    response.send({ error: "Server error." });
    return;
  }

  response.status(200);
  response.send(tasks);
};
