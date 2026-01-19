import { Navigate, Outlet } from "react-router-dom";
import { apiService } from "@/services/api";

const ProtectedRoute = () => {
  const isAuthenticated = apiService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
