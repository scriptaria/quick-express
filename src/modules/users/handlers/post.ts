import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../../../models/user";

export const post = (request: Request, response: Response) => {

    if (!request.body.email || !request.body.password || !request.body.name) {
        response.status(400);
        response.send({ error: "Missing paramters." });
        return;
    }

    bcrypt.hash(request.body.password, 10).then((encrypted) => {

        const user = new User();
        user.name = request.body.name;
        user.password = encrypted;
        user.email = request.body.email;

        user.save()
            .then(() => {
                response.status(201);
                response.send();
            })
            .catch((error) => {
                response.status(401);
                response.send({ error });
            });
    });
};
