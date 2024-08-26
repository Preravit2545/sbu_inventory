import axios from "axios";
import { useState, useEffect } from "react";

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

    
    const getTeachers = () => {
        axios.get('http://localhost:3001/user?position=teacher').then((response) => {
            setUserList(response.data);
            setSelectedButton('teacher'); // Update selected button
        });
    }

    const getStaff = () => {
        axios.get('http://localhost:3001/user?position=staff').then((response) => {
            setUserList(response.data);
            setSelectedButton('staff'); // Update selected button
        });
    }
    

    const getUsers = () => {
        axios.get(`http://localhost:3001/user?position=${position}`).then((response) => {
            setUserList(response.data);
        });
    };

    useEffect(() => {
        getUsers();
    }, [position]);

    const deleteUser = (id: number, role: string) => {
        if (window.confirm(`Are you sure you want to delete this ${role === 'staff' ? 'staff member' : 'teacher'}?`)) {
            const endpoint = role === 'staff' ? `staff` : `teacher`;
            axios.delete(`http://localhost:3001/delete/${endpoint}/${id}`)
                .then(response => {
                    alert(response.data);
                    setUserList(UserList.filter(user => user.id !== id));
                })
                .catch(error => {
                    console.error("There was an error deleting the user!", error);
                });
        }
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
                alert(response.data);
            })
            .catch(error => {
                console.error("There was an error adding the user!", error);
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
                            <label htmlFor="username" className="form-label">Username :</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password :</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="realname" className="form-label">ชื่อจริง :</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Name"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="surname" className="form-label">นามสกุล :</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Surname"
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
                            <label htmlFor="userRole" className="form-label">ตำแหน่ง :</label>
                            <select
                                className="form-control"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            >
                                <option value="">--เลือกตำแหน่ง--</option>
                                <option value="staff">เจ้าหน้าที่</option>
                                <option value="teacher">อาจารย์</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="profilePicture" className="form-label">Profile Picture :</label>
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
                        className={`btn ${position === 'staff' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setPosition('staff')}
                    >
                        Show Staff
                    </button>
                    <button
                        className={`btn ${position === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setPosition('teacher')}
                    >
                        Show Teachers
                    </button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    {UserList.map((val, key) => (
                        <div key={key} className="user card">
                            <div className="card-body text-left">
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
                                <button
                                    className="btn btn-danger"
                                    onClick={() => deleteUser(val.id, position)}
                                >
                                    Delete {position === 'staff' ? 'Staff' : 'Teacher'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserManagement;
