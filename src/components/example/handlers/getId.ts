import { Request, Response } from "express";
import { examples } from "../model";

export const getId = (request: Request, response: Response) => {

    const example = examples.find((result) => {
        return result.id === Number(request.params.id);
    });

    if (!example) {
        response.status(404);
        response.send({ error: "Example not found!" });
        return;
    }

    response.status(200);
    response.send(example);
};
