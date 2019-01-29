import { settings } from "./src/settings";

const { entities, migrations, ...databaseSettings } = settings.database;

const newEntities = [];
for (const entitie of entities) {
    newEntities.push(__dirname + "/src" + entitie + "/*.ts");
}

const newMigrations = [];
for (const migration of migrations) {
    newMigrations.push(__dirname + "/src" + migration + "/*.ts");
}

module.exports = {
    ...settings.database,
    entities: newEntities,
    migrations: newMigrations,
};
