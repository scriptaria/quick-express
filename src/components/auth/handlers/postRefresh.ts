import { Request, Response } from "express";
import { VerifyErrors } from "jsonwebtoken";
import * as Jwt from "jsonwebtoken";
import { settings } from "../../../settings";
import { generateTokens } from "../helper";
import { users } from "../model";

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

        const tokens = generateTokens(decoded.user.id, settings.auth.secret, settings.auth.expires);
        const user = users.find((result) => {
            return result.id === decoded.user;
        });

        if (!user) {
            response.status(400);
            response.send({ error: "User not found." });
            return;
        }

        const { password, ...userWithoutPassword } = user;

        response.status(200);
        response.send({ ...userWithoutPassword, ...tokens });
    });
};
