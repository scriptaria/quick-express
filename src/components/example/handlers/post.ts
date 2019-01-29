import { Request, Response } from "express";
import { examples } from "../model";

export const post = (request: Request, response: Response) => {

    if (!request.body.description) {
        response.status(400);
        response.send({ error: "You need to provide a description for the new example" });
        return;
    }

    examples.push({
        id: examples[examples.length - 1].id + 1,
        description: request.body.description,
    });

    response.status(201);
    response.send(examples[examples.length - 1]);

};
