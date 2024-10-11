import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal"; // If you're using Bootstrap for modals
import Button from "react-bootstrap/Button"; // Bootstrap button


function Request_Product() {
  const [ProductList, setProductList] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const getProduct = () => {
    axios.get('http://localhost:3001/product').then((response) => {
      setProductList(response.data);
    });
  };

  const ViewingProduct = (product: any) => {
    setSelectedProduct(product); // Set the selected product details
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedProduct(null); // Clear the selected product
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="App">
        <h3 style={{margin: '10px' }}>จัดการข้อมูลทรัพย์สิน</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>No.</th>
              <th>Images</th>
              <th>ชื่อทรัพย์สิน</th>
              <th>ประเภททรัพย์สิน</th>
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
                <td>{val.name}</td>
                <td>{val.type}</td>
                <td>{val.qty}</td>
                <td>{val.status}</td>
                <td>{val.inuse}</td>
                <td>{val.pending}</td>
                <td>{val.remain}</td>
                <td>
                  <button className="btn btn-success" onClick={() => ViewingProduct(val)}>View</button>
                  <button className="btn btn-info" style={{ margin: '0 5px' }}>
                    Use
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ViewingProduct Modal */}
      {selectedProduct && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header>
            <Modal.Title>รายละเอียดทรัพย์สิน</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>ชื่อทรัพย์สิน:</strong> {selectedProduct.name}</p>
            <p><strong>ประเภททรัพย์สิน:</strong> {selectedProduct.type}</p>
            <p><strong>จำนวน:</strong> {selectedProduct.qty}</p>
            <p><strong>สถานะ:</strong> {selectedProduct.status}</p>
            <p><strong>ถูกใช้อยู่:</strong> {selectedProduct.inuse}</p>
            <p><strong>อยู่ระหว่างดำเนินการ:</strong> {selectedProduct.pending}</p>
            <p><strong>คงเหลือ:</strong> {selectedProduct.remain}</p>
            {selectedProduct.image && (
              <img
                src={`data:image/jpeg;base64,${selectedProduct.image}`}
                alt={selectedProduct.name}
                style={{ width: '100px', height: '100px' }}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Request_Product;
