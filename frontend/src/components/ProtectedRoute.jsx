import { Navigate } from "react-router-dom";
import { getAuthState } from "../lib/auth";

const ProtectedRoute = ({ element, allowedRole }) => {
  const { token, role } = getAuthState();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
