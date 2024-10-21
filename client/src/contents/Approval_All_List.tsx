import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from 'sweetalert2'; // Import SweetAlert2

interface ApprovalAllListProps {
  userID: number | null; // Define the userID prop type
}

const ApprovalAllList: React.FC<ApprovalAllListProps> = ({ userID }) => {
  const [requestList, setRequestList] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>(''); // Track selected status
  const [staffRemark, setStaffRemark] = useState<string>(''); // Store staff remark
  const [searchQuery, setSearchQuery] = useState<string>(''); // Store search input
  const [sortOrder, setSortOrder] = useState<string>('desc'); // State for sort order
  const [selectedStatus, setSelectedStatus] = useState<string>('ทั้งหมด'); // Filter based on status

  const getApprovalRequests = () => {
    axios.get('http://localhost:3001/approval_all_list')
      .then((response) => {
        setRequestList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching approval requests:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถดึงข้อมูลคำขออนุมัติได้!',
        });
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

  useEffect(() => {
    getApprovalRequests();

    const interval = setInterval(() => {
      getApprovalRequests();
    }, 5000); // 5 วินาที

    return () => clearInterval(interval);
  }, []);

  // Filtered request list based on search query and status
  const filteredRequests = requestList.filter(request =>
    (request.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.request_id.toString().includes(searchQuery)) &&
    (selectedStatus === 'ทั้งหมด' || request.status === selectedStatus)
  );

  // Sort filtered requests based on sort order
  const sortedRequests = filteredRequests.sort((a, b) => {
    const dateA = new Date(a.request_date).getTime();
    const dateB = new Date(b.request_date).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="content-wrapper">
      <h3 style={{ margin: '10px' }}>รายการคำขออนุมัติทั้งหมด</h3>

      {/* Search Input */}
      <Form.Group controlId="searchQuery">
        <Form.Control
          type="text"
          placeholder="ค้นหาตามชื่อทรัพย์สินหรือรหัสการร้องขอ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {/* Sort Dropdown */}
      <Form.Group controlId="sortOrder">
        <Form.Label>เรียงลำดับตามวันที่ร้องขอ</Form.Label>
        <Form.Control
          as="select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">ใหม่ไปเก่าที่สุด</option>
          <option value="asc">เก่าไปใหม่ที่สุด</option>
        </Form.Control>
      </Form.Group>

      {/* Filter Status Dropdown */}
      <Form.Group controlId="selectedStatus">
        <Form.Label>เลือกสถานะ</Form.Label>
        <Form.Control
          as="select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="รอดำเนินการ">รอดำเนินการ</option>
          <option value="ได้รับการอนุมัติจากเจ้าหน้าที่">ได้รับการอนุมัติจากเจ้าหน้าที่</option>
          <option value="ได้รับการอนุมัติจากผู้จัดการ">ได้รับการอนุมัติจากผู้จัดการ</option>
          <option value="ถูกปฏิเสธ">ถูกปฏิเสธ</option>
          <option value="ยกเลิกโดยพนักงาน">ยกเลิกโดยพนักงาน</option>
        </Form.Control>
      </Form.Group>

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
          {sortedRequests.length > 0 ? sortedRequests.map((val, key) => (
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
              <td style={{ color: val.status === 'รอดำเนินการ' ? 'orange' : val.status === 'ได้รับการอนุมัติจากเจ้าหน้าที่' ? 'blue' : val.status === 'ได้รับการอนุมัติจากผู้จัดการ' ? 'green' : 'red' }}>
                {val.status}
              </td>
              <td>
                <button className="btn btn-success" onClick={() => ViewingRequest(val)}>
                  ดูรายละเอียดคำขอ
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={7} className="text-center">ไม่พบข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ViewingRequest Modal */}
      {selectedRequest && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header>
            <Modal.Title>รายละเอียดคำขอ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>รหัสการร้องขอ:</strong> {selectedRequest.request_id}</p>
            <p><strong>ชื่อทรัพย์สิน:</strong> {selectedRequest.product_name}</p>
            <p><strong>จำนวน:</strong> {selectedRequest.quantity}</p>
            <p><strong>เหตุผลที่เบิก:</strong> {selectedRequest.reason}</p>
            <p><strong>วันที่ร้องขอ:</strong> {new Date(selectedRequest.request_date).toLocaleDateString()}</p>
            <p><strong>เจ้าหน้าที่อนุมัติ:</strong> {selectedRequest.staff_firstname}</p>
            <p><strong>ผู้จัดการอนุมัติ:</strong> {selectedRequest.m_firstname}</p>
            <p><strong>ความเห็นของเจ้าหน้าที่:</strong> {selectedRequest.staff_remark}</p>
            <p><strong>ความเห็นของผู้จัดการ:</strong> {selectedRequest.manager_remark}</p>
            <p><strong>สถานะ:</strong> <span className={`status-label ${selectedRequest.status}`}>{selectedRequest.status}</span></p>
            {selectedRequest.product_image && (
              <img
                src={`data:image/jpeg;base64,${selectedRequest.product_image}`}
                alt={selectedRequest.product_name}
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', margin: '10px 0' }}
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
};

export default ApprovalAllList;
