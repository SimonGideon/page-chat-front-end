import { useEffect, type ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { createConsumer } from "@rails/actioncable";

import { Loader } from "@/components";
import { getCurrentUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useToast } from "@/components/ui/use-toast";

type ProtectedRouteProps = {
  children: ReactElement;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const { user, token, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const { toast } = useToast();

  // Effect 1: Restore User Session
  useEffect(() => {
    // If we have a token but no user, fetch the current user
    if (token && !user && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user, loading]);

  // Effect 2: Notification Subscription
  useEffect(() => {
    if (!user || !token) return;

    const cable = createConsumer(`ws://localhost:3000/cable?token=${token}`);
    
    const subscription = cable.subscriptions.create(
      { channel: "NotificationChannel" },
      {
        received: (data: any) => {
          // Show toast notification
          toast({
            title: "New Notification",
            description: data.message,
            duration: 5000,
            // You can add action/onClick here to navigate to the item
            // e.g. using useNavigate() to data.redirect_info
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      cable.disconnect();
    };
  }, [user, token, toast]);

  // Render Logic

  // If no token at all, redirect to signin
  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
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
  return <Navigate to="/signin" state={{ from: location }} replace />;
};

export default ProtectedRoute;
