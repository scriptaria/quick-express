import { settings } from "src/settings";
import * as request from "supertest";
import { Database } from "./database";
import { Env } from "./env";
import { Events } from "./events";
import { Server } from "./server";
import { Validations, Validator } from "./validator";

describe("Quick Express Core", () => {

  describe("Database", () => {
    const database = new Database();
    database.setSettings(settings.database);

    const invalidDatabase = new Database();
    invalidDatabase.setSettings({
      type: "invalidOne",
      database: ":memory:",
      entities: settings.database.entities,
      migrations: settings.database.migrations,
    } as any);

    test("Should NOT connect with an invalid database", async () => {
      const result = await invalidDatabase.start();
      expect(result.success).toBe(false);
    });

    test("Should connect with database", async () => {
      const result = await database.start();
      expect(result.success).toBe(true);
    });

    test("Should NOT connect with database", async () => {
      const result = await database.start();
      expect(result.success).toBe(false);
    });

    test("Should stop connection with database", async () => {
      const result = await database.stop();
      expect(result.success).toBe(true);
    });

    test("Should NOT stop connection with database", async () => {
      const result = await database.stop();
      expect(result.success).toBe(false);
    });
  });

  describe("Server", () => {
    const server = new Server(settings);
    const port = settings.port + 50;

    test("Should start the server successfully", async () => {
      const result = await server.start(port);
      expect(result.success).toBe(true);
    });

    test("Should NOT start the server successfully", async () => {
      const result = await server.start(port);
      expect(result.success).toBe(false);
    });

    test("Should get the server status", async () => {
      const req = await request(server.app)
        .get(`${server.baseRoute}/status`);
      expect(req.status).toBe(200);
    });

    test("Should stop the server successfully", async () => {
      const result = await server.stop();
      expect(result.success).toBe(true);
    });

    test("Should NOT stop the server successfully", async () => {
      const result = await server.stop();
      expect(result.success).toBe(false);
    });
  });

  describe("Env", () => {
    test("Get an unused env and receives the settled default value", () => {
      expect(Env.get("inexistentEnvKeyHere", "defaultValue")).toBe("defaultValue");
    });
    test("Get an unused env and receives undefined", () => {
      expect(Env.get("inexistentEnvKeyHere")).toBe(undefined);
    });
  });

  describe("Events", () => {
    test("Send a event and receives it back", (done) => {
      Events.listen("testEvent").subscribe((data) => {
        expect(data).toBe("testValue");
        done();
      });
      Events.send("testEvent", "testValue");
    });
  });

  describe("Validator", () => {

    const rules: Validations = {
      body: {
        email: {
          presence: {
            message: "is required",
          },
          email: {
            message: "doesn't look valid",
          },
        },
      },
      params: {
        id: {
          numericality: {
            message: "must be a number",
          },
        },
      },
      query: {
        limit: {
          numericality: {
            message: "must be a number",
          },
        },
      },
    };

    test("A valid request", () => {
      const requestData = {
        body: {
          email: "valid@email.example",
        },
        params: {
          id: 10,
        },
        query: {
          limit: 10,
        },
      };

      const result = Validator.validate(requestData as any, rules);
      expect(result.success).toBe(true);
    });

    test("A invalid request", () => {
      const requestData = {
        body: {
          email: "email.example",
        },
        params: {
          id: "test",
        },
      };

      const result = Validator.validate(requestData as any, rules);
      expect(result.success).toBe(false);
    });
  });
});
