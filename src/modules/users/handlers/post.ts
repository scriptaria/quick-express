import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "src/models/user";

/**
 * @api {post} /users Create a User
 * @apiName PostUsers
 * @apiGroup Users
 *
 * @apiParam {String} email     The email of the new user.
 * @apiParam {String} password  The password of the new user.
 * @apiParam {String} name      The name of the new user.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 Created
 */
export const post = async (request: Request, response: Response) => {

  if (!request.body.email || !request.body.password || !request.body.name) {
    response.status(400);
    response.send({ error: "Missing paramters." });
    return;
  }

  const user = new User();
  user.name = request.body.name;
  user.password = await bcrypt.hash(request.body.password, 10).catch(() => null);
  user.email = request.body.email;

  if (!await user.save().catch(() => null)) {
    response.status(400);
    response.send({ error: "Failed to save." });
    return;
  }

  response.status(201);
  response.send(user);
};
