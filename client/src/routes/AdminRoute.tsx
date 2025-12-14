
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state: RootState) => state.user.isAuthenticated);
  const user = useAppSelector((state: RootState) => state.user.user);

  if (!isAuthenticated) {
    return <Navigate to="/account" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
