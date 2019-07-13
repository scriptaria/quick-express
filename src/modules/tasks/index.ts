import { Component } from "../../core/interfaces";
import { deleteId } from "./handlers/deleteId";
import { get } from "./handlers/get";
import { getId } from "./handlers/getId";
import { patchId } from "./handlers/patchId";
import { post } from "./handlers/post";
import { putId } from "./handlers/putId";

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
            handler: getId,
        },

        patch: {
            middlewares: ["auth"],
            handler: patchId,
        },

        put: {
            middlewares: ["auth"],
            handler: putId,
        },

        delete: {
            middlewares: ["auth"],
            handler: deleteId,
        },

    },
};
