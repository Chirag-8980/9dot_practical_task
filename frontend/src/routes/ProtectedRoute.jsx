import { Navigate, Outlet } from "react-router-dom";
import Layout from "../Layout";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token"); // Replace with actual auth logic

  return isAuthenticated ? (<Layout/>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
