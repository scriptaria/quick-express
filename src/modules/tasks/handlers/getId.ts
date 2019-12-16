import { Request, Response } from "express";
import { Task } from "src/models/task";
import { settings } from "src/settings";

export const getId = async (request: Request, response: Response) => {

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

    delete (task.user);
    response.status(200);
    response.send(task);
};
