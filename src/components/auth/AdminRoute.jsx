import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const AdminRoute = ({ children }) => {
  // First check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  if (userRole !== 'admin') {
    // Redirect non-admin users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;

