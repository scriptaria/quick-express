import { Request, Response } from "express";
import { User } from "src/models/user";
import { settings } from "src/settings";

/**
 * @api {get} /users/:id Get a User by Id
 * @apiName GetUsersId
 * @apiGroup Users
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "name": "User Name",
 *      "email": "example@email.com"
 *    }
 */
export const getId = async (request: Request, response: Response) => {

  const userId = request.params.id === "me" ? response.locals.userId : request.params.id;

  const user: User = await User.findOne({ id: userId }).catch(() => null);

  if (!user) {
    response.status(404);
    response.send({ error: "Not found." });
    return;
  }

  response.status(200);
  response.send(user);
};
