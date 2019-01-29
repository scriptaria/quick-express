import { ConnectionOptions } from "typeorm";

export interface Settings {
    port: number;
    domain?: string;
    ssl?: boolean;
    auth: {
        secret: string,
        expires: number,
    };
    database?: ConnectionOptions;
}
