import { Request, Response } from "express";
import { settings } from "../../../settings";
import { decodeToken } from "../helper";

export const getCheckToken = (request: Request, response: Response) => {
    decodeToken(request.params.token, settings.auth.secret).then((result) => {

        if (!result.success) {
            response.status(400);
            response.send({ error: result.error });
            return;
        }

        response.status(200);
        response.send({ user: result.result.user });

    });
};
