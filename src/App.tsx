import React from "react";
import {
  ActivateAccount,
  ForgotPassword,
  Home,
  Login,
  PageChat,
  Profile,
  ResetPassword,
  SignUp,
  ReadBook,
} from "./Pages";
import GoogleAuthCallback from "./Pages/Auth/GoogleAuthCallback";
import CompleteProfile from "./Pages/Auth/CompleteProfile";
import { Favorite, Announcements, Settings } from "./Pages/Profile/components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/lib";

import "./App.css";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/signin",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/activate-account",
      element: <ActivateAccount />,
    },
    {
      // Google redirects back to /auth/google/callback?token=<JWT>
      // This page reads the token and logs the user in
      path: "/auth/google/callback",
      element: <GoogleAuthCallback />,
    },
    {
      // Google users with incomplete profiles land here to fill in
      // phone, address, country, city, gender, date of birth
      path: "/complete-profile",
      element: <CompleteProfile />,
    },
    {
      path: "/profile",
      element: <Profile />,
      children: [
        {
          path: "notifications",
          element: <Announcements />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        {
          path: "favorites",
          element: <Favorite />,
        },
        {
          path: "reviews",
          element: <Favorite />, // Using placeholder or wrapper if Reviews component needs props
        },
        {
          path: "engagements",
          element: <Favorite />, // Placeholder
        },
        {
          index: true,
          element: <Favorite />, 
        },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <PageChat />
        </ProtectedRoute>
      ),
    },
    {
      path: "/read/:id",
      element: (
        <ProtectedRoute>
          <ReadBook />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <React.StrictMode>
      <Toaster />
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default App;
