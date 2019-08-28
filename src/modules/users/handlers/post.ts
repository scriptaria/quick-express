import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../../../models/user";

export const post = async (request: Request, response: Response) => {

    if (!request.body.email || !request.body.password || !request.body.name) {
        response.status(400);
        response.send({ error: "Missing paramters." });
        return;
    }

    const user = new User();
    user.name = request.body.name;
    user.password = await bcrypt.hash(request.body.password, 10).catch(() => null);
    user.email = request.body.email;

    if (!await user.save().catch(() => null)) {
        response.status(400);
        response.send({ error: "Failed to save user." });
        return;
    }

    response.status(201);
    response.send();
};
