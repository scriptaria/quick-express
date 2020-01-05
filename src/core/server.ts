import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { Express, NextFunction, Request, Response } from "express";
import * as Glob from "glob";
import { Server as HttpServer } from "http";
import { Settings } from "src/interfaces/settings";
import { Database } from "./database";
import { DefaultResponse, Module } from "./interfaces";

export class Server {

  public readonly app: Express;
  public readonly baseRoute: string;
  private listen: HttpServer;
  private requests: number;
  private instance: string;
  private database: Database;

  constructor(settings: Settings, database?: Database) {

    this.app = express();
    this.baseRoute = this.treatBaseRoute(settings.baseRoute);
    this.requests = 0;
    this.instance = this.generateInstanceName();
    this.database = database;

    this.addDefaultMiddleware();
    this.addStatusEndpoint();

    if (settings.staticFolder) {
      this.setStaticFolder(settings.staticFolder);
    }

    if (settings.serveDoc) {
      this.addDocEndpoint();
    }

  }

  public start(port: number): Promise<DefaultResponse<void>> {
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

  public stop(): Promise<DefaultResponse<void>> {
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

  public loadModules(): void {

    for (const module of this.getModules()) {

      const router = express.Router();

      for (const endpoint in module.endpoints) {

        const methods = module.endpoints[endpoint];
        for (const method in methods) {

          if (methods[method].middleware) {
            for (const middleware of methods[method].middleware) {
              router[method](endpoint, middleware);
            }
          }

          router[method](endpoint, methods[method].handler);
        }
      }

      this.app.use(`${this.baseRoute}${module.route}`, router);
    }
  }

  private generateInstanceName(): string {
    const name = "_" + Math.random().toString(36).substr(2, 9);
    return name.toLocaleUpperCase();
  }

  private treatBaseRoute(route: string): string {
    if (route === "/" || !route) {
      return "";
    }

    if (route.length > 1 && route[0] !== "/") {
      return `/${route}`;
    }

    return route;
  }

  private getModules(): Module[] {
    const files = Glob.sync("../modules/**/index.{js,ts}", { cwd: __dirname });
    return files.map((file) => require(file).module).filter((module: Module) => module);
  }

  private addStatusEndpoint(): void {
    const route = `${this.baseRoute}/status`;
    this.app.get(route, (request: Request, response: Response) => {

      const data = {
        database: this.database?.connection?.isConnected,
        instance: this.instance,
        requests: this.requests,
      };

      response.status(200);
      response.send(data);
    });
  }

  private setStaticFolder(folder: string): void {
    folder = folder[0] === "/" ? folder.substr(1) : folder;
    this.app.use(this.baseRoute, express.static(folder));
  }

  private addDocEndpoint(): void {
    const route = `${this.baseRoute}/doc`;
    this.app.use(route, express.static("doc"));
  }

  private addDefaultMiddleware(): void {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      response.setHeader("Instance", this.instance);
      this.requests++;
      next();
    });
  }
}
