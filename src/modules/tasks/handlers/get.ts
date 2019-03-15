import { Request, Response } from "express";
import { Task } from "../../../models/task";

export const get = (request: Request, response: Response) => {
    Task.find().then((tasks) => {
        response.status(200);
        response.send(tasks);
    });
};
