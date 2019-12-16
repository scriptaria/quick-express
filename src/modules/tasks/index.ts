import { Component } from "src/core/interfaces";
import { deleteId } from "./handlers/deleteId";
import { get } from "./handlers/get";
import { getId } from "./handlers/getId";
import { patchId } from "./handlers/patchId";
import { post } from "./handlers/post";

export const routes: Component = {

    "/": {
        get: {
            middlewares: ["auth"],
            handler: get,
        },

        post: {
            middlewares: ["auth"],
            handler: post,
        },
    },

    "/:id": {
        get: {
            middlewares: ["auth"],
            handler: getId,
        },

        patch: {
            middlewares: ["auth"],
            handler: patchId,
        },

        delete: {
            middlewares: ["auth"],
            handler: deleteId,
        },
    },
};
