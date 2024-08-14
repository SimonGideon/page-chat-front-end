import React from "react";
import { Home, Login, UserDashboard, Profile } from "./Pages";
import { Favorite, Announcements, Settings } from "@/components";
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
          <UserDashboard />
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
