import * as path from "path";
import "reflect-metadata";
import * as TypeORM from "typeorm";
import { ConnectionOptions } from "typeorm";
import { DefaultResponse } from "./interfaces";

export class Database {

  public connection: TypeORM.Connection;
  private orm: any;
  private settings: ConnectionOptions;

  constructor() {
    this.orm = TypeORM;
  }

  public setSettings(databaseOptions: ConnectionOptions): void {
    const { entities, migrations, ...databaseSettings } = databaseOptions;

    const newEntities = [];
    for (const entity of entities) {
      newEntities.push(path.join(__dirname, "../", entity + "/*.{js,ts}"));
    }

    const newMigrations = [];
    for (const migration of migrations) {
      newMigrations.push(path.join(__dirname, "../", migration + "/*.{js,ts}"));
    }

    this.settings = { ...databaseSettings, entities: newEntities, migrations: newMigrations };
  }

  public start(): Promise<DefaultResponse<void>> {
    return new Promise((resolve) => {

      this.orm.createConnection(this.settings)
        .then((connection) => {

          this.connection = connection;

          resolve({ success: true });
        })
        .catch((error) => {
          resolve({ success: false, error });
        });
    });
  }

  public stop(): Promise<DefaultResponse<void>> {
    return new Promise((resolve) => {
      if (this.connection) {
        this.connection.close().then(() => {
          resolve({ success: true });
        });
        return;
      }

      resolve({ success: false, error: "No open connection to close" });
    });
  }

}
