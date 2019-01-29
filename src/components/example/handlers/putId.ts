import { Request, Response } from "express";
import { examples } from "../model";

export const putId = (request: Request, response: Response) => {

    const example = examples.find((result) => {
        return result.id === Number(request.params.id);
    });

    if (!example) {
        response.status(404);
        response.send({ error: "Example not found!" });
        return;
    }

    const updatedExample = request.body;
    updatedExample.id = Number(request.params.id);
    examples[examples.indexOf(example)] = updatedExample;

    response.status(200);
    response.send(updatedExample);
};
