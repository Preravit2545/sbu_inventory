import { Link, useNavigate } from 'react-router-dom';

interface SideNavProps {
  userType: 'staff' | 'teacher' | 'admin' | null;
}

function SideNav({ userType }: SideNavProps) {
  const navigate = useNavigate();

  // Logout function to clear user session and navigate to the login page
  const handleLogout = () => {
    // Clear localStorage/sessionStorage or cookie
    localStorage.removeItem('token'); // Example, adjust based on your authentication mechanism
    navigate('/'); // Redirect to login page
  };

  if (!userType) return null;

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{ position: 'fixed' }}>
        {/* Brand Logo */}
        <Link to="/" className="brand-link">
          <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">SBU</span>
        </Link>

        {/* Sidebar */}
        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-header">Menu</li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  <i className="nav-icon ion ion-pie-graph" />
                  <p>Dashboard</p>
                </Link>
              </li>

              {/* Conditionally render based on userType */}
              {userType === 'staff' && (
                <>
                  <li className="nav-item">
                    <Link to="/ProductManagement" className="nav-link">
                      <i className="nav-icon ion ion-clipboard" />
                      <p>จัดการข้อมูลทรัพย์สิน</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/Approval_Product" className="nav-link">
                      <i className="nav-icon ion ion-checkmark" />
                      <p>อนุมัติทรัพย์สิน</p>
                    </Link>
                  </li>
                </>
              )}

              {userType === 'teacher' && (
                <>
                  <li className="nav-item">
                    <Link to="/Request_Product" className="nav-link">
                      <i className="nav-icon ion ion-bag" />
                      <p>เบิกทรัพย์สิน</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/Return_Product" className="nav-link">
                      <i className="nav-icon ion ion-arrow-return-left"/>
                      <p>คืน</p>
                    </Link>
                  </li>
                </>
              )}

              {userType === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link to="/ProductManagement" className="nav-link">
                      <i className="nav-icon ion ion-clipboard" />
                      <p>จัดการข้อมูลทรัพย์สิน</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/UserManagement" className="nav-link">
                      <i className="nav-icon ion ion-person-add" />
                      <p>จัดการข้อมูลผู้ใช้</p>
                    </Link>
                  </li>
                </>
              )}   
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default SideNav;
