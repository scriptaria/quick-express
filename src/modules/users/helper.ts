import { VerifyErrors } from "jsonwebtoken";
import * as Jwt from "jsonwebtoken";
import { DefaultResponse } from "../../core/interfaces";
import { settings } from "../../settings";

const generateTimestamp = (minutes: number, hours: number = 1, days: number = 1): number => {
    return Math.floor(Date.now() / 1000) + (60 * minutes * hours * days);
};

export const generateTokens = (userId: number, secret: string, expires: number): {
    access: string,
    accessExpires: Date,
    refresh: string,
    refreshExpires: Date,
} => {

    const accessPayload = {
        type: "access",
        user: userId,
        exp: generateTimestamp(settings.auth.expires),
    };
    const access = Jwt.sign(accessPayload, secret);

    const refreshPayload = {
        type: "refresh",
        user: userId,
        exp: generateTimestamp(60, 24, (expires > 0) ? expires : 1),
    };
    const refresh = Jwt.sign(refreshPayload, secret);

    const refreshExpires = new Date(refreshPayload.exp * 1000);
    const accessExpires = new Date(accessPayload.exp * 1000);

    return { access, accessExpires, refresh, refreshExpires };
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
