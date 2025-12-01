import { useEffect, type ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { Loader } from "@/components";
import { getCurrentUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type ProtectedRouteProps = {
  children: ReactElement;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const { user, token, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but no user, fetch the current user
    if (token && !user && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user, loading]);

  // If no token at all, redirect to signin
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // If we have a token and are loading the user, show loader
  if (loading || (!user && token)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // If we have both token and user, render children
  if (user) {
    return children;
  }

  // Fallback - shouldn't reach here normally
  return <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
