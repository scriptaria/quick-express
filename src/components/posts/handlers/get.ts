import { Request, Response } from "express";
import { Post } from "../../../models/post";

export const get = (request: Request, response: Response) => {
    Post.find().then((results) => {
        response.status(200);
        response.send(results);
    });
};
