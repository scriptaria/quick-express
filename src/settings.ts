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
        host: "example.com",
        port: 3306,
        username: "root",
        password: "",
        database: "quick",
        entities: [
            "/models",
        ],
        migrations: [
            "/migrations",
        ],
    },
};
