import { config } from "dotenv";

config({
  path: `${__dirname}/../.env`,
});

export class Env {
  public static get(key: string, defaultValue?: string | number | boolean): any {
    const value = process.env[key];

    if (defaultValue !== undefined && (value === undefined || value === null)) {
      return defaultValue;
    }

    return value;
  }
}
