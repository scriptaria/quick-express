import { Request, Response } from "express";
import { Post } from "../../../models/post";
import { User } from "../../../models/user";

export const putId = (request: Request, response: Response) => {

    User.findOne({ id: response.locals.user }).then((user) => {
        Post.findOne({ id: request.params.id, user })
            .then((post) => {

                post.title = request.body.title || null;
                post.body = request.body.body || null;

                post.save()
                    .then((editedPost) => {
                        response.status(200);
                        response.send(editedPost);
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
    });
};
