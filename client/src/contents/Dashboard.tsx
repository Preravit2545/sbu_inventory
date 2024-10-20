import axios from 'axios';
import { useState, useEffect } from 'react';

interface DashboardProps {
  userID: number | null;
  userType: 'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager' | null;
}

function Dashboard({ userType, userID }: DashboardProps) {
  const [staffCount, setStaffCount] = useState(0);
  const [StaffStockCount, setStaffStockCount] = useState(0);
  const [AdminCount, setAdminCount] = useState(0);
  const [ManagerCount, setManagerCount] = useState(0);
  const [employeeCount, setemployeeCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [request_ProductCount, setRequest_ProductCount] = useState(0);
  const [PendingUserProductCount, setPendingUserProductCount] = useState(0);
  const [ProductsStaffApprovedForUserCount, setProductsStaffApprovedForUserCount] = useState(0);
  const [ProductsManagerApprovedForUserCount, setProductsManagerApprovedForUserCount] = useState(0);
  const [ProductRefusedForUserCount, setProductRefusedForUserCount] = useState(0);
  const [ProductAvailableCount, setProductAvailableCount] = useState(0);
  const [ProductOutOfStockCount, setProductOutOfStockCount] = useState(0);
  const [StaffApprovedCount, setStaffApprovedCount] = useState(0);
  const [ManagerApprovedCount, setManagerApprovedCount] = useState(0);
  const [ProductRefusedCount, setProductRefusedCount] = useState(0);

  useEffect(() => {
    // Fetch staff count
    axios.get('http://localhost:3001/count/staff')
      .then(response => setStaffCount(response.data.count))
      .catch(error => console.error("There was an error fetching the staff count!", error));

    axios.get('http://localhost:3001/count/staff_stock')
      .then(response => setStaffStockCount(response.data.count))
      .catch(error => console.error("There was an error fetching the staff_stock count!", error));

    axios.get('http://localhost:3001/count/manager')
      .then(response => setManagerCount(response.data.count))
      .catch(error => console.error("There was an error fetching the manager count!", error));

    axios.get('http://localhost:3001/count/admin')
      .then(response => setAdminCount(response.data.count))
      .catch(error => console.error("There was an error fetching the admin count!", error));

    // Fetch product count
    axios.get('http://localhost:3001/count/products')
      .then(response => setProductCount(response.data.count))
      .catch(error => console.error("There was an error fetching the product count!", error));

    // Fetch employee count
    axios.get('http://localhost:3001/count/employees')
      .then(response => setemployeeCount(response.data.count))
      .catch(error => console.error("There was an error fetching the employee count!", error));

    // Fetch order count
    axios.get('http://localhost:3001/count/products_pending')
      .then(response => setRequest_ProductCount(response.data.count))
      .catch(error => console.error("There was an error fetching the product_request count!", error));

    //ของพนักงาน

    //รอดำเนินการของผู้ใช้
    axios.get(`http://localhost:3001/count/products_pending/${userID}`)
      .then(response => setPendingUserProductCount(response.data.count))
      .catch(error => console.error("There was an error fetching the products_pending count!", error));

    //ได้รับการอนุมัติจากเจ้าหน้าที่ของผู้ใช้
    axios.get(`http://localhost:3001/count/products_staff_approved/${userID}`)
      .then(response => setProductsStaffApprovedForUserCount(response.data.count))
      .catch(error => console.error("There was an error fetching the products_staff_approved id count!", error));

    //ได้รับการอนุมัติจากผู้จัดการของผู้ใช้
    axios.get(`http://localhost:3001/count/products_manager_approved/${userID}`)
      .then(response => setProductsManagerApprovedForUserCount(response.data.count))
      .catch(error => console.error("There was an error fetching the products_manager_approved id count!", error));

    axios.get(`http://localhost:3001/count/products_refused/${userID}`)
      .then(response => setProductRefusedForUserCount(response.data.count))
      .catch(error => console.error("There was an error fetching the products_refused count!", error));
    //จบ ของพนักงาน


    axios.get('http://localhost:3001/count/products_staff_approved')
      .then(response => setStaffApprovedCount(response.data.count))
      .catch(error => console.error("There was an error fetching the product_request count!", error));

    axios.get('http://localhost:3001/count/products_manager_approved')
      .then(response => setManagerApprovedCount(response.data.count))
      .catch(error => console.error("There was an error fetching the product_request count!", error));

    axios.get('http://localhost:3001/count/products_refused')
      .then(response => setProductRefusedCount(response.data.count))
      .catch(error => console.error("There was an error fetching the product_request count!", error));


      axios.get('http://localhost:3001/count/product_available')
      .then(response => setProductAvailableCount(response.data.count))
      .catch(error => console.error("There was an error fetching the product_request count!", error));
      
      axios.get('http://localhost:3001/count/product_out_of_stock')
      .then(response => setProductOutOfStockCount(response.data.count))
      .catch(error => console.error("There was an error fetching the product_request count!", error));

  }, []);

  return (
    <div>
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Dashboard</h1>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            {/* Small boxes (Stat box) */}
            <div className="row">

              {/*admin Dashboard*/}
              {userType === 'admin' && (
                <>

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-info">
                      <div className="inner">
                        <h3>{employeeCount}</h3>
                        <p>พนักงาน</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-person" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}


                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-danger">
                      <div className="inner">
                        <h3>{staffCount}</h3>
                        <p>เจ้าหน้าที่</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-person" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}


                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-success">
                      <div className="inner">
                        <h3>{StaffStockCount}</h3>
                        <p>เจ้าหน้าที่สต๊อก</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-person" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-warning">
                      <div className="inner">
                        <h3>{ManagerCount}</h3>
                        <p>ผู้จัดการ</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-person" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-dark">
                      <div className="inner">
                        <h3>{AdminCount}</h3>
                        <p>ผู้ดูแลระบบ</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-person" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                </>
              )}
              {/*employee Dashboard*/}
              {userType === 'employee' && (
                <>
                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-info">
                      <div className="inner">
                        <h3>{PendingUserProductCount}</h3>
                        <p>รอดำเนินการของฉัน</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-ios-clock" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-warning">
                      <div className="inner">
                        <h3>{ProductsStaffApprovedForUserCount}</h3>
                        <p>ได้รับการอนุมัติจากเจ้าหน้าที่ของฉัน</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-android-done" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-success">
                      <div className="inner">
                        <h3>{ProductsManagerApprovedForUserCount}</h3>
                        <p>ได้รับการอนุมัติจากผู้จัดการของฉัน</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-android-done-all" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-danger">
                      <div className="inner">
                        <h3>{ProductRefusedForUserCount}</h3>
                        <p>ปฏิเสธ</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-android-close" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}
                </>
              )}
              {/*staff_stock Dashboard*/}
              {userType === 'staff_stock' && (
                <>
                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-warning">
                      <div className="inner">
                        <h3>{productCount}</h3>
                        <p>ทรัพย์สิน</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-bag" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-success">
                      <div className="inner">
                        <h3>{ProductAvailableCount}</h3>
                        <p>มีอยู่</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-checkmark-circled" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-danger">
                      <div className="inner">
                        <h3>{ProductOutOfStockCount}</h3>
                        <p>หมด</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-android-cancel" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}
                </>
              )}
              {/*staff & manager Dashboard*/}
              {(userType === 'staff' || userType === 'manager') && (
                <>
                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-info">
                      <div className="inner">
                        <h3>{request_ProductCount}</h3>
                        <p>รอดำเนินการ</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-ios-clock" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-warning">
                      <div className="inner">
                        <h3>{StaffApprovedCount}</h3>
                        <p>ได้รับการอนุมัติจากเจ้าหน้าที่</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-android-done" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-success">
                      <div className="inner">
                        <h3>{ManagerApprovedCount}</h3>
                        <p>ได้รับการอนุมัติจากผู้จัดการ</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-android-done-all" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}

                  {/* ./col */}
                  <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-danger">
                      <div className="inner">
                        <h3>{ProductRefusedCount}</h3>
                        <p>ปฏิเสธ</p>
                      </div>
                      <div className="icon">
                        <i className="ion ion-android-close" />
                      </div>
                    </div>
                  </div>
                  {/* ./col */}
                </>
              )}


            </div>
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
      {/* /.content-wrapper */}
    </div>
  );
}

export default Dashboard;
