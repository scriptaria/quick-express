import { Request, Response } from "express";
import { Task } from "../../../models/task";
import { User } from "../../../models/user";

export const deleteId = (request: Request, response: Response) => {

    User.findOne({ id: response.locals.userId }).then((user) => {
        Task.findOne({ id: request.params.id, user })
        .then((task) => {
            task.remove()
                .finally(() => {
                    response.status(204);
                    response.send();
                });
        })
        .catch(() => {
            response.status(404);
            response.send({ error: "Task not found!" });
            return;
        });
    });
};
