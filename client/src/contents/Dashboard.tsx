import axios from 'axios';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [staffCount, setStaffCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    // Fetch staff count
    axios.get('http://localhost:3001/count/staff')
      .then(response => setStaffCount(response.data.count))
      .catch(error => console.error("There was an error fetching the staff count!", error));

    // Fetch product count
    axios.get('http://localhost:3001/count/products')
      .then(response => setProductCount(response.data.count))
      .catch(error => console.error("There was an error fetching the product count!", error));

    // Fetch teacher count
    axios.get('http://localhost:3001/count/teachers')
      .then(response => setTeacherCount(response.data.count))
      .catch(error => console.error("There was an error fetching the teacher count!", error));

    // Fetch order count
    axios.get('http://localhost:3001/count/orders')
      .then(response => setOrderCount(response.data.count))
      .catch(error => console.error("There was an error fetching the order count!", error));
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
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
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
              <div className="col-lg-3 col-6">
                {/* small box */}
                <div className="small-box bg-info">
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
              <div className="col-lg-3 col-6">
                {/* small box */}
                <div className="small-box bg-success">
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
              <div className="col-lg-3 col-6">
                {/* small box */}
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>{teacherCount}</h3>
                    <p>อาจารย์</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-man" />
                  </div>
                </div>
              </div>
              {/* ./col */}
              <div className="col-lg-3 col-6">
                {/* small box */}
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h3>{orderCount}</h3>
                    <p>ใบเบิกจ่ายทรัพย์สิน</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-pie-graph" />
                  </div>
                </div>
              </div>
              {/* ./col */}
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
