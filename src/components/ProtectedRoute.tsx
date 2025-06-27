import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/status`, { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setAuthenticated(true);
          setUserRole(res.data.user.role);
        } else {
          setAuthenticated(false);
          setUserRole(null);
        }
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  if (userRole && !allowedRoles.includes(userRole)) { //if the user role is not in list of allowed roles,
    return <Navigate to={`/${userRole}`} replace />;  // navigate to their allowed role
  }

  return <>{children}</>; //if use is authenticated and role is allowed return nested route
};

export default ProtectedRoute;
