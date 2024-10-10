import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

import Header from './components/Header';
import SideNav from './components/SideNav';
import Footer from './components/Footer';
import Dashboard from './contents/Dashboard';
import UserManagement from './contents/UserManagement';
import ProductManagement from './contents/ProductManagement';
import LoginForm from './contents/Login/LoginForm';
import Approval_Product from './contents/Approval_Product';
import Request_Product from './contents/Request_Product';
import Return_Product from './contents/Return_Product';
import ProtectedRoute from './contents/ProtectedRoute';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager' | null>('staff');
  const [userName, setUserName] = useState<string>('');
  const [userImage, setUserImage] = useState<string | null>(null);

  const handleLogin = (userType: 'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager', name: string, image: string | null) => {
    setIsLoggedIn(true);
    setUserType(userType); // Set userType after login
    setUserName(name); // Set user's real name
    setUserImage(image); // Set user's image
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null); // Reset userType on logout
    setUserName(''); // Reset user's real name
    setUserImage(null); // Reset user's image
  };

  return (
    <div className="App">
      {location.pathname !== '/' && <Header />}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UserManagement"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProductManagement"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Approval_Product"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Approval_Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Request_Product"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Request_Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Return_Product"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Return_Product />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {location.pathname !== '/' && isLoggedIn && 
        <SideNav 
          userType={userType} 
          userName={userName} 
          userImage={userImage} 
          onLogout={handleLogout} 
        />
      }
      {/* <Footer /> */}
    </div>
  );
}

export default App;
