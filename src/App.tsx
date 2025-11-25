import React from "react";
import { Home, Login, PageChat, Profile } from "./Pages";
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
      path: "/page-chat",
      element: (
        <ProtectedRoute>
          <PageChat />
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
