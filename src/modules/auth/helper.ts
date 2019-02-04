import { DefaultResponse } from "interfaces/defaultResponse";
import { VerifyErrors } from "jsonwebtoken";
import * as Jwt from "jsonwebtoken";

const generateTimestamp = (minutes: number, hours: number = 1, days: number = 1): number => {
    return Math.floor(Date.now() / 1000) + (60 * minutes * hours * days);
};

export const generateTokens = (userId: number, secret: string, expires: number): { token: string, refresh: string } => {

    const token = Jwt.sign(
        {
            type: "token",
            user: userId,
            exp: generateTimestamp(30),
        },
        secret);

    const refresh = Jwt.sign(
        {
            type: "refresh",
            user: userId,
            exp: generateTimestamp(60, 24, (expires > 0) ? expires : 1),
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

            resolve({ success: true, result: decoded });
        });
    });
};
