import { Route } from "./route";

export interface Component {
    [name: string]: Route;
}
