import { Module } from "src/core/interfaces";
import { auth } from "src/middleware/auth";
import { deleteId } from "./handlers/deleteId";
import { get } from "./handlers/get";
import { getId } from "./handlers/getId";
import { patchId } from "./handlers/patchId";
import { post } from "./handlers/post";

export const module: Module = {
  route: "/tasks",
  endpoints: {
    "/": {
      get: {
        middleware: [auth],
        handler: get,
      },

      post: {
        middleware: [auth],
        handler: post,
      },
    },

    "/:id": {
      get: {
        middleware: [auth],
        handler: getId,
      },

      patch: {
        middleware: [auth],
        handler: patchId,
      },

      delete: {
        middleware: [auth],
        handler: deleteId,
      },
    },
  },
};
