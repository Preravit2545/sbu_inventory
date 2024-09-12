import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  isLoggedIn: boolean;
  children: JSX.Element;
};

const ProtectedRoute = ({ isLoggedIn, children }: ProtectedRouteProps) => {
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
