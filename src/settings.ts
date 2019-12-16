import { boolean } from "boolean";
import { config } from "dotenv";
import { Settings } from "src/interfaces/settings";

config({
    path: `${__dirname}/../.env`,
});

export const settings: Settings = {
    port: 3000,
    baseRoute: "/v1",
    auth: {
        secret: String(process.env.AUTH_SECRET),
        expires: process.env.AUTH_EXPIRES ? Number(process.env.AUTH_EXPIRES) : 30,
    },
    database: {
        synchronize: boolean(process.env.DB_SYNC),
        type: process.env.DB_TYPE as any ?? "mysql",
        host: process.env.DB_HOST ?? "localhost",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        username: process.env.DB_USER ?? "root",
        password: process.env.DB_PASS ?? "",
        database: process.env.DB_NAME ?? "quickdb",
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
