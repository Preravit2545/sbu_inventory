import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Request_Product() {
  const [ProductList, setProductList] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false); // New modal for "เบิก"
  const [approvalStatus, setApprovalStatus] = useState<string>(""); // State for approval dropdown

  const getProduct = () => {
    axios.get('http://localhost:3001/product').then((response) => {
      setProductList(response.data);
    });
  };

  const ViewingProduct = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleRequestProduct = (product: any) => {
    setSelectedProduct(product);
    setShowRequestModal(true);
  };

  const handleRequestClose = () => {
    setShowRequestModal(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="App">
        <h3 style={{ margin: '10px' }}>เบิกทรัพย์สิน</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>No.</th>
              <th>Images</th>
              <th>ชื่อทรัพย์สิน</th>
              <th>ประเภททรัพย์สิน</th>
              <th>จำนวน</th>
              <th>สถานะ</th>
              <th>อยู่ระหว่างดำเนินการ</th>
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
                <td style={{ color: val.status === 'มี' ? 'green' : 'red' }}>
                  {val.status}
                </td>
                <td>{val.pending}</td>
                <td>
                  <button className="btn btn-success" onClick={() => ViewingProduct(val)}>ดู</button>
                  <button
                    className="btn btn-info"
                    style={{ margin: '0 5px' }}
                    onClick={() => handleRequestProduct(val)} // Open the request modal
                    disabled={val.status === 'หมด'}
                  >
                    เบิก
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
            <p>
              <strong>สถานะ:</strong>
              <span style={{ color: selectedProduct.status === 'มี' ? 'green' : 'red' }}>
                {selectedProduct.status}
              </span>
            </p>
            <p><strong>อยู่ระหว่างดำเนินการ:</strong> {selectedProduct.pending}</p>
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

      {/* Request Product Modal */}
      {selectedProduct && (
        <Modal show={showRequestModal} onHide={handleRequestClose}>
          <Modal.Header>
            <Modal.Title>จัดการสถานะ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="approvalStatus">
                <Form.Label>สถานะ</Form.Label>
                <Form.Control
                  as="select"
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value)}
                >
                  <option value="">เลือก...</option>
                  <option value="อนุมัติ">อนุมัติ</option>
                  <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleRequestClose}>
              ปิด
            </Button>
            <Button variant="primary" onClick={() => alert(`สถานะ: ${approvalStatus}`)}>
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Request_Product;
