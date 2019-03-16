import { Request, Response } from "express";
import { User } from "../../../models/user";
import { settings } from "../../../settings";
import { decodeToken } from "../helper";

export const getCheckAccess = (request: Request, response: Response) => {
    decodeToken(request.params.access, settings.auth.secret).then((result) => {

        if (!result.success) {
            response.status(400);
            response.send({ error: result.error });
            return;
        }

        if (result.result.type !== "access") {
            response.status(400);
            response.send({ error: "Not a valid access token" });
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
