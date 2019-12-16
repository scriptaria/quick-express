import { Request, Response } from "express";
import { Task } from "src/models/task";
import { User } from "src/models/user";
import { settings } from "src/settings";

/**
 * @api {get} /users/:id/tasks Get Tasks from a User
 * @apiName GetUsersIdTasks
 * @apiGroup Users
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
export const getIdTasks = async (request: Request, response: Response) => {

    const userId = request.params.id === "me" ? response.locals.userId : request.params.id;

    const user: User = await User.findOne({ id: userId }).catch(() => null);

    if (!user) {
        response.status(404);
        response.send({ error: settings.defaultMessages.notFound });
        return;
    }

    const tasks: Task = await Task.find({ user }).catch(() => null);

    if (!tasks) {
        response.status(404);
        response.send({ error: settings.defaultMessages.notFound });
        return;
    }

    response.status(200);
    response.send(tasks);
};
