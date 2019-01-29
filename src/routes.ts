import * as auth from "./components/auth/auth";
import * as posts from "./components/posts/posts";

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
        path: "/posts",
        component: posts,
    },
];
