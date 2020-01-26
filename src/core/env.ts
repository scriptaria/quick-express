import { boolean } from "boolean";
import { config } from "dotenv";

config({
  path: `${__dirname}/../../.env`,
});

const parseEnv = (value: any): any => {
  if (value === "true" || value === "false") {
    return boolean(value);
  }

  if (!isNaN(Number(value))) {
    return Number(value);
  }

  return value;
};

export const getEnv = (key: string, defaultValue?: string | number | boolean): any => {
  const value = process.env[key];

  if (defaultValue !== undefined && value === undefined) {
    return defaultValue;
  }

  return parseEnv(value);
};
