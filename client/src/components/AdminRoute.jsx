import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export const AdminRoute = () => {
  const { loggedIn, checkTokenLoading, user } = useSelector((state) => state.user);

  if (checkTokenLoading) {
    return <LoadingSpinner />;
  }

  if (!loggedIn || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};