import { useState, useEffect } from "react";
import axios from "axios";

function Request_Product() {
  const [ProductList, setProductList] = useState<any[]>([]);

  const getProduct = () => {
    axios.get('http://localhost:3001/product').then((response) => {
      setProductList(response.data);
    });
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="App">
        <h3 style={{margin: '10px' }}>จัดการข้อมูลทรัพย์สิน</h3>
        <button className="btn btn-primary" style={{ marginBottom: '10px' }}>
          Add Item +
        </button>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>No.</th>
              <th>Images</th>
              <th>รหัส</th>
              <th>ชื่อทรัพย์สิน</th>
              <th>จำนวน</th>
              <th>สถานะ</th>
              <th>ถูกใช้อยู่</th>
              <th>อยู่ระหว่างดำเนินการ</th>
              <th>คงเหลือ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {ProductList.map((val, key) => (
              <tr key={key}>
                <td>{key + 1}</td>
                <td>
                  {val.image && (
                    <img
                      src={`data:image/jpeg;base64,${val.image}`}
                      alt={val.name}
                      style={{ width: '50px', height: '50px' }}
                    />
                  )}
                </td>
                <td>{val.id}</td>
                <td>{val.name}</td>
                <td>{val.qty}</td>
                <td>{val.status}</td>
                <td>{val.inuse}</td>
                <td>{val.pending}</td>
                <td>{val.remain}</td>
                <td>
                  <button className="btn btn-success">View</button>
                  <button className="btn btn-info" style={{ margin: '0 5px' }}>
                    Use
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Request_Product;
