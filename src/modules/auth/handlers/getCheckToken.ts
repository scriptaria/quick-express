import { Request, Response } from "express";
import { User } from "../../../models/user";
import { settings } from "../../../settings";
import { decodeToken } from "../helper";

export const getCheckToken = (request: Request, response: Response) => {
    decodeToken(request.params.token, settings.auth.secret).then((result) => {

        if (!result.success) {
            response.status(400);
            response.send({ error: result.error });
            return;
        }

        if (result.result.type !== "token") {
            response.status(400);
            response.send({ error: "Not a valid Token" });
            return;
        }

        User.findOne({ id: result.result.user })
            .then((user) => {
                response.status(200);
                response.send(user);
            })
            .catch(() => {
                response.status(404);
                response.send({ error: "User not found" });
            });
    });
};
