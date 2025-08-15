import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  allowedRoles?: string[]; // nếu không truyền thì mặc định chỉ yêu cầu login
  children: React.ReactNode;
  
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    // Chưa login thì về trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu có allowedRoles thì check role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
