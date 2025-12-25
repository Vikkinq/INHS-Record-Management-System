import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../layouts/LoadingSpinner";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show a loading state while Firebase restores the session
  if (loading) {
    return <LoadingSpinner label="Checking authentication..." />;
  }

  // Redirect to login if user is not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
