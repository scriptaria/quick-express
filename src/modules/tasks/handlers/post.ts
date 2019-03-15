import { Request, Response } from "express";
import { Task } from "../../../models/task";
import { User } from "../../../models/user";

export const post = (request: Request, response: Response) => {

    if (!request.body.title) {
        response.status(400);
        response.send({ error: "Missing paramters" });
        return;
    }

    User.findOne({ id: response.locals.user }).then((user) => {

        const newTask = new Task();
        newTask.title = String(request.body.title);
        newTask.done = Boolean(request.body.done);
        newTask.user = user;

        newTask.save()
            .then((result) => {
                response.status(201);
                response.send(result);
            })
            .catch((error) => {
                console.log(error);
                response.status(500);
                response.send({ error: "Server error" });
            });
    });
};
