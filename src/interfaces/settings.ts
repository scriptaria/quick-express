import { BaseSettings } from "src/core/interfaces";

export interface Settings extends BaseSettings {
    auth: {
        secret: string,
        expires: number,
    };
}
