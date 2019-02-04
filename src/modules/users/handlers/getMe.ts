import { Request, Response } from "express";
import { User } from "../../../models/user";

export const getMe = (request: Request, response: Response) => {

    User.findOne({ id: response.locals.user })
        .then((result) => {
            response.status(200);
            response.send(result);
        })
        .catch(() => {
            response.status(404);
            response.send({ error: "User not found!" });
            return;
        });
};
