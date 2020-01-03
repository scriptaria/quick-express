import { Request, Response } from "express";
import { Subject } from "rxjs";
import { ConnectionOptions } from "typeorm";

export interface EventList {
  [key: string]: Subject<any>;
}

export interface Replacement {
  regex: RegExp;
  value: string;
}

export interface Route {
  delete?: { handler: (request: Request, response: Response) => void, middleware?: string[] };
  get?: { handler: (request: Request, response: Response) => void, middleware?: string[] };
  patch?: { handler: (request: Request, response: Response) => void, middleware?: string[] };
  post?: { handler: (request: Request, response: Response) => void, middleware?: string[] };
  put?: { handler: (request: Request, response: Response) => void, middleware?: string[] };
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
