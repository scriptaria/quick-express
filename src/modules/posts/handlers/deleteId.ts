import { Request, Response } from "express";
import { Post } from "../../../models/post";
import { User } from "../../../models/user";

export const deleteId = (request: Request, response: Response) => {

    User.findOne({ id: response.locals.user }).then((user) => {
        Post.findOne({ id: request.params.id, user })
        .then((post) => {
            post.remove()
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
    });
};
