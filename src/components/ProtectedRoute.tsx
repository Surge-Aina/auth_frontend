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
    //axios.get('http://localhost:5000/auth/status', { withCredentials: true })
    axios.get('https://auth-backend-zqbv.onrender.com/api/auth/status', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setAuthenticated(true);
          setUserRole(res.data.user.role);
        } else {
          setAuthenticated(false);
        }
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!authenticated || (userRole && !allowedRoles.includes(userRole))) {
    return <Navigate to={`/${userRole || 'login'}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
