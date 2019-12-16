import { Settings } from "src/interfaces/settings";

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
        host: "remotemysql.com",
        port: 3306,
        username: "svDNaWBXZ1",
        password: "O3PL2yCalt",
        database: "svDNaWBXZ1",
        entities: [
            "/models/**",
        ],
        migrations: [
            "/migrations",
        ],
    },
    defaultMessages: {
        notFound: "Not Found",
        serverError: "Server error.",
        notAllowed: "Not allowed.",
        missingParamters: "Missing paramters.",
        failedToSave: "Failed to save.",
    },
};
