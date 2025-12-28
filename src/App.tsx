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
