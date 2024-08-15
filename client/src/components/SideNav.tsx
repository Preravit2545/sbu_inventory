import { Link } from "react-router-dom";

function SideNav() {
  return (
    <div>
      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{ position: 'fixed' }}>
        {/* Brand Logo */}
        <Link to="/" className="brand-link">
          <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">SBU</span>
        </Link>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              <a href="#" className="d-block">Preravit</a>
            </div>
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              {/* Add icons to the links using the .nav-icon class
              with font-awesome or any other icon font library */}

              <li className="nav-header">Menu</li>
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="nav-icon ion ion-pie-graph" />
                  <p>
                      Dashboard
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="ProductManagement" className="nav-link">
                  <i className="nav-icon ion ion-clipboard" />
                  <p>
                      จัดการข้อมูลทรัพย์สิน
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="UserManagement" className="nav-link">
                  <i className="nav-icon ion ion-person-add" />
                  <p>
                    จัดการข้อมูลผู้ใช้
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
}

export default SideNav;
