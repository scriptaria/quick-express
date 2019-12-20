import "module-alias/register";

import { boolean } from "boolean";
import { settings } from "src/settings";
import { Database } from "./database";
import { Events } from "./events";
import { Server } from "./server";

if (boolean(process.env.CI)) {
    settings.auth.secret = "abcd";
}

export const database = new Database();
export const server = new Server(database);

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

export const startServer = (ambient: "dev" | "prod" | "test") => {
    return new Promise((resolve) => {

        server.setModules(settings.baseRoute);

        let port = settings.port;
        if (ambient === "test") {
            port += 50;
        }

        server.start(port).then((result) => {
            resolve(result);

            if (!result.success) {
                console.log("The server cannot be started");
                console.log(result.error);
                return;
            }

            Events.send("serverIsReady");
            console.log(`Server running at port ${port}`);
        });
    });
};

export const start = (ambient: "dev" | "prod" | "test") => {

    return new Promise((resolve) => {

        if (!settings.auth.secret) {
            console.log("Missing the secret key, open your 'settings.ts' and place it.");
            resolve({ success: false, error: "Missing secret." });
            return;
        }

        const promises = [];
        if (settings.database) {
            promises.push(startDatabase());
        }

        promises.push(startServer(ambient));

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

export const stop = () => {
    return new Promise((resolve) => {

        const promises = [];
        if (settings.database) {
            promises.push(database.stop());
        }

        promises.push(server.stop());

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
