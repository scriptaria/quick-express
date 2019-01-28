import { Request, Response } from "express";
import { Route } from "../interfaces/route";

const examples: Array<{ id: number, description: string }> = [
    {
        id: 1,
        description: "You did manage it!",
    },
    {
        id: 2,
        description: "u did it!",
    },
];

export const routes: { [name: string]: Route } = {

    "/": {

        get: {
            handler: (request: Request, response: Response) => {
                response.status(200);
                response.send(examples);
            },
        },

        post: {
            middlewares: ["auth"],
            handler: (request: Request, response: Response) => {

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

            },
        },

    },

    "/:id": {

        get: {
            handler: (request: Request, response: Response) => {

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
            },
        },

        patch: {
            middlewares: ["auth"],
            handler: (request: Request, response: Response) => {

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
            },
        },

        put: {
            middlewares: ["auth"],
            handler: (request: Request, response: Response) => {

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
            },
        },

        delete: {
            middlewares: ["auth"],
            handler: (request: Request, response: Response) => {

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
            },
        },

    },
};
