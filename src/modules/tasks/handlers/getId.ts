import { Request, Response } from "express";
import { Task } from "../../../models/task";

export const getId = async (request: Request, response: Response) => {

    const task: Task = await Task.findOne({ id: request.params.id }, { relations: ["user"] }).catch(() => null);

    if (!task) {
        response.status(404);
        response.send({ error: "Task not found!" });
        return;
    }

    if (task.user.id !== response.locals.userId) {
        response.status(403);
        response.send({ error: "Not allowed." });
        return;
    }

    delete (task.user);
    response.status(200);
    response.send(task);
};
