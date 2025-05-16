/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";

export const GuestLayout = () => {
  const { token } = useStateContext();
  
  // Redirect to dashboard if user is already logged in
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};
