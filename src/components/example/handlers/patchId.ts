import { Request, Response } from "express";
import { examples } from "../model";

export const patchId = (request: Request, response: Response) => {

    const example = examples.find((result) => {
        return result.id === Number(request.params.id);
    });

    if (!example) {
        response.status(404);
        response.send({ error: "Example not found!" });
        return;
    }

    const updatedExample = example;

    if (request.body.description) {
        updatedExample.description = String(request.body.description);
    }

    examples[examples.indexOf(example)] = updatedExample;

    response.status(200);
    response.send(updatedExample);
};
