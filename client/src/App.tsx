import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import SideNav from './components/SideNav';
import Footer from './components/Footer';
import Dashboard from './contents/Dashboard';
import UserManagement from './contents/UserManagement';
import ProductManagement from './contents/ProductManagement';
import LoginForm from './contents/Login/LoginForm';
import EditUserForm from './contents/EditUserForm';
import Request_Product from './contents/Request_Product';
import ProtectedRoute from './contents/ProtectedRoute';
import ApprovalStaffList from './contents/Approval_Staff_List';
import ApprovalEmployeeList from './contents/Approval_Employee_List';
import ApprovalManagerList from './contents/Approval_Manager_List';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState<number | null>(null); // Add userID state
  const [userType, setUserType] = useState<'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager' | null>('staff');
  const [userName, setUserName] = useState<string>('');
  const [userImage, setUserImage] = useState<string | null>(null);

  const handleLogin = (userID: number, userType: 'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager', name: string, image: string | null) => {
    setIsLoggedIn(true);
    setUserID(userID); // Set userID after login
    setUserType(userType); // Set userType after login
    setUserName(name); // Set user's real name
    setUserImage(image); // Set user's image
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserID(null); // Reset userID on logout
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
                <Dashboard userType={userType} userID={userID} />
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
            path="/EditUserForm"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <EditUserForm userID={userID} userType={userType}/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Request_Product"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Request_Product userID={userID} /> {/* Pass userID here */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/Approval_Staff_List"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ApprovalStaffList userID={userID} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Approval_Manager_List"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ApprovalManagerList userID={userID} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Approval_Employee_List"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ApprovalEmployeeList userID={userID} />
              </ProtectedRoute>
            }
          />
        </Routes>
        
      </main>
      {location.pathname !== '/' && isLoggedIn &&
        <SideNav
          userID={userID}
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
