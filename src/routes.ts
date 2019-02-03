import * as auth from "./components/auth";
import * as posts from "./components/posts";
import * as users from "./components/users";

/**
 * Here are declared the main routes and their related components.
 * In each of these components are declared their sub routes, handlers and which middlewares they use.
 */
export const routes = [
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
