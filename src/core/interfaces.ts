import { NextFunction, Request, Response } from "express";
import { Subject } from "rxjs";
import { ConnectionOptions } from "typeorm";

export interface EventList {
  [key: string]: Subject<any>;
}

export interface Replacement {
  regex: RegExp;
  value: string;
}

export type Middleware = (request: Request, response: Response, next: NextFunction) => void;
export type Handler = (request: Request, response: Response) => void;

export interface Route {
  delete?: {
    handler: Handler,
    middleware?: Middleware[],
  };
  get?: {
    handler: Handler,
    middleware?: Middleware[],
  };
  patch?: {
    handler: Handler,
    middleware?: Middleware[],
  };
  post?: {
    handler: Handler,
    middleware?: Middleware[],
  };
  put?: {
    handler: Handler,
    middleware?: Middleware[],
  };
}

export interface Module {
  route: string;
  endpoints: {
    [name: string]: Route;
  };
}

export interface DefaultResponse<T> {
  success: boolean;
  error?: string;
  errors?: any;
  data?: T;
}

export interface BaseSettings {
  port: number;
  baseRoute?: string;
  staticFolder?: string;
  serveDoc?: boolean;
  domain?: string;
  ssl?: boolean;
  database?: ConnectionOptions;
}
