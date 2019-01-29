import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../../../models/user";
import { settings } from "../../../settings";
import { generateTokens } from "../helper";

export const postLogin = (request: Request, response: Response) => {

    if (!request.body.email || !request.body.password) {
        response.status(400);
        response.send({ error: "Missing paramters." });
        return;
    }

    User.findOne({ email: request.body.email })
        .then((user) => {

            bcrypt.compare(request.body.password, user.password).then((result) => {

                if (!result) {
                    response.status(400);
                    response.send({ error: "Wrong password." });
                    return;
                }

                const { password, ...userWithoutPassword } = user;
                const tokens = generateTokens(userWithoutPassword.id, settings.auth.secret, settings.auth.expires);

                response.status(200);
                response.send({ ...userWithoutPassword, ...tokens });
            });

        })
        .catch(() => {
            response.status(400);
            response.send({ error: "User not found." });
        });
};
