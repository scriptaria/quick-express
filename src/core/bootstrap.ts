import * as moduleAlias from "module-alias";
moduleAlias.addAliases({
  "src": `${__dirname}/..`,
});

import { settings } from "src/settings";
import { Database } from "./database";
import { Events } from "./events";
import { Server } from "./server";

export const database = new Database();
export const server = new Server(settings, database);

export const startDatabase = () => {
  return new Promise((resolve) => {

    database.setSettings(settings.database);
    database.start().then((result) => {
      resolve(result);

      if (!result.success) {
        console.log("Cannot connect to the database");
        console.log(result.error);
        return;
      }

      Events.send("databaseIsReady");
      console.log("Successful connection with the database");
    });
  });
};

export const startServer = () => {
  return new Promise((resolve) => {

    server.start(settings.port).then((result) => {
      resolve(result);

      if (!result.success) {
        console.log("The server cannot be started");
        console.log(result.error);
        return;
      }

      Events.send("serverIsReady");
      console.log(`Server running at port ${settings.port}`);
    });
  });
};

export const start = (ambient: "dev" | "prod" | "test") => {

  console.log("Starting...");

  if (ambient === "test") {
    settings.auth.secret = "abcd";
    settings.database = settings.database ? {
      synchronize: true,
      type: "sqlite",
      database: ":memory:",
      entities: settings.database.entities,
      migrations: settings.database.migrations,
    } : null;
  }

  server.loadModules();

  return new Promise((resolve) => {

    if (!settings.auth.secret) {
      console.log("Missing the auth secret key, open your '.env' and place it.");
      resolve({ success: false, error: "Missing secret." });
      return;
    }

    const promises = [];

    if (ambient !== "test") {
      promises.push(startServer());
    }

    if (settings.database) {
      promises.push(startDatabase());
    }

    Promise.all(promises)
      .then((results) => {
        results.forEach((result) => {
          if (!result.success) {
            resolve(result);
          }
        });

        Events.send("applicationIsReady");
        resolve({ success: true });
      });
  });
};

export const stop = (ambient: "dev" | "prod" | "test") => {
  return new Promise((resolve) => {

    const promises = [];

    if (ambient !== "test") {
      promises.push(server.stop());
    }

    if (settings.database) {
      promises.push(database.stop());
    }

    Promise.all(promises)
      .then((results) => {
        results.forEach((result) => {
          if (!result.success) {
            resolve(result);
          }
        });

        resolve({ success: true });
      });
  });
};

// tslint:disable-next-line:no-var-requires
require("make-runnable/custom")({
  printOutputFrame: false,
});
