import { Request, Response } from "express";
import { Task } from "../../../models/task";
import { User } from "../../../models/user";

export const patchId = (request: Request, response: Response) => {

    User.findOne({ id: response.locals.userId }).then((user) => {
        Task.findOne({ id: request.params.id, user })
            .then((task) => {

                task.title = request.body.title || task.title;
                task.done = request.body.done || task.done;

                task.save()
                    .then((editedTask) => {
                        response.status(200);
                        response.send(editedTask);
                    })
                    .catch(() => {
                        response.status(500);
                        response.send({ error: "Server error" });
                        return;
                    });

            })
            .catch(() => {
                response.status(404);
                response.send({ error: "Task not found!" });
                return;
            });
    });
};
