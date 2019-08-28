import * as tasks from "./modules/tasks";
import * as users from "./modules/users";

/**
 * Here are declared the main routes and their related modules.
 * In each of these modules are declared their sub routes, handlers and which middlewares they use.
 */
export const modules = [
    {
        path: "/users",
        component: users,
    },
    {
        path: "/tasks",
        component: tasks,
    },
];
