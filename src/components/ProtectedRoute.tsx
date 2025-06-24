import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // TODO: Replace with session/context-based role check
  // For now, fallback to unauthenticated
  return <Navigate to="/" replace />;
};

export default ProtectedRoute; 