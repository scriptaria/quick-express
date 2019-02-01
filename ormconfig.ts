import * as path from "path";
import { settings } from "./src/settings";

const { entities, migrations, ...databaseSettings } = settings.database;

const newEntities = [];
for (const entitie of entities) {
    newEntities.push(path.join(__dirname, "/src", entitie + "/*.ts"));
}

const newMigrations = [];
for (const migration of migrations) {
    newMigrations.push(path.join(__dirname, "/src", migration + "/*.ts"));
}

module.exports = {
    ...settings.database,
    entities: newEntities,
    migrations: newMigrations,
};
