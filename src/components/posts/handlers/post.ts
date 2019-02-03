import { Request, Response } from "express";
import { Post } from "../../../models/post";
import { User } from "../../../models/user";

export const post = (request: Request, response: Response) => {

    if (!request.body.title || !request.body.body) {
        response.status(400);
        response.send({ error: "Missing paramters" });
        return;
    }

    const newPost = new Post();
    newPost.title = String(request.body.title);
    newPost.body = String(request.body.body);

    User.findOne({ id: response.locals.user }).then((user) => {
        newPost.user = user;
        newPost.save()
            .then((result) => {
                response.status(201);
                response.send(result);
            })
            .catch((error) => {
                response.status(500);
                response.send({ error: "Server error" });
            });
    });
};
