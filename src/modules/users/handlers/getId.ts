import { Request, Response } from "express";
import { User } from "../../../models/user";

export const getId = async (request: Request, response: Response) => {

    const userId = request.params.id === "me" ? response.locals.userId : request.params.id;

    const user: User = await User.findOne({ id: userId }).catch(() => null);

    if (!user) {
        response.status(404);
        response.send({ error: "User not found!" });
        return;
    }

    response.status(200);
    response.send(user);
};
