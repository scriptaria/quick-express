import { Component } from "../../core/interfaces";
import { getIdTasks } from "./handlers/getIdTasks";
import { getMe } from "./handlers/getMe";
import { postRefresh } from "./handlers/postRefresh";
import { postRegister } from "./handlers/postRegister";
import { postLogin } from "./handlers/postLogin";

export const routes: Component = {

    "/": {
        post: {
            handler: post,
        },
    },

    "/login": {
        post: {
            handler: postLogin,
        },
    },

    "/refresh": {
        post: {
            handler: postRefresh,
        },
    },

    "/:id": {
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
