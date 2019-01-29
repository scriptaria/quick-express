import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { Component } from "interfaces/component";
import "reflect-metadata";
import * as TypeORM from "typeorm";
import * as middlewares from "./middlewares";
import { routes } from "./routes";
import { settings } from "./settings";

class Server {
    public app = express();
    private port: number = settings.port;
    private routes = routes;
    private orm = TypeORM;

    constructor() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors());

        this.defineRoutes();

        if (!settings.database) {
            this.start();
            return;
        }

        this.setConnection().finally(() => {
            this.start();
        });
    }

    private setConnection(): Promise<any> {
        return new Promise((resolve) => {
            const { entities, migrations, ...databaseSettings } = settings.database;

            const newEntities = [];
            for (const entitie of entities) {
                newEntities.push(__dirname + entitie + "/*.js");
            }

            const newMigrations = [];
            for (const migration of migrations) {
                newMigrations.push(__dirname + migration + "/*.js");
            }

            this.orm.createConnection({
                ...databaseSettings,
                entities: newEntities,
                migrations: newMigrations,
            })
                .then((connection) => {
                    resolve(true);
                })
                .catch((error) => {
                    console.log(error);
                    resolve(false);
                });
        });
    }

    private defineRoutes(): void {

        // made the iteration for main routes
        for (const route of this.routes) {
            this.app.use(route.path, this.getComponentRoutes(route.component.routes, route.path));
        }
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

    private start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port: ${this.port}.`);
        });
    }

}

const server = new Server();
