import { Request, Response } from "express";
import { validateRequest } from "src/core/validator";
import { Task } from "src/models/task";

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

  const validations = validateRequest(request, {
    query: {
      limit: {
        numericality: {
          message: "must be a number",
        },
      },
    },
  });

  if (!validations.success) {
    response.status(400);
    response.send({ errors: validations.errors });
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
