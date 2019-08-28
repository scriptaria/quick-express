import { Component } from "../../core/interfaces";
import { getIdTasks } from "./handlers/getIdTasks";
import { getMe } from "./handlers/getMe";
import { post } from "./handlers/post";
import { postLogin } from "./handlers/postLogin";
import { postRefresh } from "./handlers/postRefresh";

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
