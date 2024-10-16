import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface ApprovalmanagerListProps {
  userID: number | null; // Define the userID prop type
}

const ApprovalManagerList: React.FC<ApprovalmanagerListProps> = ({ userID }) => {
  const [requestList, setRequestList] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>(''); // สำหรับติดตามสถานะที่เลือก
  const [managerRemark, setmanagerRemark] = useState<string>(''); // สำหรับเก็บข้อคิดเห็นของเจ้าหน้าที่

  const getApprovalRequests = () => {
    axios.get('http://localhost:3001/approval_manager_list')
      .then((response) => {
        setRequestList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching approval requests:', error);
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
    setShowApprovalModal(true); // เปิด modal ของการจัดการอนุมัติ
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setApprovalStatus(''); // รีเซ็ตค่า
    setmanagerRemark(''); // รีเซ็ตค่าข้อคิดเห็น
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
      manager_remark: managerRemark // ส่งข้อคิดเห็นของเจ้าหน้าที่ไปด้วย
    })
    .then((response) => {
      console.log("Update status success:", response.data);
      getApprovalRequests(); // รีเฟรชรายการหลังการอัปเดต
    })
    .catch((error) => {
      console.error("Error updating status:", error);
    });

    handleCloseApprovalModal(); // ปิด modal หลังจากส่งข้อมูล
  };

  useEffect(() => {
    getApprovalRequests();
  }, []);

  return (
    <div className="content-wrapper">
      <h3 style={{ margin: '10px' }}>รายการคำขออนุมัติ</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>รหัสการร้องขอ</th>
            <th>รูป</th>
            <th>ชื่อทรัพย์สิน</th>
            <th>จำนวน</th>
            <th>เหตุผล</th>
            <th>วันที่ร้องขอ</th>
            <th>สถานะ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {requestList.map((val, key) => (
            <tr key={key}>
              <td>{val.request_id}</td>
              <td>
                {val.product_image ? (
                  <img
                    src={`data:image/jpeg;base64,${val.product_image}`}
                    alt={val.product_name}
                    style={{ width: '50px', height: '50px' }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{val.product_name}</td>
              <td>{val.quantity}</td>
              <td>{val.reason}</td>
              <td>{new Date(val.request_date).toLocaleDateString()}</td>
              <td style={{ color: val.status === 'รอดำเนินการ' ? 'orange' : 'green' }}>
                {val.status}
              </td>
              <td>
                <button className="btn btn-success" onClick={() => ViewingRequest(val)}>
                  ดู
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
            <p><strong>รหัสการร้องขอ:</strong> {selectedRequest.request_id}</p>
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
              <option value="">เลือก...</option>
              <option value="approve">อนุมัติ</option>
              <option value="reject">ไม่อนุมัติ</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="managerRemark">
            <Form.Label>ข้อคิดเห็นจากผู้จัดการ</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={managerRemark}
              onChange={(e) => setmanagerRemark(e.target.value)}
              placeholder="ใส่ข้อคิดเห็น..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseApprovalModal}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handleSubmitApproval} disabled={!approvalStatus}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ApprovalManagerList;