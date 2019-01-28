import { Request, Response } from "express";
import { Secret, VerifyErrors } from "jsonwebtoken";
import * as Jwt from "jsonwebtoken";
import { Route } from "../interfaces/route";
import { settings } from "../settings";

const users = [
    { id: 1, email: "test@example.com", password: "test", name: "Test User" },
];

const generateTokens = (userId): { token: Secret, refreshToken: Secret } => {

    const token = Jwt.sign(
        {
            type: "token",
            user: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 30), // 30 minutes expiration
        },
        settings.auth.secret);

    const refreshToken = Jwt.sign(
        {
            type: "refresh",
            user: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * settings.auth.expires),
        },
        settings.auth.secret);

    return { token, refreshToken };
};

export const decodeToken = (token: string): Promise<{ success: boolean, error?: string, decoded?: any }> => {
    return new Promise((resolve) => {
        Jwt.verify(token, settings.auth.secret, (error: VerifyErrors, decoded: any) => {

            if (error) {
                resolve({ success: false, error: error.message });
            }

            if (decoded.type !== "token") {
                resolve({ success: false, error: "Invalid token" });
            }

            resolve({ success: true, decoded });

        });
    });
};

export const routes: { [name: string]: Route } = {

    "/check/:token": {
        get: {
            handler: (request: Request, response: Response) => {
                decodeToken(request.params.token).then((result) => {

                    if (!result.success) {
                        response.status(400);
                        response.send({ error: result.error });
                        return;
                    }

                    response.status(200);
                    response.send(result.decoded);

                });
            },
        },
    },

    "/refresh": {
        post: {
            handler: (request: Request, response: Response) => {

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

                    const tokens = generateTokens(decoded.user.id);
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
            },
        },
    },

    "/register": {
        post: {
            handler: (request: Request, response: Response) => {

                if (!request.body.email || !request.body.password || !request.body.name) {
                    response.status(400);
                    response.send({ error: "Missing paramters." });
                    return;
                }

                users.push({
                    id: users[users.length - 1].id + 1,
                    email: request.body.email,
                    password: request.body.password,
                    name: request.body.name,
                });

                response.status(201);
                response.send();
            },
        },
    },

    "/login": {
        post: {
            handler: (request: Request, response: Response) => {

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
                const tokens = generateTokens(userWithoutPassword.id);

                response.status(200);
                response.send({ ...userWithoutPassword, ...tokens });

            },
        },
    },
};
