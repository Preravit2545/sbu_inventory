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

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'staff' | 'teacher' | 'admin'>('staff');

  const handleLogin = (userType: 'staff' | 'teacher' | 'admin') => {
    setIsLoggedIn(true);
    setUserType(userType); // Set userType after login
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/ProductManagement" element={<ProductManagement />} />
          <Route path="/Approval_Product" element={<Approval_Product />} />
          <Route path="/Request_Product" element={<Request_Product />} />
          <Route path="/Return_Product" element={<Return_Product />} />
        </Routes>
      </main>
      {location.pathname !== '/' && isLoggedIn && <SideNav userType={userType} />}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
