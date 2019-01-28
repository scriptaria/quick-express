import { Request, Response } from "express";

export interface Route {
    delete?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
    get?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
    patch?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
    post?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
    put?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
}
