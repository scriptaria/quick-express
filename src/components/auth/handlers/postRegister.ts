import { Request, Response } from "express";
import { users } from "../model";

export const postRegister = (request: Request, response: Response) => {

    if (!request.body.email || !request.body.password || !request.body.name) {
        response.status(400);
        response.send({ error: "Missing paramters." });
        return;
    }

    users.push({
        id: users[users.length - 1].id + 1,
        email: request.body.email,
        password: request.body.password,
        name: request.body.name,
    });

    response.status(201);
    response.send();
};
