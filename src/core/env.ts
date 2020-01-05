import { boolean } from "boolean";
import { config } from "dotenv";

config({
  path: `${__dirname}/../../.env`,
});

export class Env {

  public static get(key: string, defaultValue?: string | number | boolean): any {
    const value = process.env[key];

    if (defaultValue !== undefined && value === undefined) {
      return defaultValue;
    }

    return Env.parse(value);
  }

  private static parse(value: any): any {
    if (value === "true" || value === "false") {
      return boolean(value);
    }

    if (!isNaN(Number(value))) {
      return Number(value);
    }

    return value;
  }
}
