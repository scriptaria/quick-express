import * as assert from "assert";
import { Secret } from "jsonwebtoken";
import * as request from "supertest";
import { server } from "../../core/bootstrap";
import { settings } from "../../settings";
import * as helper from "./helper";

describe("Auth module", () => {

    const email = `${new Date().getTime()}@example.com`;
    const password = "@DefaultTest!Password#$%¨&*";
    const name = "Test User";
    let token;
    let refresh;

    before(() => {
        server.start(settings.port);
    });

    after(() => {
        server.stop();
    });

    describe("Helper", () => {
        let tokens: { token: string, refresh: string };

        it("Generate JWT token", (done) => {
            tokens = helper.generateTokens(1, settings.auth.secret, settings.auth.expires);

            if (!("token" in tokens)) { throw new Error("Missing `token` key"); }
            if (!("refresh" in tokens)) { throw new Error("Missing `refresh` key"); }

            done();
        });

        it("Decode JWT tokens", (done) => {
            Promise.all([
                helper.decodeToken(tokens.token, settings.auth.secret),
                helper.decodeToken(tokens.refresh, settings.auth.secret),
            ])
                .then((results) => {

                    if (!results[0].success) {
                        throw new Error(`Fail trying to decode \`token\` JTW: ${results[0].error}`);
                    }

                    if (!results[1].success) {
                        throw new Error(`Fail trying to decode \`refresh\` JTW: ${results[1].error}`);
                    }

                    done();
                })
                .catch((error) => {
                    console.log(error);
                    throw new Error("Fail trying to decode `token` and `refresh`");
                });
        });
    });

    describe("POST /auth/register", () => {
        it("Should register a new user", (done) => {
            request(server.app)
                .post("/auth/register")
                .send({ email, password, name })
                .expect(201)
                .then((result) => {
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });

    describe("POST /auth/login", () => {
        it("Should login the new user", (done) => {
            request(server.app)
                .post("/auth/login")
                .send({ email, password })
                .expect(200)
                .expect((response) => {
                    if (!("token" in response.body)) { throw new Error("Missing `token` key"); }
                    if (!("refresh" in response.body)) { throw new Error("Missing `refresh` key"); }
                })
                .then((response) => {
                    token = response.body.token;
                    refresh = response.body.refresh;
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });

    describe("GET /auth/check/:token", () => {
        it("Should say that is a VALID token", (done) => {
            request(server.app)
                .get(`/auth/check/${token}`)
                .expect(200)
                .expect((response) => {
                    if (!("id" in response.body)) { throw new Error("Missing `id` key"); }
                    if (!("name" in response.body)) { throw new Error("Missing `name` key"); }
                    if (!("email" in response.body)) { throw new Error("Missing `email` key"); }
                })
                .then((result) => {
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });

        it("Should say that is an INVALID token", (done) => {
            request(server.app)
                .get("/auth/check/invalidtokenexample")
                .expect(400)
                .expect((response) => {
                    if (!("error" in response.body)) { throw new Error("Missing `error` key"); }
                })
                .then((result) => {
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });

    describe("POST /auth/refresh", () => {
        it("Should says that is a VALID refresh token", (done) => {
            request(server.app)
                .post("/auth/refresh")
                .send({ refresh })
                .expect(200)
                .expect((response) => {
                    if (!("token" in response.body)) { throw new Error("Missing `token` key"); }
                    if (!("refresh" in response.body)) { throw new Error("Missing `refresh` key"); }
                })
                .then((response) => {
                    token = response.body.token;
                    refresh = response.body.refresh;
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });

        it("Should says that is an INVALID refresh token", (done) => {
            request(server.app)
                .post("/auth/refresh")
                .send({ refresh: "AnInvalidRefreshToken" })
                .expect(400)
                .expect((response) => {
                    if (!("error" in response.body)) { throw new Error("Missing `error` key"); }
                })
                .then((response) => {
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });

});
