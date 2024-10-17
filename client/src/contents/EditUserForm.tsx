import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RequestUserProps {
  userID: number | null;
  userType: 'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager' | null;
}

const EditUserForm: React.FC<RequestUserProps> = ({ userID, userType }) => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState(''); // New password
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm new password
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Preview the base64 image

  useEffect(() => {
    // Fetch user details based on userID and userType
    const fetchUserData = async () => {
      try {
        if (userID && userType) {
          const response = await axios.get(`http://localhost:3001/getuser/${userType}/${userID}`);
          const userData = response.data;

          setUsername(userData.username);
          setFirstname(userData.firstname);
          setLastname(userData.lastname);
          setPhone(userData.phone);

          // Set the base64 image preview if available
          if (userData.image) {
            setImagePreview(`data:image/jpeg;base64,${userData.image}`);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [userID, userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !newPassword || !confirmPassword) {
      alert('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirmation password do not match');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('newPassword', newPassword); // Add new password
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
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  return (
    <div className="content-wrapper">
      <div className="App">
        <h3 style={{ margin: '10px' }}>แก้ไขข้อมูล</h3>
        <div className="information">
          <form onSubmit={handleSubmit}>
            <div className="container-fluid">
              {/* Display the image preview */}
              <div className="mb-3">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt={firstname}
                    style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                  />
                )}
                <label htmlFor="username" className="form-label">Username :</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  value={username}
                  disabled
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">New Password :</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {/* Confirm New Password */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password :</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="firstname" className="form-label">ชื่อจริง :</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="lastname" className="form-label">นามสกุล :</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">เบอร์โทร :</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="profilePicture" className="form-label">Profile Picture :</label>
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
