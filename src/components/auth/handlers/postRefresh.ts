import { Request, Response } from "express";
import { VerifyErrors } from "jsonwebtoken";
import * as Jwt from "jsonwebtoken";
import { User } from "../../../models/user";
import { settings } from "../../../settings";
import { generateTokens } from "../helper";

export const postRefresh = (request: Request, response: Response) => {

    if (!request.body.refresh) {
        response.status(400);
        response.send({ error: "Missing paramters." });
        return;
    }

    Jwt.verify(request.body.refresh, settings.auth.secret, (error: VerifyErrors, decoded: any) => {

        if (error) {
            response.status(400);
            response.send({ error: error.message });
            return;
        }

        if (decoded.type !== "refresh") {
            response.status(400);
            response.send({ error: "Invalid token" });
            return;
        }

        User.findOne({ id: decoded.user })
            .then((result) => {
                const { password, ...userWithoutPassword } = result;
                const tokens = generateTokens(userWithoutPassword.id, settings.auth.secret, settings.auth.expires);

                response.status(200);
                response.send({ ...userWithoutPassword, ...tokens });
            })
            .catch(() => {
                response.status(400);
                response.send({ error: "User not found." });
            });

    });
};
