import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps dashboard routes — redirects to /login if there's no authenticated user.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-slate-500 dark:text-slate-400 text-sm">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
