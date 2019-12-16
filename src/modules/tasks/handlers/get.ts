import { Request, Response } from "express";
import { Task } from "src/models/task";
import { settings } from "src/settings";

/**
 * @api {get} /tasks Get Tasks
 * @apiName GetTasks
 * @apiGroup Tasks
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *          {
 *              "id": 1,
 *              "title": "task title",
 *              "done": true
 *          }
 *      ]
 */
export const get = async (request: Request, response: Response) => {

    const tasks = await Task.find({ user: response.locals.user }).catch(() => null);

    if (!tasks) {
        response.status(500);
        response.send({ error: settings.defaultMessages.serverError });
        return;
    }

    response.status(200);
    response.send(tasks);
};
