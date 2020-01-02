import * as bootstrap from "src/core/bootstrap";
import * as request from "supertest";

describe("Users module", () => {

  const email: string = `${new Date().getTime()}@example.com`;
  const password: string = "@DefaultTest!Password#$%¨&*";
  const name: string = "Test User";
  let access: string;

  beforeAll(async (done) => {
    await bootstrap.start("test");
    done();
  });

  afterAll(async (done) => {
    await bootstrap.stop("test");
    done();
  });

  describe("POST /users", () => {
    it("Should register a new user", async () => {
      const req = await request(bootstrap.server.app)
        .post(`${bootstrap.server.baseRoute}/users`)
        .send({ email, password, name });
      expect(req.status).toBe(201);
    });
  });

  describe("POST /users/login", () => {
    it("Should login the new user", async () => {
      const req = await request(bootstrap.server.app)
        .post(`${bootstrap.server.baseRoute}/users/login`)
        .send({ email, password });
      access = req.body.access;
      expect(req.status).toBe(200);
    });
  });

  describe("POST /tasks", () => {
    it("Should create a new task", async () => {
      const req = await request(bootstrap.server.app)
        .post(`${bootstrap.server.baseRoute}/tasks`)
        .set("Authorization", `Bearer ${access}`)
        .send({ title: "Example task" });
      expect(req.status).toBe(201);
    });
  });

});
