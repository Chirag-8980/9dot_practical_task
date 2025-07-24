import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = localStorage.getItem("token"); // Check auth status

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
