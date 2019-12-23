import { BaseSettings } from "src/core/interfaces";
import { AuthSettings } from "./authSettings";

export interface Settings extends BaseSettings {
  auth: AuthSettings;
}
