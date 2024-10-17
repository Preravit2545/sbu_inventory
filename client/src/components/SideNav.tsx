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

              {/* พนักงาน Employee*/}
              {userType === 'employee' && (
                <>
                  <li className="nav-header">หน้าพนักงาน</li>
                  <li className="nav-item">
                    <Link to="/Request_Product" className="nav-link">
                      <i className="nav-icon ion ion-android-add-circle" />
                      <p>เบิกทรัพย์สิน</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/Approval_Employee_List" className="nav-link">
                      <i className="nav-icon ion ion-android-clipboard" />
                      <p>รายการคำขอเบิกของคุณ</p>
                    </Link>
                  </li>
                </>
              )}

              {/* เจ้าหน้าที่ Staff*/}
              {userType === 'staff' && (
                <>
                  <li className="nav-header">หน้าเจ้าหน้าที่</li>
                  <li className="nav-item">
                    <Link to="/Approval_Staff_List" className="nav-link">
                      <i className="nav-icon ion ion-checkmark" />
                      <p>{"อนุมัติทรัพย์สิน (Staff)"}</p>
                    </Link>
                  </li>
                </>
              )}

              {/* เจ้าหน้าที่สต๊อก Staff_stock*/}
              {userType === 'staff_stock' && (
                <>
                  <li className="nav-header">หน้าเจ้าหน้าที่สต๊อก</li>
                  <li className="nav-item">
                    <Link to="/ProductManagement" className="nav-link">
                      <i className="nav-icon ion ion-clipboard" />
                      <p>จัดการข้อมูลทรัพย์สิน</p>
                    </Link>
                  </li>
                </>
              )}

              {/* ผู้จัดการ Manager */}
              {userType === 'manager' && (
                <>
                  <li className="nav-header">หน้าผู้จัดการ</li>
                  <li className="nav-item">
                    <Link to="/Approval_Manager_List" className="nav-link">
                      <i className="nav-icon ion ion-bag" />
                      <p>{"อนุมัติทรัพย์สิน (Manager)"}</p>
                    </Link>
                  </li>
                </>
              )}

              {/* ผู้ดูแลระบบ Admin */}
              {userType === 'admin' && (
                <>
                  <li className="nav-header">หน้าผู้ดูแลระบบ</li>
                  <li className="nav-item">
                    <Link to="/UserManagement" className="nav-link">
                      <i className="nav-icon ion ion-person-add" />
                      <p>จัดการข้อมูลผู้ใช้</p>
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-header">จัดการข้อมูลส่วนตัว</li>
              <li className="nav-item">
                <Link to="/EditUserForm" className="nav-link">
                  <i className="nav-icon ion ion-android-settings" />
                  <p>แก้ไขข้อมูลส่วนตัว</p>
                </Link>
              </li>

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
