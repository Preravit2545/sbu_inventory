import axios, { Axios } from "axios";
import { useState } from "react";

function ProductManagement() {

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [qty, setQty] = useState(0);
    const [image, setImage] = useState("");
    const [status, setStatus] = useState("มี"); 

    const [ProductList, setProductList] = useState<any[]>([]);

    const getProduct = () => {
        axios.get('http://localhost:3001/product').then((response) => {
            setProductList(response.data);
        });
    }

    const addProduct = () => {
        axios.post('http://localhost:3001/create',{
            name : name,
            type : type,
            qty : qty,
            image : image,
            status : status
        })
    }

    return (
        <div className="content-wrapper">

            <div className="content-header">
                <div className="container-fluid">
                    <h1>จัดการข้อมูลทรัพย์สิน</h1>
                </div>
            </div>

            <div className="information">
                <form action="">
                    <div className="container-fluid">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">ชื่อทรัพย์สิน :</label>
                            <input type="text" className="form-control" placeholder="Product name" onChange={(event)=>setName(event.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="qty" className="form-label">จำนวน :</label>
                            <input type="number" className="form-control" placeholder="0" onChange={(event)=>setQty(Number(event.target.value))} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="userRole" className="form-label">ประเภททรัพย์สิน :</label>
                            <select className="form-control" onChange={(event)=>setType(event.target.value)}>
                                <option value="เจ้าหน้าที่"> </option>
                                <option value="อาจารย์"></option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Status" className="form-label">สถานะทรัพย์สิน :</label>
                            <select className="form-control" onChange={(event)=>setStatus(event.target.value)}>
                                <option value="มี">มี</option>
                                <option value="หมด">หมด</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="profilePicture" className="form-label">รูปสินค้า : </label>
                            <input type="file" className="form-control" />
                        </div>

                        <button className="btn btn-success">เพิ่มผู้ใช้</button>
                    </div>
                </form>
            </div>
            <hr />
            <div className="user">
                <button className="btn btn-primary" onClick={getProduct}>แสดงผู้ใช้</button>
                <br />
                {ProductList.map((val, key) => {
                    return (
                        <div className="product card">
                            <div className="class-body text-left"></div>
                            {val.image && <img src={`data:image/jpeg;base64,${val.image}`} alt={val.name} style={{ width: '100px', height: '100px' }} />}
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

export default ProductManagement;
