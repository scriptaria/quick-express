import * as bootstrap from "src/core/bootstrap";
import { Auth } from "src/interfaces/auth";
import { settings } from "src/settings";
import * as request from "supertest";
import * as helper from "./helper";

describe("Users module", () => {

  const email: string = `${new Date().getTime()}@example.com`;
  const password: string = "@DefaultTest!Password#$%¨&*";
  const name: string = "Test User";
  let access: string;
  let refresh: string;
  let invalidAccess: string;

  beforeAll(async (done) => {
    await bootstrap.start("test");
    done();
  });

  afterAll(async (done) => {
    await bootstrap.stop("test");
    done();
  });

  describe("Helper", () => {
    let tokens: Auth;

    it("Generate JWT token", () => {
      tokens = helper.generateTokens(-5, settings.auth);
      const hasKeys = "access" in tokens && "accessExpires" in tokens && "refresh" in tokens && "refreshExpires" in tokens;
      invalidAccess = tokens.access;
      expect(hasKeys).toBe(true);
    });

    it("Decode JWT tokens", async () => {
      const result = await Promise.all([
        helper.decodeToken(tokens.access, settings.auth.secret),
        helper.decodeToken(tokens.refresh, settings.auth.secret),
      ]).catch(() => null);
      const success = result && result[0].success && result[1].success;
      expect(success).toBe(true);
    });
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
      refresh = req.body.refresh;
      expect(req.status).toBe(200);
    });
  });

  describe("POST /users/refresh", () => {
    it("Should says that is a VALID refresh token", async () => {
      const req = await request(bootstrap.server.app)
        .post(`${bootstrap.server.baseRoute}/users/refresh`)
        .send({ refresh });
      expect(req.status).toBe(200);
    });

    it("Should says that is an INVALID refresh token", async () => {
      const req = await request(bootstrap.server.app)
        .post(`${bootstrap.server.baseRoute}/users/refresh`)
        .send({ refresh: "AnInvalidRefreshToken" });
      expect(req.status).toBe(400);
    });
  });

  describe("GET /users/:id", () => {
    it("Should receive logged user data", async () => {
      const req = await request(bootstrap.server.app)
        .get(`${bootstrap.server.baseRoute}/users/me`)
        .set("Authorization", `Bearer ${access}`);
      expect(req.status).toBe(200);
    });

    it("Should NOT receive logged user data: invalid auth token", async () => {
      const req = await request(bootstrap.server.app)
        .get(`${bootstrap.server.baseRoute}/users/me`)
        .set("Authorization", `Bearer invalid.token`);
      expect(req.status).toBe(401);
    });

    it("Should NOT receive logged user data: wrong auth token", async () => {
      const req = await request(bootstrap.server.app)
        .get(`${bootstrap.server.baseRoute}/users/me`)
        .set("Authorization", `Bearer ${refresh}`);
      expect(req.status).toBe(401);
    });

    it("Should NOT receive logged user data: invalid access token", async () => {
      const req = await request(bootstrap.server.app)
        .get(`${bootstrap.server.baseRoute}/users/me`)
        .set("Authorization", `Bearer ${invalidAccess}`);
      expect(req.status).toBe(401);
    });

    it("Should NOT receive logged user data: no auth token", async () => {
      const req = await request(bootstrap.server.app)
        .get(`${bootstrap.server.baseRoute}/users/me`);
      expect(req.status).toBe(401);
    });
  });

});
