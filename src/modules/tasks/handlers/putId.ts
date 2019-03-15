import { Request, Response } from "express";
import { Task } from "../../../models/task";
import { User } from "../../../models/user";

export const putId = (request: Request, response: Response) => {

    User.findOne({ id: response.locals.user }).then((user) => {
        Task.findOne({ id: request.params.id, user })
            .then((task) => {

                task.title = request.body.title || null;
                task.done = Boolean(request.body.done) || null;

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
