import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

interface RequestUserProps {
  userID: number | null;
  userType: 'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager' | null;
}

const EditUserForm: React.FC<RequestUserProps> = ({ userID, userType }) => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      if (userID && userType) {
        const response = await axios.get(`http://localhost:3001/getuser/${userType}/${userID}`);
        const userData = response.data;

        setUsername(userData.username);
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
        setPhone(userData.phone);

        if (userData.image) {
          setImagePreview(`data:image/jpeg;base64,${userData.image}`);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userID, userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'เกิดข้อผิดพลาด!',
        text: 'โปรดกรอกข้อมูลให้ครบถ้วน',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'เกิดข้อผิดพลาด!',
        text: 'รหัสผ่าน และ ยืนยันรหัสผ่านไม่ตรงกัน',
      });
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('newPassword', newPassword);
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('phone', phone);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.put(`http://localhost:3001/editupdateuser/${userType}/${userID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'ข้อมูลผู้ใช้ได้รับการอัพเดตแล้ว',
      });
      fetchUserData();
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'ผิดพลาด!',
        text: 'เกิดข้อผิดพลาดบางอย่างในการอัพเดตข้อมุลผู้ใช้',
      });
    }
  };

  return (
    <div className="content-wrapper">
      <div className="App">
        <h3 style={{ margin: '10px' }}>แก้ไขข้อมูล</h3>
        <div className="information">
          <form onSubmit={handleSubmit}>
            <div className="container-fluid">
              <div className="mb-3">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt={firstname}
                    style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                  />
                )}
                <label htmlFor="username" className="form-label">รหัสผู้ใช้ :</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  value={username}
                  disabled
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">รหัสผ่านใหม่ :</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="กรอกรหัสผ่านใหม่"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">ยืนยันรหัสผ่านใหม่ :</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="กรอกยืนยันรหัสผ่านใหม่"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="firstname" className="form-label">ชื่อจริง :</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="กรอกชื่อจริง"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="lastname" className="form-label">นามสกุล :</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="กรอกนามสกุล"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">เบอร์โทร :</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="กรอกเบอร์โทร"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="profilePicture" className="form-label">รูปโปรไฟล์ :</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                />
              </div>

              <button className="btn btn-success" type="submit">บันทึกการแก้ไข</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
