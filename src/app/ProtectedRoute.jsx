import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../shared/components/ui/PageLoader";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, role } = useAuth();

  if (user === undefined) return <PageLoader />;

  if (!user) return <Navigate to="/login" replace />;

  if (role === null) return <PageLoader />;

  if (adminOnly && role !== "admin") return <Navigate to="/" replace />;

  return children;
}
