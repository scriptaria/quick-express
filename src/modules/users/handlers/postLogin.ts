import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Validator } from "src/core/validator";
import { User } from "src/models/user";
import { settings } from "src/settings";
import { validators } from "src/validators";
import { generateTokens } from "../helper";

/**
 * @api {post} /users/login User Login
 * @apiName PostUsersLogin
 * @apiGroup Users
 *
 * @apiParam {String} email     The email of the user.
 * @apiParam {String} password  The password of the user.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *    {
 *      "access": "accessToken",
 *      "accessExpires": "2019-12-16T08:41:14.988Z",
 *      "refresh": "refreshToken",
 *      "refreshExpires": "2020-01-16T08:41:14.988Z",
 *    }
 */
export const postLogin = async (request: Request, response: Response) => {

  const validator = Validator.validate(request, {
    body: {
      email: validators.email,
      password: validators.password,
    },
  });

  if (!validator.success) {
    response.status(400);
    response.send({ errors: validator.errors });
    return;
  }

  const user: User = await User.findOne({ email: request.body.email }, { select: ["id", "password"] }).catch(() => null);

  if (!user) {
    response.status(404);
    response.send({ error: "User not found." });
  }

  const isTheCorrectPassword = await bcrypt.compare(request.body.password, user.password).catch(() => false);

  if (!isTheCorrectPassword) {
    response.status(400);
    response.send({ error: "Wrong password." });
    return;
  }

  const tokens = generateTokens(user.id, settings.auth);

  response.status(200);
  response.send(tokens);
};
