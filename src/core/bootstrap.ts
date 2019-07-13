import { modules } from "../modules";
import { settings } from "../settings";
import { Database } from "./database";
import { Events } from "./events";
import { Server } from "./server";

export const database = new Database();
export const server = new Server(database);
export const events = new Events();

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

            events.send("databaseReady");
            console.log("Successful connection with the database");
        });
    });
};

export const startServer = (ambient) => {
    return new Promise((resolve) => {

        for (const module of modules) {
            const baseRoute = settings.baseRoute || "";
            server.setComponent(baseRoute + module.path, module.component);
        }

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

            events.send("serverReady");
            console.log(`Server running at port ${port}`);
        });
    });
};

export const start = (ambient: string) => {

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

                events.send("applicationReady");
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
