import { routes } from "../routes";
import { settings } from "../settings";
import { Database } from "./database";
import { Server } from "./server";

const isTesting = process.env.TEST_ENV || false;

export const server = new Server();

if (settings.database) {
    const database = new Database();
    database.setSettings(settings.database);
    database.startConnection().then((result) => {
        if (!result.success) {
            console.log("Cannot connect to the database");
            console.log("ERROR: ", result.error);
            return;
        }

        if (isTesting) { return; } // not show this console.log if running tests
        console.log("Successful connection with the database");
    });

}

for (const route of routes) {
    server.setComponent(route.path, route.component);
}

server.start(settings.port).then((result) => {
    if (!result.success) {
        console.log("The server cannot be started");
        return;
    }

    if (isTesting) { return; } // not show this console.log if running tests
    console.log(`Server running at port ${settings.port}`);
});
