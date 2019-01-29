import { Request, Response } from "express";
import { examples } from "../model";

export const get = (request: Request, response: Response) => {
    response.status(200);
    response.send(examples);
};
