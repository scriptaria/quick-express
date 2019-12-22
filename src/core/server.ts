import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as Glob from "glob";
import * as middleware from "src/middleware";
import { Database } from "./database";
import { DefaultResponse, Module } from "./interfaces";

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

    public setModules(baseRoute: string): void {
        for (const module of this.getModules()) {

            const router: express.Router = express.Router();

            for (const endpoint in module.endpoints) {

                const methods = module.endpoints[endpoint];
                for (const method in methods) {

                    if (methods[method].middleware) {
                        for (const methodMiddleware of methods[method].middleware) {
                            router[method](endpoint, middleware[methodMiddleware]);
                        }
                    }

                    router[method](endpoint, methods[method].handler);
                }
            }

            this.app.use(`${baseRoute}${module.route}`, router);
        }
    }

    private getModules(): Module[] {
        const files = Glob.sync("../modules/**/index.{js,ts}", { cwd: __dirname });
        return files.map((file) => require(file).module).filter((module: Module) => module);
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
}
