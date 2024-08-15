import './App.css';

import Header from './components/Header';
import SideNav from './components/SideNav';
import Footer from './components/Footer';
import Dashboard from './contents/Dashboard';
import UserManagement from './contents/UserManagement';
import ProductManagement from './contents/ProductManagement';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Routes,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
      <Routes>
        <Route path='/' element={<Dashboard/>}></Route>
        <Route path='UserManagement' element={<UserManagement/>}></Route>
        <Route path='ProductManagement' element={<ProductManagement/>}></Route>
      </Routes>
      </main>
      <SideNav />
      <Footer />
    </div>
  );
}

export default App;
