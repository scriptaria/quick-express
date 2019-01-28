import { NextFunction, Request, Response } from "express";
import { decodeToken } from "./components/auth";

export const middlewares = {
    auth: (request: Request, response: Response, next: NextFunction) => {

        if (!request.headers.authorization) {
            response.status(401);
            response.send({ error: "Missing authentication" });
            return;
        }

        const token = request.headers.authorization.replace("Bearer ", "");

        decodeToken(token).then((result) => {

            if (!result.success) {
                response.status(400);
                response.send({ error: result.error });
                return;
            }

            next();
        });
    },
};
