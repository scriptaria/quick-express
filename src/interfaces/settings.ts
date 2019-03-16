import { ConnectionOptions } from "typeorm";

export interface Settings {
    port: number;
    baseRoute: string;
    domain?: string;
    ssl?: boolean;
    auth: {
        secret: string,
        expires: number,
    };
    database?: ConnectionOptions;
}
