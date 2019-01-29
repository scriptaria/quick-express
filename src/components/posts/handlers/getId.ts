import { Request, Response } from "express";
import { Post } from "../../../models/post";

export const getId = (request: Request, response: Response) => {

    Post.findOne({ id: request.params.id })
        .then((result) => {
            response.status(200);
            response.send(result);
        })
        .catch(() => {
            response.status(404);
            response.send({ error: "Post not found!" });
            return;
        });
};
