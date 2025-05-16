import { Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/NavigationContext';

export const ProtectedRoute = ({ children }) => {
  const { token } = useStateContext();

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};