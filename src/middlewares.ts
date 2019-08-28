import { NextFunction, Request, Response } from "express";
import { decodeToken } from "./modules/users/helper";
import { settings } from "./settings";

export const auth = (request: Request, response: Response, next: NextFunction) => {

    if (!request.headers.authorization) {
        response.status(401);
        response.send({ error: "Missing authentication" });
        return;
    }

    const token = request.headers.authorization.replace("Bearer ", "");

    decodeToken(token, settings.auth.secret).then((result) => {

        if (!result.success) {
            response.status(401);
            response.send({ error: "Failed to decode token." });
            return;
        }

        if (result.result.type !== "access") {
            response.status(401);
            response.send({ error: "Not a valid access token" });
            return;
        }

        response.locals.userId = result.result.user;

        next();
    });
};
