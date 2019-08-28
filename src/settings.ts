import { Settings } from "interfaces/settings";

export const settings: Settings = {
    port: 3000,
    baseRoute: "/v1",
    auth: {
        secret: "12345",
        expires: 30,
    },
    database: {
        synchronize: true,
        type: "mysql",
        host: "mysql669.umbler.com",
        port: 41890,
        username: "backend",
        password: "vancouver2020",
        database: "vancouver-sql",
        entities: [
            "/models",
        ],
        migrations: [
            "/migrations",
        ],
    },
};
