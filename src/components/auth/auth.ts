import { Component } from "interfaces/component";
import { getCheckToken } from "./handlers/getCheckToken";
import { postLogin } from "./handlers/postLogin";
import { postRefresh } from "./handlers/postRefresh";
import { postRegister } from "./handlers/postRegister";

export const routes: Component = {

    "/check/:token": {
        get: {
            handler: getCheckToken,
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
