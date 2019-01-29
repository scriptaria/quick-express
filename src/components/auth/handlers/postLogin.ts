import { Request, Response } from "express";
import { settings } from "../../../settings";
import { generateTokens } from "../helper";
import { users } from "../model";

export const postLogin = (request: Request, response: Response) => {

    if (!request.body.email || !request.body.password) {
        response.status(400);
        response.send({ error: "Missing paramters." });
        return;
    }

    const user = users.find((result) => {
        return result.email === request.body.email && result.password === request.body.password;
    });

    if (!user) {
        response.status(400);
        response.send({ error: "User not found or password do not match." });
        return;
    }

    const { password, ...userWithoutPassword } = user;
    const tokens = generateTokens(userWithoutPassword.id, settings.auth.secret, settings.auth.expires);

    response.status(200);
    response.send({ ...userWithoutPassword, ...tokens });

};
