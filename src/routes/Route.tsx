import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface RouteProps {
  children: ReactElement<Element>;
  redirectTo: string;
}

export default function PrivateRoute({
  children,
  redirectTo,
}: RouteProps): any {
  const token = localStorage.getItem("@ProductionLine:token");

  return token ? children : <Navigate to={redirectTo} />;
}
