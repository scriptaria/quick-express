import { Request, Response } from "express";
import { Task } from "src/models/task";
import { settings } from "src/settings";

export const post = async (request: Request, response: Response) => {

    if (!request.body.title) {
        response.status(400);
        response.send({ error: settings.defaultMessages.missingParamters });
        return;
    }

    const task = new Task();
    task.title = String(request.body.title);
    task.done = Boolean(request.body.done);
    task.user = response.locals.user;

    if (!await task.save().catch(() => null)) {
        response.status(500);
        response.send({ error: settings.defaultMessages.serverError });
        return;
    }

    delete (task.user);
    response.status(201);
    response.send(task);
};
