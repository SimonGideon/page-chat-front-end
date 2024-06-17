import React from "react";
import { Home } from "./components/Pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
  ]);
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default App;
