import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "admin" | "selector";
}

interface JwtPayload {
  id: number;
  type: "admin" | "selector";
  exp: number;
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const token = Cookies.get("token");

  const redirectTo =
    role === "admin" ? "/auth/loginAdmin" : "/auth/loginSelector";

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  try {
    const user = jwtDecode<JwtPayload>(token);
    //Expiration Check

    const isExpired = user.exp * 1000 < Date.now();

    if (isExpired) {
      Cookies.remove("token");
      return <Navigate to={redirectTo} replace />;
    }

    //Role Check

    if (user.type !== role) {
      return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
  } catch {
    Cookies.remove("token");
    return <Navigate to={redirectTo} replace />;
  }
};
