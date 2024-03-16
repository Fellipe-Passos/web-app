// import { homeRoutes } from "./private";
import { homeRoutes } from "./private";
import { publicRoutes } from "./public";

export const routes = [
    ...publicRoutes,
    ...homeRoutes
]