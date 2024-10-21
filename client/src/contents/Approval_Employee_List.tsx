import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from 'sweetalert2';
import "./css/ApprovalemployeeList.css";

interface ApprovalemployeeListProps {
  userID: number | null;
}

const ApprovalemployeeList: React.FC<ApprovalemployeeListProps> = ({ userID }) => {
  const [requestList, setRequestList] = useState<any[]>([]);
  const [filteredRequestList, setFilteredRequestList] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ทั้งหมด");
  const [showSearch, setShowSearch] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>('desc');

  const getApprovalRequests = () => {
    if (!userID) return;

    axios.get(`http://localhost:3001/approval_employee_list`, {
      params: { employee_id: userID }
    })
      .then((response) => {
        setRequestList(response.data);
        setFilteredRequestList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching approval requests:', error);
        Swal.fire('มีข้อผิดพลาด!', 'ไม่สามารถโหลดข้อมูลคำขอได้', 'error');
      });
  };

  const handleDeleteRequest = (requestId: number) => {
    Swal.fire({
      title: 'คุณต้องการยกเลิกคำขอนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ยกเลิกคำขอ!',
      cancelButtonText: 'ไม่, ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/delete_approval_request/${requestId}`)
          .then((response) => {
            Swal.fire('สำเร็จ!', 'คำขอถูกยกเลิกเรียบร้อยแล้ว', 'success');
            // Remove the deleted request from the list
            setRequestList((prevList) => prevList.filter((request) => request.request_id !== requestId));
            setFilteredRequestList((prevList) => prevList.filter((request) => request.request_id !== requestId));
            getApprovalRequests();
          })
          .catch((error) => {
            console.error('Error deleting request:', error);
            Swal.fire('มีข้อผิดพลาด!', 'มีข้อผิดพลาดในการยกเลิกคำขอ', 'error');
          });
      }
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

  const toggleSearchAndFilters = () => {
    setShowSearch((prev) => !prev);
    setShowFilters((prev) => !prev);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterByStatus = (status: string) => {
    setSelectedStatus(status);
  };

  // Sort and filter requests whenever the related states change
  useEffect(() => {
    let filtered = requestList;

    // Filter by status
    if (selectedStatus !== "ทั้งหมด") {
      filtered = filtered.filter((request) => request.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((request) =>
        request.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by request date based on sort order
    filtered.sort((a, b) => {
      const dateA = new Date(a.request_date).getTime();
      const dateB = new Date(b.request_date).getTime();
      return sortOrder === 'desc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredRequestList(filtered);
  }, [requestList, searchQuery, selectedStatus, sortOrder]);

  useEffect(() => {
    getApprovalRequests();
  }, []);

  return (
    <div className="content-wrapper">
      <h3 style={{ margin: '10px' }}>รายการคำขอเบิกของคุณ</h3>

      <Button variant="primary" onClick={toggleSearchAndFilters} className="mb-3">
        {showSearch && showFilters ? "ซ่อนค้นหาและตัวกรอง" : "แสดงค้นหาและตัวกรอง"}
      </Button>

      <div className="search-filter-container">
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

        {showFilters && (
          <div className="filter-groups">
            <Form.Group controlId="statusFilter">
              <Form.Label>สถานะ</Form.Label>
              <Form.Control
                as="select"
                value={selectedStatus}
                onChange={(e) => handleFilterByStatus(e.target.value)}
              >
                <option value="ทั้งหมด">ทั้งหมด</option>
                <option value="รอดำเนินการ">รอดำเนินการ</option>
                <option value="ได้รับการอนุมัติจากเจ้าหน้าที่">ได้รับการอนุมัติจากเจ้าหน้าที่</option>
                <option value="ได้รับการอนุมัติจากผู้จัดการ">ได้รับการอนุมัติจากผู้จัดการ</option>
                <option value="ยกเลิกโดยพนักงาน">ยกเลิกโดยพนักงาน</option>
                <option value="ถูกปฏิเสธ">ถูกปฏิเสธ</option>
              </Form.Control>
            </Form.Group>
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
          </div>
        )}
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>รหัสการร้องขอ</th>
            <th>รูป</th>
            <th>ชื่อทรัพย์สิน</th>
            <th>จำนวน</th>
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
              <td>{new Date(val.request_date).toLocaleDateString()}</td>
              <td style={{ color: val.status === 'รอดำเนินการ' ? 'orange' : val.status === 'ได้รับการอนุมัติจากเจ้าหน้าที่' ? 'blue' : val.status === 'ได้รับการอนุมัติจากผู้จัดการ' ? 'green' : 'red' }}>
                {val.status}
              </td>
              <td>
                <button className="btn btn-warning" onClick={() => ViewingRequest(val)}>
                  ดูรายละเอียดคำขอ
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteRequest(val.request_id)}
                  disabled={val.status === "ได้รับการอนุมัติจากเจ้าหน้าที่" || val.status === "ได้รับการอนุมัติจากผู้จัดการ" || val.status === "ถูกปฏิเสธ" || val.status === "ยกเลิกโดยพนักงาน"}
                >
                  ยกเลิก
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
};

export default ApprovalemployeeList;
