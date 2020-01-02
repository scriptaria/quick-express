import { settings } from "src/settings";
import { Database } from "./database";
import { Env } from "./env";
import { Events } from "./events";
import { Server } from "./server";
import { Validations, Validator } from "./validator";

describe("Quick Express Core", () => {

  describe("Database", () => {
    const database = new Database();
    database.setSettings(settings.database);

    test("Should connect with database", (done) => {
      database.start()
        .then((result) => {
          expect(result.success).toBe(true);
        })
        .finally(() => {
          done();
        });
    });

    test("Should stop connection with database", (done) => {
      database.stop()
        .then((result) => {
          expect(result.success).toBe(true);
        })
        .finally(() => {
          done();
        });
    });
  });

  describe("Server", () => {
    const server = new Server();
    const port = settings.port + 50;

    test("Should start the server successfully", (done) => {
      server.start(port)
        .then((result) => {
          expect(result.success).toBe(true);
        })
        .finally(() => {
          done();
        });
    });

    test("Should stop the server successfully", (done) => {
      server.stop()
        .then((result) => {
          expect(result.success).toBe(true);
        })
        .finally(() => {
          done();
        });
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
      const request = {
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

      const result = Validator.validate(request as any, rules);
      expect(result.success).toBe(true);
    });

    test("A invalid request", () => {
      const request = {
        body: {
          email: "email.example",
        },
        params: {
          id: "test",
        },
      };

      const result = Validator.validate(request as any, rules);
      expect(result.success).toBe(false);
    });
  });
});
