import { VerifyErrors } from "jsonwebtoken";
import * as Jwt from "jsonwebtoken";
import { DefaultResponse } from "src/core/interfaces";
import { AccessToken, Auth, RefreshToken } from "src/interfaces/auth";
import { AuthSettings } from "src/interfaces/authSettings";

const generateTimestamp = (minutes: number): number => {
  return Math.floor(Date.now() / 1000) + (60 * minutes);
};

const generateAccessToken = (userId: number, authSettings: AuthSettings): AccessToken => {
  const accessPayload = {
    type: "access",
    user: userId,
    exp: generateTimestamp(authSettings.accessExpires),
  };
  const access = Jwt.sign(accessPayload, authSettings.secret);
  const accessExpires = new Date(accessPayload.exp * 1000);

  return { access, accessExpires };
};

const generateRefreshToken = (userId: number, authSettings: AuthSettings): RefreshToken => {
  const refreshPayload = {
    type: "refresh",
    user: userId,
    exp: generateTimestamp(authSettings.refreshExpires),
  };
  const refresh = Jwt.sign(refreshPayload, authSettings.secret);
  const refreshExpires = new Date(refreshPayload.exp * 1000);

  return { refresh, refreshExpires };
};

export const generateTokens = (userId: number, authSettings: AuthSettings): Auth => {
  return { ...generateAccessToken(userId, authSettings), ...generateRefreshToken(userId, authSettings) };
};

export const decodeToken = (token: string, secret: string): Promise<DefaultResponse<any>> => {
  return new Promise((resolve) => {
    Jwt.verify(token, secret, (error: VerifyErrors, decoded: any) => {

      if (error) {
        resolve({ success: false, error: error.message });
      }

      resolve({ success: true, data: decoded });
    });
  });
};
