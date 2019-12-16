import { Component } from "src/core/interfaces";
import { getId } from "./handlers/getId";
import { getIdTasks } from "./handlers/getIdTasks";
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
            handler: getId,
        },
    },

    "/:id/tasks": {
        get: {
            handler: getIdTasks,
        },
    },
};
