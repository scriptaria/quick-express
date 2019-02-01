import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { Component } from "../interfaces/component";
import { DefaultResponse } from "../interfaces/defaultResponse";
import * as middlewares from "../middlewares";

export class Server {
    public app;

    constructor() {
        this.app = express();
        this.config();
    }

    public start(port: number): Promise<DefaultResponse> {
        return new Promise((resolve) => {
            this.app.listen(port, () => {
                resolve({ success: true });
            });
        });
    }

    public setComponent(path: string, component: { routes: Component }) {
        this.app.use(path, this.getComponentRoutes(component.routes, path));
    }

    private config(): void {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
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
