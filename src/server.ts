import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { Route } from "./interfaces/route";
import { middlewares } from "./middlewares";
import { routes } from "./routes";
import { settings } from "./settings";

class Server {
    private app = express();
    private port: number = settings.port;
    private routes = routes;

    constructor() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors());

        this.defineRoutes();

        this.start();
    }

    private defineRoutes(): void {

        // made the iteration for main routes
        for (const route in this.routes) {
            if (this.routes.hasOwnProperty(route)) {
                const childrenRoutes = this.routes[route];
                this.app.use(route, this.getChildrenRoutes(childrenRoutes.routes, route));
            }
        }
    }

    private getChildrenRoutes(childrenRoutes: { [name: string]: Route }, parent: string): express.Router {

        const router: express.Router = express.Router();

        // made the iteration for the sub routes
        for (const route in childrenRoutes) {
            if (childrenRoutes.hasOwnProperty(route)) {
                const methods = childrenRoutes[route];

                // made the iteration for every method that this sub route work for
                for (const method in methods) {
                    if (methods.hasOwnProperty(method)) {

                        // set the middlewares
                        if (methods[method].middlewares) {
                            methods[method].middlewares.forEach((middleware) => {
                                router[method](route, middlewares[middleware]);
                            });
                        }

                        const handler = methods[method].handler;
                        router[method](route, handler);
                    }
                }
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
