import axios from "axios";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

function UserManagement() {
    const [UserList, setUserList] = useState<any[]>([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [selectedButton, setSelectedButton] = useState<string>(''); // Track selected button
    //UPDATE edit
    const [editMode, setEditMode] = useState<number | null>(null); // Track which user is being edited
    const [editedUser, setEditedUser] = useState<any>(null); // Track the edited user data

    const handleEditUser = (user: any) => {
        setEditMode(user.id);
        setEditedUser({ ...user }); // Clone the user object for editing
    };

    const handleUpdateUser = (id: number, position: string) => {
        const formData = new FormData();
        formData.append('username', editedUser.username);
        formData.append('password', editedUser.password);
        formData.append('firstname', editedUser.firstname);
        formData.append('lastname', editedUser.lastname);
        formData.append('phone', editedUser.phone);
        formData.append('position', position); // Pass the position here
        if (image) {
            formData.append('image', image);
        }

        axios.put(`http://localhost:3001/updateuser/${id}`, formData)
            .then(response => {
                Swal.fire({
                    title: 'สำเร็จ',
                    text: response.data,
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                });
                setEditMode(null); // Exit edit mode
                getUsers(); // Refresh the list
            })
            .catch(error => {
                console.error("มีข้อผิดพลาดในการอัปเดตผู้ใช้!", error);
                Swal.fire({
                    title: 'ผิดพลาด',
                    text: 'มีข้อผิดพลาดในการอัปเดตผู้ใช้',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                });
            });
    };

    const resetForm = () => {
        setUsername("");
        setPassword("");
        setFirstname("");
        setLastname("");
        setPhone("");
        setImage(null);
    };


    const getUsers = () => {
        axios.get(`http://localhost:3001/user?position=${position}`).then((response) => {
            setUserList(response.data);
        });
    };

    useEffect(() => {
        getUsers();
    }, [position]);

    const deleteUser = (id: number, role: string) => {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: `คุณต้องการลบ ${role === 'employee' ? 'พนักงาน' : role === 'staff' ? 'เจ้าหน้าที่' : role === 'staff_stock' ? 'เจ้าหน้าที่สต๊อก' : 'ผู้จัดการ'} นี้จริงๆ หรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                const endpoint = role === 'employee' ? `employee` :
                    role === 'staff' ? `staff` :
                        role === 'staff_stock' ? 'staff_stock' : 'manager';

                axios.delete(`http://localhost:3001/delete/${endpoint}/${id}`)
                    .then(response => {
                        Swal.fire(
                            'ลบแล้ว!',
                            response.data,
                            'success'
                        );
                        setUserList(UserList.filter(user => user.id !== id));
                    })
                    .catch(error => {
                        console.error("เกิดข้อผิดพลาดในการลบผู้ใช้!", error);
                        Swal.fire(
                            'ข้อผิดพลาด!',
                            'เกิดข้อผิดพลาดในการลบผู้ใช้.',
                            'error'
                        );
                    });
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('phone', phone);
        formData.append('position', position);
        if (image) {
            formData.append('image', image);
        }

        axios.post('http://localhost:3001/adduser', formData)
            .then(response => {
                Swal.fire({
                    title: 'สำเร็จ',
                    text: response.data,
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                });
                getUsers();
                resetForm();
            })
            .catch(error => {
                console.error("There was an error adding the user!", error);
                Swal.fire({
                    title: 'ผิดพลาด',
                    text: 'ไม่สามารถเพิ่มผู้ใช้ได้',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                });
            });

    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <h1>จัดการข้อมูลผู้ใช้</h1>
                </div>
            </div>

            <div className="information">
                <form onSubmit={handleSubmit}>
                    <div className="container-fluid">
                        {/* Form Fields */}
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">รหัสผู้ใช้ :</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="กรอกรหัสผู้ใช้"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">รหัสผ่าน :</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="กรอกรหัสผ่าน"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="realname" className="form-label">ชื่อจริง :</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="กรอกชื่อจริง"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="surname" className="form-label">นามสกุล :</label>
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
                            <label htmlFor="userRole" className="form-label">ตำแหน่ง :</label>
                            <select
                                className="form-control"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            >
                                <option value="">--เลือกตำแหน่ง--</option>
                                <option value="employee">พนักงาน</option>
                                <option value="staff">เจ้าหน้าที่ทั่วไป</option>
                                <option value="staff_stock">เจ้าหน้าที่สต๊อก</option>
                                <option value="manager">ผู้จัดการ</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="profilePicture" className="form-label">รูปโปรไฟล์ :</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>

                        <button className="btn btn-success">เพิ่มผู้ใช้</button>
                    </div>
                </form>
            </div>
            <hr />
            <div className="user">
                <div className="btn-group" role="group">

                    <button
                        className={`btn ${position === 'employee' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setPosition('employee')}
                    >
                        แสดงพนักงาน
                    </button>

                    <button
                        className={`btn ${position === 'staff' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setPosition('staff')}
                    >
                        แสดงเจ้าหน้าที่ทั่วไป
                    </button>

                    <button
                        className={`btn ${position === 'staff_stock' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setPosition('staff_stock')}
                    >
                        แสดงเจ้าหน้าที่สต๊อก
                    </button>

                    <button
                        className={`btn ${position === 'manager' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setPosition('manager')}
                    >
                        แสดงผู้จัดการ
                    </button>

                </div>
                <div style={{ marginTop: '20px' }}>
                    {UserList.map((val, key) => (
                        <div key={key} className="user card">
                            <div className="card-body text-left">
                                {editMode === val.id ? (
                                    <>
                                        <div className="mb-3">
                                            <label>รหัสผู้ใช้:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedUser.username}
                                                onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>รหัสผ่าน:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedUser.password}
                                                onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>ชื่อจริง:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedUser.firstname}
                                                onChange={(e) => setEditedUser({ ...editedUser, firstname: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>นามสกุล:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedUser.lastname}
                                                onChange={(e) => setEditedUser({ ...editedUser, lastname: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>เบอร์โทร:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedUser.phone}
                                                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">รูปโปรไฟล์:</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                            />
                                        </div>
                                        <button className="btn btn-success" onClick={() => handleUpdateUser(val.id, position)}>
                                            อัพเดต
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => setEditMode(null)}>
                                            ยกเลิก
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {val.image && (
                                            <img
                                                src={`data:image/jpeg;base64,${val.image}`}
                                                alt={val.firstname}
                                                style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                                            />
                                        )}
                                        <p className="card-text">id : {val.id}</p>
                                        <p className="card-text">ชื่อจริง : {val.firstname}</p>
                                        <p className="card-text">นามสกุล : {val.lastname}</p>
                                        <p className="card-text">เบอร์โทร : {val.phone}</p>
                                        <button className="btn btn-warning" onClick={() => handleEditUser(val)}>
                                            แก้ไข
                                        </button>
                                        <button className="btn btn-danger" onClick={() => deleteUser(val.id, position)}>
                                            ลบ {position === 'staff' ? 'เจ้าหน้าที่ทั่วไป' :
                                                position === 'employee' ? 'พนักงาน' :
                                                    position === 'staff_stock' ? 'พนักงานสต๊อก' : 'ผู้จัดการ'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserManagement;
