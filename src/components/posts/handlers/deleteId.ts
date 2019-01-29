import { Request, Response } from "express";
import { Post } from "../../../models/post";

export const deleteId = (request: Request, response: Response) => {

    Post.findOne({ id: request.params.id })
        .then((result) => {
            result.remove()
                .finally(() => {
                    response.status(204);
                    response.send();
                });
        })
        .catch(() => {
            response.status(404);
            response.send({ error: "Post not found!" });
            return;
        });
};
