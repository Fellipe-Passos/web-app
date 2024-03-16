import CreateUserPassword from "../../pages/public/CreateUserPassword";
import ForgotPassword from "../../pages/public/ForgotPassword";
import Login from "../../pages/public/Login";
import { RoutesType } from "../../types/routesTypes";

export const publicRoutes: RoutesType[] = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/create-password",
    element: <CreateUserPassword />,
  },
];
