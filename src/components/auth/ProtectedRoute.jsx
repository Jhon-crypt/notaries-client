import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // TODO: Replace with actual authentication logic
  // For now, check if user is logged in (stored in localStorage or context)
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

