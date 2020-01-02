import { Request, Response } from "express";
import { VerifyErrors } from "jsonwebtoken";
import * as Jwt from "jsonwebtoken";
import { Validator } from "src/core/validator";
import { User } from "src/models/user";
import { settings } from "src/settings";
import { generateTokens } from "../helper";

/**
 * @api {post} /users/refresh Refresh User Tokens
 * @apiName PostUsersRefresh
 * @apiGroup Users
 *
 * @apiParam {String} refresh   Refresh token.
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
export const postRefresh = (request: Request, response: Response) => {

  const validator = Validator.validate(request, {
    body: {
      refresh: {
        presence: {
          message: "is required",
        },
      },
    },
  });

  if (!validator.success) {
    response.status(400);
    response.send({ errors: validator.errors });
    return;
  }

  Jwt.verify(request.body.refresh, settings.auth.secret, async (error: VerifyErrors, decoded: any) => {

    if (error) {
      response.status(400);
      response.send({ error: error.message });
      return;
    }

    if (decoded.type !== "refresh") {
      response.status(400);
      response.send({ error: "Invalid token." });
      return;
    }

    const user: User = await User.findOne({ id: decoded.user }).catch(() => null);

    if (!user) {
      response.status(404);
      response.send({ error: "User not found." });
      return;
    }

    const tokens = generateTokens(user.id, settings.auth);
    response.status(200);
    response.send(tokens);
  });
};
