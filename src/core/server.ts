import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as middlewares from "src/middlewares";
import { Database } from "./database";
import { Component, DefaultResponse } from "./interfaces";

export class Server {

    public app;
    private listen: any;

    private requests: number = 0;
    private instance = ("_" + Math.random().toString(36).substr(2, 9)).toLocaleUpperCase();
    private database: Database;

    constructor(database: Database = null) {
        this.database = database;
        this.app = express();
        this.config();
    }

    public start(port: number): Promise<DefaultResponse> {
        return new Promise((resolve) => {
            if (this.listen) {
                resolve({ success: false, error: "Server already running" });
                return;
            }

            this.listen = this.app.listen(port, () => {
                resolve({ success: true });
            });
        });
    }

    public stop(): Promise<DefaultResponse> {
        return new Promise((resolve) => {
            if (!this.listen) {
                resolve({ success: false, error: "Server not running" });
                return;
            }

            this.listen.close();
            delete this.listen;
            resolve({ success: true });
        });
    }

    public setComponent(path: string, component: { routes: Component }) {
        this.app.use(path, this.getComponentRoutes(component.routes, path));
    }

    private config(): void {

        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors());

        this.app.use((request: Request, response: Response, next: NextFunction) => {
            response.setHeader("Instance", this.instance);
            this.requests++;
            next();
        });

        this.app.get("/status", (request: Request, response: Response) => {

            const data = {
                database: this.database.connection ? this.database.connection.isConnected : "none",
                instance: this.instance,
                requests: this.requests,
            };

            response.status(200);
            response.send(data);
        });

    }

    private getComponentRoutes(component: Component, parent: string): express.Router {

        const router: express.Router = express.Router();

        // made the iteration for the sub routes
        for (const route in component) {

            const methods = component[route];

            // made the iteration for every method that this sub route work for
            for (const method in methods) {

                // set the middlewares if has any
                if (methods[method].middlewares) {
                    for (const middleware of methods[method].middlewares) {
                        router[method](route, middlewares[middleware]);
                    }
                }

                // finaly set the final handler of the route
                router[method](route, methods[method].handler);
            }
        }

        return router;

    }
}
