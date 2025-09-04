// src/routes/adminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.mustChangePassword) return <Navigate to="/change-password" replace />;
  if (user?.role !== "admin") return <Navigate to="/not-authorized" replace />;

  return children;
}
