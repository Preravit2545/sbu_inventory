import axios from "axios";
import { useState } from "react";

function UserManagement() {

    const [UserList, setUserList] = useState<any[]>([]);

    const getUser = () => {
        axios.get('http://localhost:3001/user').then((response) => {
            setUserList(response.data);
        });
    }

    return (
        <div className="content-wrapper">

            <div className="content-header">
                <div className="container-fluid">
                    <h1>จัดการข้อมูลผู้ใช้</h1>
                </div>
            </div>

            <div className="information">
                <form action="">
                    <div className="container-fluid">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username :</label>
                            <input type="text" className="form-control" placeholder="Enter Username" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password :</label>
                            <input type="text" className="form-control" placeholder="Enter Password" />
                        </div>


                        <div className="mb-3">
                            <label htmlFor="realname" className="form-label">ชื่อจริง :</label>
                            <input type="text" className="form-control" placeholder="Enter Name" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="surname" className="form-label">นามสกุล :</label>
                            <input type="text" className="form-control" placeholder="Enter Surname" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="userRole" className="form-label">ตำแหน่ง :</label>
                            <select className="form-control">
                                <option value="Select">--เลือกตำแหน่ง--</option>    
                                <option value="เจ้าหน้าที่">เจ้าหน้าที่</option>
                                <option value="อาจารย์">อาจารย์</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="profilePicture" className="form-label">Profile Picture :</label>
                            <input type="file" className="form-control" />
                        </div>

                        <button className="btn btn-success">เพิ่มผู้ใช้</button>
                    </div>
                </form>
            </div>
            <hr />
            <div className="user">
                <button className="btn btn-primary" onClick={getUser}>แสดงผู้ใช้</button>

                {UserList.map((val, key) => {
                    return (
                        <div className="user card">
                            <div className="class-body text-left"></div>
                            <p className="card-text">id : {val.id}</p>
                            <p className="card-text">name : {val.name}</p>
                            <p className="card-text">Type : {val.type}</p>
                            <p className="card-text">Qty : {val.qty}</p>
                            <p className="card-text">Status : {val.status}</p>
                        </div>
                    )

                })}

            </div>
        </div>
    );
}

export default UserManagement;
