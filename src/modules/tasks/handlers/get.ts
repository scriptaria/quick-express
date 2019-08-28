import { Request, Response } from "express";
import { Task } from "../../../models/task";

export const get = async (request: Request, response: Response) => {

    const tasks = await Task.find({ user: response.locals.user }).catch(() => null);

    if (!tasks) {
        response.status(500);
        response.send({ error: "An error has occurred." });
        return;
    }

    response.status(200);
    response.send(tasks);
};
