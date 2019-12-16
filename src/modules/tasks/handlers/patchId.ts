import { Request, Response } from "express";
import { Task } from "src/models/task";
import { settings } from "src/settings";

export const patchId = async (request: Request, response: Response) => {

    const task: Task = await Task.findOne({ where: { id: request.params.id }, relations: ["user"] }).catch(() => null);

    if (!task) {
        response.status(404);
        response.send({ error: settings.defaultMessages.notFound });
        return;
    }

    if (task.user.id !== response.locals.userId) {
        response.status(403);
        response.send({ error: settings.defaultMessages.notAllowed });
        return;
    }

    task.title = request.body.title || task.title;
    task.done = "done" in request.body ? request.body.done : task.done;

    if (!await task.save().catch(() => null)) {
        response.status(500);
        response.send({ error: settings.defaultMessages.serverError });
        return;
    }

    response.status(200);
    response.send(task);
};
