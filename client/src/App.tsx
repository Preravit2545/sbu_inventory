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
import OrderForm from './contents/OrderForm';  // Import OrderForm

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
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
          <Route path="/OrderForm" element={<OrderForm />} />  {/* Add OrderForm route */}
        </Routes>
      </main>
      {location.pathname !== '/' && <SideNav />}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
