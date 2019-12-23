import { boolean } from "boolean";
import { config } from "dotenv";
import { Settings } from "src/interfaces/settings";

config({
  path: `${__dirname}/../${boolean(process.env.CI) ? `.env.example` : `.env`}`,
});

export const settings: Settings = {
  port: 3000,
  baseRoute: "/",
  staticFolder: "/static",
  serveDoc: true,
  auth: {
    secret: String(process.env.AUTH_SECRET),
    accessExpires: 30,
    refreshExpires: 43200,
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
};
