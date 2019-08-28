import { Request, Response } from "express";
import { Task } from "../../../models/task";

export const patchId = async (request: Request, response: Response) => {

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

    task.title = request.body.title || task.title;
    task.done = "done" in request.body ? request.body.done : task.done;

    if (!await task.save().catch(() => null)) {
        response.status(500);
        response.send({ error: "Server error" });
        return;
    }

    response.status(200);
    response.send(task);
};
