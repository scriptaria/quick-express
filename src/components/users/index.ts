import { Component } from "interfaces/component";
import { getIdPosts } from "./handlers/getIdPosts";
import { getMe } from "./handlers/getMe";
import { getMePosts } from "./handlers/getMePosts";

export const routes: Component = {

    "/me": {
        get: {
            middlewares: ["auth"],
            handler: getMe,
        },
    },

    "/me/posts": {
        get: {
            middlewares: ["auth"],
            handler: getMePosts,
        },
    },

    "/:id/posts": {
        get: {
            handler: getIdPosts,
        },
    },
};
