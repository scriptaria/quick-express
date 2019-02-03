import { DefaultResponse } from "interfaces/defaultResponse";
import { Secret, VerifyErrors } from "jsonwebtoken";
import * as Jwt from "jsonwebtoken";

export const generateTokens = (userId, secret: string, expires: number): { token: Secret, refresh: Secret } => {

    const token = Jwt.sign(
        {
            type: "token",
            user: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 30), // 30 minutes expiration
        },
        secret);

    const refresh = Jwt.sign(
        {
            type: "refresh",
            user: userId,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * expires),
        },
        secret);

    return { token, refresh };
};

export const decodeToken = (token: string, secret: string): Promise<DefaultResponse> => {
    return new Promise((resolve) => {
        Jwt.verify(token, secret, (error: VerifyErrors, decoded: any) => {

            if (error) {
                resolve({ success: false, error: error.message });
            }

            if (decoded.type !== "token") {
                resolve({ success: false, error: "Invalid token" });
            }

            resolve({ success: true, result: decoded });

        });
    });
};
