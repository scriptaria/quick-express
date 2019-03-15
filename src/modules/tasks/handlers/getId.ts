import { Request, Response } from "express";
import { Task } from "../../../models/task";

export const getId = (request: Request, response: Response) => {

    Task.findOne({ id: request.params.id })
        .then((task) => {
            response.status(200);
            response.send(task);
        })
        .catch(() => {
            response.status(404);
            response.send({ error: "Task not found!" });
            return;
        });
};
