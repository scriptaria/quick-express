import { boolean } from "boolean";
import { Settings } from "src/interfaces/settings";
import { Env } from "./core/env";

export const settings: Settings = {
  port: 3000,
  baseRoute: "/",
  staticFolder: "/static",
  serveDoc: true,
  auth: {
    secret: Env.get("AUTH_SECRET"),
    accessExpires: 30,
    refreshExpires: 43200,
  },
  database: {
    synchronize: boolean(Env.get("DB_SYNC", true)),
    type: Env.get("DB_TYPE", "sqlite"),
    host: Env.get("DB_HOST"),
    port: Number(Env.get("DB_PORT")),
    username: Env.get("DB_USER"),
    password: Env.get("DB_PASS"),
    database: Env.get("DB_NAME", "database.sqlite"),
    entities: [
      "/models/**",
    ],
    migrations: [
      "/migrations",
    ],
  },
};
