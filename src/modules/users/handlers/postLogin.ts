import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../../../models/user";
import { settings } from "../../../settings";
import { generateTokens } from "../helper";

export const postLogin = async (request: Request, response: Response) => {

    if (!request.body.email || !request.body.password) {
        response.status(400);
        response.send({ error: "Missing paramters." });
        return;
    }

    const user: User = await User.findOne({ email: request.body.email }, { select: ["id", "password"] }).catch(() => null);

    if (!user) {
        response.status(400);
        response.send({ error: "User not found." });
    }

    const isTheCorrectPassword = await bcrypt.compare(request.body.password, user.password).catch(() => false);

    if (!isTheCorrectPassword) {
        response.status(400);
        response.send({ error: "Wrong password." });
        return;
    }

    const tokens = generateTokens(user.id, settings.auth.secret, settings.auth.expires);

    response.status(200);
    response.send(tokens);
};
