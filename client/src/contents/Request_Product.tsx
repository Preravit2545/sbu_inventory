import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./css/Request_Product.css";

interface RequestProductProps {
  userID: number | null;
}

const Request_Product: React.FC<RequestProductProps> = ({ userID }) => {
  const [productList, setProductList] = useState<any[]>([]);
  const [filteredProductList, setFilteredProductList] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestQty, setRequestQty] = useState<number>(0);
  const [requestReason, setRequestReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("ทั้งหมด");
  const [showSearch, setShowSearch] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  const getProduct = async () => {
    try {
      const response = await axios.get('http://localhost:3001/product');
      setProductList(response.data);
      setFilteredProductList(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error fetching products',
        text: 'There was an error retrieving the product list. Please try again later.',
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleRequestClose = () => {
    setShowRequestModal(false);
    setSelectedProduct(null);
    setRequestQty(0);
    setRequestReason("");
  };

  const handleSubmitRequest = async () => {
    if (requestQty > 0 && requestQty <= selectedProduct.qty) {

      const reason = requestReason === "อื่นๆ" ? otherReason : requestReason;

      const requestData = {
        employee_id: userID,
        product_id: selectedProduct.id,
        quantity: requestQty,
        reason: reason,
      };

      try {
        const response = await axios.post('http://localhost:3001/request-product', requestData);
        Swal.fire({
          icon: 'success',
          title: 'Request Submitted',
          text: response.data.message,
        });
        setShowRequestModal(false);
        getProduct(); // Optionally refresh product list
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error submitting request',
          text: 'There was an error submitting your request. Please try again.',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid quantity',
        text: 'Please enter a valid quantity.',
      });
    }
  };

  const toggleSearchAndFilters = () => {
    setShowSearch((prev) => !prev);
    setShowFilters((prev) => !prev);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = productList.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProductList(filtered);
    } else {
      setFilteredProductList(productList);
    }
  };

  const handleFilterByType = (type: string) => {
    setSelectedType(type);
    if (type === "All") {
      setFilteredProductList(productList);
    } else {
      const filtered = productList.filter((product) => product.type === type);
      setFilteredProductList(filtered);
    }
  };

  const handleFilterByStatus = (status: string) => {
    setSelectedStatus(status);
    let filtered = productList;

    if (status !== "ทั้งหมด") {
      filtered = filtered.filter((product) => product.status === status);
    }

    setFilteredProductList(filtered);
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="request-product-app">
        <h3 className="page-title">เบิกทรัพย์สิน</h3>

        {/* Toggle Button */}
        <Button variant="primary" onClick={toggleSearchAndFilters} className="mb-3">
          {showSearch && showFilters ? "ซ่อนค้นหาและตัวกรอง" : "แสดงค้นหาและตัวกรอง"}
        </Button>

        {/* Search and Filters Container */}
        <div className="search-filter-container">
          {/* Search Input */}
          {showSearch && (
            <Form.Group controlId="searchQuery">
              <Form.Label>ค้นหา</Form.Label>
              <Form.Control
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="กรอกชื่อทรัพย์สิน..."
              />
            </Form.Group>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="filter-groups">
              {/* ประเภท DROPDOWN */}
              <Form.Group controlId="productType">
                <Form.Label>ประเภททรัพย์สิน</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    handleFilterByType(e.target.value);
                  }}
                >
                  <option value="All">ทั้งหมด</option>
                  <option value="อุปกรณ์ไอที">อุปกรณ์ไอที</option>
                  <option value="อุปกรณ์เครื่องใช้สำนักงาน">อุปกรณ์เครื่องใช้สำนักงาน</option>
                  <option value="อุปกรณ์การศึกษา">อุปกรณ์การศึกษา</option>
                  <option value="อุปกรณ์กีฬาและสันทนาการ">อุปกรณ์กีฬาและสันทนาการ</option>
                </Form.Control>
              </Form.Group>

              {/* สถานะ DROPDOWN */}
              <Form.Group controlId="productStatus">
                <Form.Label>สถานะ</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    handleFilterByStatus(e.target.value);
                  }}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  <option value="มี">มี</option>
                  <option value="หมด">หมด</option>
                </Form.Control>
              </Form.Group>
            </div>
          )}
        </div>

        {/* Product List Table */}
        <table className="table table-bordered product-table">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รูป</th>
              <th>ชื่อทรัพย์สิน</th>
              <th>ประเภท</th>
              <th>จำนวน</th>
              <th>สถานะ</th>
              <th>รอดำเนินการ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductList.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {product.image && (
                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.name}
                      className="product-image"
                    />
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.type}</td>
                <td>{product.qty}</td>
                <td className={product.status === 'มี' ? 'text-success' : 'text-danger'}>
                  {product.status}
                </td>
                <td>{product.pending}</td>
                <td>
                  <Button variant="success" onClick={() => { setSelectedProduct(product); setShowModal(true); }}>
                    รายละเอียด
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => { setSelectedProduct(product); setShowRequestModal(true); }}
                    disabled={product.status === 'หมด'}
                    style={{ marginLeft: '5px' }}
                  >
                    เบิก
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Product Details Modal */}
        {selectedProduct && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header>
              <Modal.Title>รายละเอียด</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>ชื่อ:</strong> {selectedProduct.name}</p>
              <p><strong>ประเภท:</strong> {selectedProduct.type}</p>
              <p><strong>จำนวนที่พร้อมเบิก:</strong> {selectedProduct.qty}</p>
              <p>
                <strong>สถานะ:</strong>
                <span className={selectedProduct.status === 'มี' ? 'text-success' : 'text-danger'}>
                  {selectedProduct.status}
                </span>
              </p>
              <p><strong>รอดำเนินการ:</strong> {selectedProduct.pending}</p>
              {selectedProduct.image && (
                <img
                  src={`data:image/jpeg;base64,${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  className="img-fluid mt-3"
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>ปิด</Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Request Product Modal */}
        {selectedProduct && (
          <Modal show={showRequestModal} onHide={handleRequestClose}>
            <Modal.Header>
              <Modal.Title>เบิกทรัพย์สิน</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedProduct.image && (
                <div className="mb-3">
                  <img
                    src={`data:image/jpeg;base64,${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    className="product-image"
                  />
                  <span><strong>ชื่อ:</strong> {selectedProduct.name}</span>
                  <p><strong>จำนวนคงเหลือ:</strong> {selectedProduct.qty}</p>
                  <p><strong>จำนวนที่สามารถเบิกได้ต่อครั้ง:</strong> {selectedProduct.limited_qty}</p>
                </div>
              )}
              <Form>
                <Form.Group controlId="requestQty">
                  <Form.Label>จำนวนที่ต้องการเบิก</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={selectedProduct.limited_qty}
                    value={requestQty}
                    onChange={(e) => setRequestQty(Number(e.target.value))}
                  />
                </Form.Group>
                <Form.Group controlId="requestReason">
                  <Form.Label>เหตุผลในการเบิก</Form.Label>
                  <Form.Control
                    as="select"
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                  >
                    <option value="">-- เลือกเหตุผล --</option>
                    <option value="ของเก่าชำรุด">ของเก่าชำรุด</option>
                    <option value="ใช้สนับสนุนการเรียนการสอน">ใช้สนับสนุนการเรียนการสอน</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </Form.Control>
                  {requestReason === "อื่นๆ" && (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="ระบุเหตุผลเพิ่มเติม"
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleRequestClose}>ยกเลิก</Button>
              <Button variant="primary" onClick={handleSubmitRequest}>ยืนยันการเบิก</Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Request_Product;
