import { Request, Response } from "express";
import { Post } from "../../../models/post";
import { User } from "../../../models/user";

export const getMePosts = (request: Request, response: Response) => {

    User.findOne({ id: response.locals.user })
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
