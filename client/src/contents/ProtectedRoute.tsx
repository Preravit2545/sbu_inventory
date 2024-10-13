import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  isLoggedIn: boolean;
  children: React.ReactNode; // Change this to React.ReactNode to allow multiple children
};

const ProtectedRoute = ({ isLoggedIn, children }: ProtectedRouteProps) => {
  return isLoggedIn ? <>{children}</> : <Navigate to="/" />; // Wrap children in a fragment
};

export default ProtectedRoute;
