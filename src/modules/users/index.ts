import { Module } from "src/core/interfaces";
import { auth } from "src/middleware/auth";
import { getId } from "./handlers/getId";
import { getIdTasks } from "./handlers/getIdTasks";
import { post } from "./handlers/post";
import { postLogin } from "./handlers/postLogin";
import { postRefresh } from "./handlers/postRefresh";

export const module: Module = {
  route: "/users",
  endpoints: {
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
        middleware: [auth],
        handler: getId,
      },
    },

    "/:id/tasks": {
      get: {
        middleware: [auth],
        handler: getIdTasks,
      },
    },
  },
};
