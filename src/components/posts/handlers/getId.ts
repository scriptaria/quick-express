import { Request, Response } from "express";
import { Post } from "../../../models/post";

export const getId = (request: Request, response: Response) => {

    Post.findOne({ id: request.params.id })
        .then((post) => {
            response.status(200);
            response.send(post);
        })
        .catch(() => {
            response.status(404);
            response.send({ error: "Post not found!" });
            return;
        });
};
