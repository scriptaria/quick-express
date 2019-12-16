import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "src/models/user";
import { settings } from "src/settings";

export const post = async (request: Request, response: Response) => {

    if (!request.body.email || !request.body.password || !request.body.name) {
        response.status(400);
        response.send({ error: settings.defaultMessages.missingParamters });
        return;
    }

    const user = new User();
    user.name = request.body.name;
    user.password = await bcrypt.hash(request.body.password, 10).catch(() => null);
    user.email = request.body.email;

    if (!await user.save().catch(() => null)) {
        response.status(400);
        response.send({ error: settings.defaultMessages.failedToSave });
        return;
    }

    response.status(201);
    response.send();
};
