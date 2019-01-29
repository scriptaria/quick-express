import { Request, Response } from "express";
import { examples } from "../model";

export const deleteId = (request: Request, response: Response) => {

    const example = examples.find((result) => {
        return result.id === Number(request.params.id);
    });

    if (!example) {
        response.status(404);
        response.send({ error: "Example not found!" });
        return;
    }

    examples.splice(examples.indexOf(example), 1);

    response.status(204);
    response.send();
};
