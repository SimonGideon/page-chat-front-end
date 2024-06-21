import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    // If no token, redirect to the login page
    return <Navigate to="/signin" />;
  }

  // If authenticated, render the children components
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
