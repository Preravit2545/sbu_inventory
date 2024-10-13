import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface RequestProductProps {
  userID: number | null; // Define the userID prop type
}

const Request_Product: React.FC<RequestProductProps> = ({ userID }) => {
  const [ProductList, setProductList] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestQty, setRequestQty] = useState<number>(0);
  const [requestReason, setRequestReason] = useState<string>("");

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
    setRequestQty(0);
    setRequestReason("");
  };

  const handleRequestClose = () => {
    setShowRequestModal(false);
    setSelectedProduct(null);
    setRequestReason("");
  };

  const handleSubmitRequest = () => {
  if (requestQty > 0 && requestQty <= selectedProduct.qty) {
    const employeeId = userID; // Assuming you have userID available in this scope
    const productId = selectedProduct.id; // Make sure your selectedProduct contains the id

    // Prepare the data to send
    const requestData = {
      employee_id: employeeId,
      product_id: productId,
      quantity: requestQty,
      reason: requestReason,
    };

    axios.post('http://localhost:3001/request-product', requestData)
      .then(response => {
        alert(response.data.message);
        setShowRequestModal(false);
        // Optionally, you may want to refresh the product list here
        getProduct();
      })
      .catch(error => {
        alert('Error submitting request: ' + error.message);
      });
  } else {
    alert('จำนวนที่ต้องการเบิกไม่ถูกต้อง');
  }
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
                    onClick={() => handleRequestProduct(val)}
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
            <Modal.Title>การเบิกจ่าย</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Display selected product image and name */}
            {selectedProduct.image && (
              <div className="mb-3">
                <img
                  src={`data:image/jpeg;base64,${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  style={{ width: '100px', height: '100px', marginRight: '10px' }}
                />
                <span><strong>ชื่อ:</strong> {selectedProduct.name}</span>
                <p>
                <span> <strong>จำนวนที่สามารถเบิกได้:</strong> {selectedProduct.qty}</span>
                </p>
              </div>
            )}
            <Form>
              <Form.Group controlId="requestQty">
                <Form.Label>จำนวนที่ต้องการเบิก</Form.Label>
                <Form.Control
                  type="number"
                  value={requestQty}
                  min="1"
                  max={selectedProduct.qty}
                  onChange={(e) => setRequestQty(Number(e.target.value))}
                  placeholder="ระบุจำนวนที่ต้องการเบิก"
                />
              </Form.Group>
              <Form.Group controlId="requestReason">
                <Form.Label>เหตุผลที่เบิก</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="ระบุเหตุผลที่ต้องการเบิก"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleRequestClose}>
              ปิด
            </Button>
            <Button variant="primary" onClick={handleSubmitRequest}>
              ส่งคำขอเบิก
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Request_Product;
