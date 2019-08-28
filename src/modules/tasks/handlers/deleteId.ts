import { Request, Response } from "express";
import { Task } from "../../../models/task";
import { settings } from "../../../settings";

export const deleteId = async (request: Request, response: Response) => {

    const task: Task = await Task.findOne({ id: request.params.id }, { relations: ["user"] }).catch(() => null);

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

    if (! await task.remove().catch(() => null)) {
        response.status(500);
        response.send({ error: settings.defaultMessages.serverError });
        return;
    }

    response.status(204);
    response.send();
};
