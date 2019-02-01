import * as path from "path";
import "reflect-metadata";
import * as TypeORM from "typeorm";
import { ConnectionOptions } from "typeorm";
import { DefaultResponse } from "../interfaces/defaultResponse";

export class Database {
    private orm;
    private settings: ConnectionOptions;

    constructor() {
        this.orm = TypeORM;
    }

    public setSettings(databaseOptions: ConnectionOptions): void {
        const { entities, migrations, ...databaseSettings } = databaseOptions;

        const newEntities = [];
        for (const entitie of entities) {
            newEntities.push(path.join(__dirname, "../", entitie + "/*.js"));
        }

        const newMigrations = [];
        for (const migration of migrations) {
            newMigrations.push(path.join(__dirname, "../", migration + "/*.js"));
        }

        this.settings = { ...databaseSettings, entities: newEntities, migrations: newMigrations };
    }

    public startConnection(): Promise<DefaultResponse> {
        return new Promise((resolve) => {

            this.orm.createConnection(this.settings)
                .then((connection) => {
                    resolve({ success: true });
                })
                .catch((error) => {
                    resolve({ success: false, error });
                });
        });
    }

}
