import { Request, Response } from "express";
import { Post } from "../../../models/post";
import { User } from "../../../models/user";

export const getIdPosts = (request: Request, response: Response) => {

    User.findOne({ id: request.params.id })
        .then((user) => {
            Post.find({ user })
                .then((posts) => {
                    response.status(200);
                    response.send(posts);
                })
                .catch(() => {
                    response.status(400);
                    response.send({ error: "Posts not found!" });
                    return;
                });
        })
        .catch(() => {
            response.status(404);
            response.send({ error: "User not found!" });
            return;
        });
};
