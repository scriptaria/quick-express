import { Component } from "interfaces/component";
import { getIdTasks } from "./handlers/getIdTasks";
import { getMe } from "./handlers/getMe";

export const routes: Component = {

    "/me": {
        get: {
            middlewares: ["auth"],
            handler: getMe,
        },
    },

    "/:id/tasks": {
        get: {
            handler: getIdTasks,
        },
    },
};
