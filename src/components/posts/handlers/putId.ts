import { Request, Response } from "express";
import { Post } from "../../../models/post";

export const putId = (request: Request, response: Response) => {

    Post.findOne({ id: request.params.id })
        .then((result) => {

            result.title = null;
            result.body = null;

            if (request.body.title) {
                result.title = String(request.body.title);
            }
            if (request.body.body) {
                result.body = String(request.body.body);
            }

            result.save()
                .then((edited) => {
                    response.status(200);
                    response.send(edited);
                })
                .catch(() => {
                    response.status(500);
                    response.send({ error: "Server error" });
                    return;
                });

        })
        .catch(() => {
            response.status(404);
            response.send({ error: "Post not found!" });
            return;
        });
};
