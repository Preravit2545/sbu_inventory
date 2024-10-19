import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from 'sweetalert2';

interface ApprovalmanagerListProps {
  userID: number | null;
}

const ApprovalManagerList: React.FC<ApprovalmanagerListProps> = ({ userID }) => {
  const [requestList, setRequestList] = useState<any[]>([]);
  const [filteredRequestList, setFilteredRequestList] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>('');
  const [managerRemark, setmanagerRemark] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  const getApprovalRequests = () => {
    axios.get('http://localhost:3001/approval_manager_list')
      .then((response) => {
        setRequestList(response.data);
        setFilteredRequestList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching approval requests:', error);
        Swal.fire('ข้อผิดพลาด!', 'ไม่สามารถดึงข้อมูลคำขออนุมัติได้', 'error');
      });
  };


  const ViewingRequest = (request: any) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleApprovalProduct = (request: any) => {
    setSelectedRequest(request);
    setShowApprovalModal(true);
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setApprovalStatus('');
    setmanagerRemark('');
  };

  const handleSubmitApproval = () => {
    const managerID = userID;
    if (!approvalStatus) return;

    axios.post(`http://localhost:3001/approve_manager`, {
      managerID: managerID,
      product_id: selectedRequest.product_id,
      Request_qty: selectedRequest.quantity,
      request_id: selectedRequest.request_id,
      status: approvalStatus === 'approve' ? 'ได้รับการอนุมัติจากผู้จัดการ' : 'ถูกปฏิเสธ',
      manager_remark: managerRemark
    })
      .then((response) => {
        Swal.fire('สำเร็จ!', 'สถานะคำขอได้รับการอัปเดตแล้ว', 'success');
        getApprovalRequests();
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        Swal.fire('ข้อผิดพลาด!', 'ไม่สามารถอัปเดตสถานะได้', 'error');
      });

    handleCloseApprovalModal();
  };

  // Search and Filter logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = requestList.filter((request) =>
      request.product_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRequestList(filtered);
  };

  const handleSortByDate = (order: string) => {
    const sorted = [...filteredRequestList].sort((a, b) => {
      const dateA = new Date(a.request_date);
      const dateB = new Date(b.request_date);
      return order === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
    setFilteredRequestList(sorted);
    setSortOrder(order);
  };

  useEffect(() => {
    // เรียกข้อมูลครั้งแรก
    getApprovalRequests();
    
    Swal.fire({
      icon: 'info',
      title: 'ข้อมูลใหม่เข้ามา!',
      text: 'มีคำขอใหม่ที่ต้องพิจารณา',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    // ตั้ง interval ให้เช็คข้อมูลใหม่ทุกๆ 5 วินาที
    const interval = setInterval(() => {
      getApprovalRequests();
    }, 5000); // 5 วินาที

    // Cleanup interval เมื่อ component ถูก unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="content-wrapper">
      <h3 style={{ margin: '10px' }}>รายการคำขออนุมัติ</h3>

      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <Form.Group controlId="searchQuery">
          <Form.Label>ค้นหา</Form.Label>
          <Form.Control
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="กรอกชื่อทรัพย์สิน..."
          />
        </Form.Group>

        {/* Sort Dropdown */}
        <Form.Group controlId="sortOrder">
          <Form.Label>เรียงลำดับตามวันที่ร้องขอ</Form.Label>
          <Form.Control
            as="select"
            value={sortOrder}
            onChange={(e) => handleSortByDate(e.target.value)}
          >
            <option value="desc">ใหม่ไปเก่าที่สุด</option>
            <option value="asc">เก่าไปใหม่ที่สุด</option>
          </Form.Control>
        </Form.Group>
      </div>

      {/* Request List Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>รหัสการร้องขอ</th>
            <th>รูป</th>
            <th>ชื่อทรัพย์สิน</th>
            <th>จำนวน</th>
            <th>ผู้ที่ขอเบิก</th>
            <th>วันที่ร้องขอ</th>
            <th>สถานะ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequestList.map((val, key) => (
            <tr key={key}>
              <td>{val.request_id}</td>
              <td>
                {val.product_image ? (
                  <img
                    src={`data:image/jpeg;base64,${val.product_image}`}
                    alt={val.product_name}
                    style={{ width: '100px', height: '100px' }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{val.product_name}</td>
              <td>{val.quantity}</td>
              <td>{val.emp_firstname} {val.emp_lastname}</td>
              <td>{new Date(val.request_date).toLocaleDateString()}</td>
              <td style={{ color: val.status === 'รอดำเนินการ' ? 'orange' : 'green' }}>
                {val.status}
              </td>
              <td>
                <button className="btn btn-success" onClick={() => ViewingRequest(val)}>
                  ดูรายละเอียดคำขอ
                </button>
                <button
                  className="btn btn-info"
                  style={{ margin: '0 5px' }}
                  onClick={() => handleApprovalProduct(val)}
                >
                  จัดการอนุมัติ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ViewingRequest Modal */}
      {selectedRequest && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header>
            <Modal.Title>รายละเอียดคำขอ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>รหัสการร้องขอ:</strong>{selectedRequest.request_id}</p>
            <p><strong>ชื่อทรัพย์สิน:</strong> {selectedRequest.product_name}</p>
            <p><strong>จำนวน:</strong> {selectedRequest.quantity}</p>
            <p><strong>ผู้ที่ขอเบิก:</strong> {selectedRequest.emp_firstname} {selectedRequest.emp_lastname}</p>
            <p><strong>เบอร์โทรผู้ที่ขอเบิก:</strong> {selectedRequest.emp_phone}</p>
            <p><strong>เหตุผลที่เบิก:</strong> {selectedRequest.reason}</p>
            <p><strong>เจ้าหน้าที่ที่อนุมัติ:</strong> {selectedRequest.staff_firstname} {selectedRequest.staff_lastname}</p>
            <p><strong>ข้อคิดเห็นจากเจ้าหน้าที่:</strong> {selectedRequest.staff_remark}</p>
            <p><strong>วันที่ร้องขอ:</strong> {new Date(selectedRequest.request_date).toLocaleDateString()}</p>
            <p><strong>สถานะ:</strong> {selectedRequest.status}</p>
            {selectedRequest.product_image && (
              <img
                src={`data:image/jpeg;base64,${selectedRequest.product_image}`}
                alt={selectedRequest.product_name}
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

      {/* Approval/Reject Modal */}
      <Modal show={showApprovalModal} onHide={handleCloseApprovalModal}>
        <Modal.Header>
          <Modal.Title>จัดการอนุมัติคำขอ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="approvalStatus">
            <Form.Label>สถานะ</Form.Label>
            <Form.Control
              as="select"
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value)}
            >
              <option value="">เลือกสถานะ</option>
              <option value="approve">อนุมัติ</option>
              <option value="reject">ไม่อนุมัติ</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="managerRemark">
            <Form.Label>ข้อคิดเห็นจากผู้จัดการ</Form.Label>
            <Form.Control
              as="textarea"
              value={managerRemark}
              onChange={(e) => setmanagerRemark(e.target.value)}
              rows={3}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseApprovalModal}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleSubmitApproval}>
            ส่งการอนุมัติ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApprovalManagerList;
