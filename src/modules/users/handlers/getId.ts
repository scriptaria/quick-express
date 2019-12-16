import { Request, Response } from "express";
import { User } from "src/models/user";
import { settings } from "src/settings";

export const getId = async (request: Request, response: Response) => {

    const userId = request.params.id === "me" ? response.locals.userId : request.params.id;

    const user: User = await User.findOne({ id: userId }).catch(() => null);

    if (!user) {
        response.status(404);
        response.send({ error: settings.defaultMessages.notFound });
        return;
    }

    response.status(200);
    response.send(user);
};
