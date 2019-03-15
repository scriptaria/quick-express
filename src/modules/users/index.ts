import { Component } from "interfaces/component";
import { getIdTasks } from "./handlers/getIdTasks";
import { getMe } from "./handlers/getMe";
import { getMeTasks } from "./handlers/getMeTasks";

export const routes: Component = {

    "/me": {
        get: {
            middlewares: ["auth"],
            handler: getMe,
        },
    },

    "/me/tasks": {
        get: {
            middlewares: ["auth"],
            handler: getMeTasks,
        },
    },

    "/:id/tasks": {
        get: {
            handler: getIdTasks,
        },
    },
};
