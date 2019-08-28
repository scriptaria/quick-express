import * as request from "supertest";
import * as bootstrap from "../../core/bootstrap";
import { settings } from "../../settings";
import * as helper from "./helper";

describe("Users module", () => {

    const email: string = `${new Date().getTime()}@example.com`;
    const password: string = "@DefaultTest!Password#$%¨&*";
    const name: string = "Test User";
    let access: string;
    let refresh: string;

    before(function(done) {
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

    describe("POST /users", () => {
        it("Should register a new user", (done) => {
            request(bootstrap.server.app)
                .post(`${settings.baseRoute}/users`)
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

    describe("POST /users/login", () => {
        it("Should login the new user", (done) => {
            request(bootstrap.server.app)
                .post(`${settings.baseRoute}/users/login`)
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

    describe("POST /users/refresh", () => {
        it("Should says that is a VALID refresh token", (done) => {
            request(bootstrap.server.app)
                .post(`${settings.baseRoute}/users/refresh`)
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
                .post(`${settings.baseRoute}/users/refresh`)
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
