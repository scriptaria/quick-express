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

    Jwt.verify(request.body.refresh, settings.auth.secret, async (error: VerifyErrors, decoded: any) => {

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

        const user: User = await User.findOne({ id: decoded.user }).catch(() => null);

        if (!user) {
            response.status(400);
            response.send({ error: "User not found." });
            return;
        }

        const tokens = generateTokens(user.id, settings.auth.secret, settings.auth.expires);
        response.status(200);
        response.send(tokens);
    });
};
