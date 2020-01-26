import { Settings } from "src/interfaces/settings";
import { getEnv } from "./core/env";

export const settings: Settings = {
  port: 3000,
  baseRoute: "/",
  staticFolder: "/static",
  serveDoc: true,
  auth: {
    secret: getEnv("AUTH_SECRET"),
    accessExpires: 30,
    refreshExpires: 43200,
  },
  database: {
    synchronize: getEnv("DB_SYNC", true),
    type: getEnv("DB_TYPE", "sqlite"),
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASS"),
    database: getEnv("DB_NAME", ":memory:"),
    entities: [
      "/models/**",
    ],
    migrations: [
      "/migrations",
    ],
  },
};
