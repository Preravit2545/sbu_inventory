import { Link, useNavigate } from 'react-router-dom';

interface SideNavProps {
  userID: number | null; // Add userID prop
  userType: 'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager' | null;
  userName: string;
  userImage: string | null;
  onLogout: () => void;
}

function SideNav({ userID, userType, userName, userImage, onLogout }: SideNavProps) {
  const navigate = useNavigate();

  if (!userType) return null;

  const handleLogout = () => {
    onLogout();
    navigate('/'); // Redirect to login page after logging out
  };

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{ position: 'fixed' }}>
        {/* Brand Logo */}
        <Link to="/" className="brand-link">
          {/* Image User */}
          {userImage ? (
            <img
              src={`data:image/jpeg;base64,${userImage}`}
              alt="User"
              className="brand-image img-circle elevation-3"
              style={{ opacity: '.8' }}
            />
          ) : (
            <img
              src="dist/img/AdminLTELogo.png"
              alt="AdminLTE Logo"
              className="brand-image img-circle elevation-3"
              style={{ opacity: '.8' }}
            />
          )}
          {/* name */}
          <span className="brand-text font-weight-light">{userID}{userName}</span>
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
                    <Link to="/Approval_Staff_List" className="nav-link">
                      <i className="nav-icon ion ion-checkmark" />
                      <p>อนุมัติทรัพย์สิน</p>
                    </Link>
                  </li>
                </>
              )}

              {userType === 'employee' && (
                <>
                  <li className="nav-item">
                    <Link to="/Request_Product" className="nav-link">
                      <i className="nav-icon ion ion-bag" />
                      <p>เบิกทรัพย์สิน</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/Approval_Staff_List" className="nav-link">
                      <i className="nav-icon ion ion-arrow-return-left" />
                      <p>ดูรายการขอเบิก</p>
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

              {/* Logout Button */}
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                  <i className="nav-icon ion ion-log-out" />
                  <p>Logout</p>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default SideNav;
