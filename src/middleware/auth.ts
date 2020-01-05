import { NextFunction, Request, Response } from "express";
import { User } from "src/models/user";
import { decodeToken } from "src/modules/users/helper";
import { settings } from "src/settings";

export const auth = async (request: Request, response: Response, next: NextFunction) => {

  if (!("authorization" in request.headers)) {
    response.status(401);
    response.send({ error: "Missing authentication" });
    return;
  }

  const token = request.headers.authorization.replace("Bearer ", "");

  const decodeTokenResult = await decodeToken(token, settings.auth.secret);

  if (!decodeTokenResult.success) {
    response.status(401);
    response.send({ error: "Failed to decode token." });
    return;
  }

  const decodedToken = decodeTokenResult.data;

  if (decodedToken.type !== "access") {
    response.status(401);
    response.send({ error: "Not a valid access token" });
    return;
  }

  response.locals.userId = decodedToken.user;
  response.locals.user = await User.findOne({ id: response.locals.userId }).catch(() => null);

  if (!response.locals.user) {
    response.status(401);
    response.send({ error: "Not a valid access token. This user does not exist." });
    return;
  }

  next();
};
