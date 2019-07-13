import { Request, Response } from "express";
import { Subject } from "rxjs";

export interface EventList {
    [key: string]: Subject<any>;
}

export interface Route {
    delete?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
    get?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
    patch?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
    post?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
    put?: { handler: (request: Request, response: Response) => void, middlewares?: string[] };
}

export interface Component {
    [name: string]: Route;
}

export interface DefaultResponse {
    success: boolean;
    error?: string;
    result?: any;
}
