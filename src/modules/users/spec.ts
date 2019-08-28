import * as request from "supertest";
import * as bootstrap from "../../core/bootstrap";
import { settings } from "../../settings";
import * as helper from "./helper";

describe("Auth module", () => {

    const email = `${new Date().getTime()}@example.com`;
    const password = "@DefaultTest!Password#$%¨&*";
    const name = "Test User";
    let access;
    let refresh;

    before(function (done) {
        this.timeout(60000);
        bootstrap.start("test").then((result: any) => {
            if (!result.success) {
                done(new Error(result.error));
                return;
            }
            done();
        });
    });

    after((done) => {
        bootstrap.stop().then((result: any) => {
            if (!result.success) {
                done(new Error(result.error));
                return;
            }
            done();
        });
    });

    describe("Helper", () => {
        let tokens: { access: string, refresh: string };

        it("Generate JWT token", (done) => {
            tokens = helper.generateTokens(1, settings.auth.secret, settings.auth.expires);

            if (!("access" in tokens)) { throw new Error("Missing `access` key"); }
            if (!("refresh" in tokens)) { throw new Error("Missing `refresh` key"); }

            done();
        });

        it("Decode JWT tokens", (done) => {
            Promise.all([
                helper.decodeToken(tokens.access, settings.auth.secret),
                helper.decodeToken(tokens.refresh, settings.auth.secret),
            ])
                .then((results) => {

                    if (!results[0].success) {
                        throw new Error(`Fail trying to decode \`access\` token: ${results[0].error}`);
                    }

                    if (!results[1].success) {
                        throw new Error(`Fail trying to decode \`refresh\` token: ${results[1].error}`);
                    }

                    done();
                })
                .catch((error) => {
                    console.log(error);
                    throw new Error("Fail trying to decode `access` and `refresh` tokens");
                });
        });
    });

    describe("POST /auth/register", () => {
        it("Should register a new user", (done) => {
            request(bootstrap.server.app)
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
            request(bootstrap.server.app)
                .post("/auth/login")
                .send({ email, password })
                .expect(200)
                .expect((response) => {
                    if (!("access" in response.body)) { throw new Error("Missing `token` key"); }
                    if (!("refresh" in response.body)) { throw new Error("Missing `refresh` key"); }
                })
                .then((response) => {
                    access = response.body.access;
                    refresh = response.body.refresh;
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });

    describe("GET /auth/check/:access", () => {
        it("Should say that is a VALID access token", (done) => {
            request(bootstrap.server.app)
                .get(`/auth/check/${access}`)
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
            request(bootstrap.server.app)
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
            request(bootstrap.server.app)
                .post("/auth/refresh")
                .send({ refresh })
                .expect(200)
                .expect((response) => {
                    if (!("access" in response.body)) { throw new Error("Missing `token` key"); }
                    if (!("refresh" in response.body)) { throw new Error("Missing `refresh` key"); }
                })
                .then((response) => {
                    access = response.body.access;
                    refresh = response.body.refresh;
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });

        it("Should says that is an INVALID refresh token", (done) => {
            request(bootstrap.server.app)
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
