import { Settings } from "interfaces/settings";

export const settings: Settings = {
    port: 3000,
    auth: {
        secret: "",
        expires: 30,
    },
    database: {
        type: "sqlite",
        database: "database.sqlite",
        entities: [
            "/models",
        ],
        migrations: [
            "/migrations",
        ],
    },
};
