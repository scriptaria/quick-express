import { Component } from "../../core/interfaces";
import { getCheckAccess } from "./handlers/getCheckAccess";
import { postLogin } from "./handlers/postLogin";
import { postRefresh } from "./handlers/postRefresh";
import { postRegister } from "./handlers/postRegister";

export const routes: Component = {

    "/check/:access": {
        get: {
            handler: getCheckAccess,
        },
    },

    "/refresh": {
        post: {
            handler: postRefresh,
        },
    },

    "/register": {
        post: {
            handler: postRegister,
        },
    },

    "/login": {
        post: {
            handler: postLogin,
        },
    },
};
