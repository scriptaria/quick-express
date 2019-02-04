import * as auth from "./modules/auth";
import * as posts from "./modules/posts";
import * as users from "./modules/users";

/**
 * Here are declared the main routes and their related modules.
 * In each of these modules are declared their sub routes, handlers and which middlewares they use.
 */
export const modules = [
    {
        path: "/auth",
        component: auth,
    },
    {
        path: "/users",
        component: users,
    },
    {
        path: "/posts",
        component: posts,
    },
];
