import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

function ProductManagement() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [qty, setQty] = useState(0);
    const [limited_qty, setlimitedQty] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [status, setStatus] = useState(1);
    const [ProductList, setProductList] = useState<any[]>([]);
    const [editingProduct, setEditingProduct] = useState<number | null>(null);

    const getProduct = () => {
        axios.get('http://localhost:3001/product').then((response) => {
            setProductList(response.data);
        });
    };

    useEffect(() => {
        getProduct();
    }, []);

    const deleteProduct = (id: number) => {
        Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "คุณต้องการลบผลิตภัณฑ์นี้?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่, ลบ!",
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3001/delete/product/${id}`)
                    .then(response => {
                        Swal.fire("ลบเรียบร้อย!", response.data, "success");
                        setProductList(ProductList.filter(product => product.id !== id));
                    })
                    .catch(error => {
                        console.error("เกิดข้อผิดพลาดในการลบผลิตภัณฑ์!", error);
                        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบผลิตภัณฑ์ได้", "error");
                    });
            }
        });
    };

    const handleAddProduct = (event: React.FormEvent) => {
        event.preventDefault();

        const productData = new FormData();
        productData.append("name", name);
        productData.append("type", type);
        productData.append("qty", qty.toString());
        productData.append("limited_qty", limited_qty.toString());
        productData.append("status", status.toString());
        if (image) {
            productData.append("image", image);
        }

        console.log('Product Data:', productData); // Log to see what you're sending

        axios.post('http://localhost:3001/addproduct', productData)
            .then(() => {
                getProduct(); // Refresh the product list
                Swal.fire("สำเร็จ!", "เพิ่มทรัพย์สินเรียบร้อยแล้ว!", "success");
                resetForm(); // Clear the form inputs
            })
            .catch((error) => {
                console.error("เกิดข้อผิดพลาดในการเพิ่มผลิตภัณฑ์!", error);
                Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถเพิ่มผลิตภัณฑ์ได้", "error");
            });
    };


    // start UPDATE
    const handleEditProduct = (event: React.FormEvent, id: number) => {
        event.preventDefault();

        const productData = new FormData();
        productData.append("name", name);
        productData.append("type", type);
        productData.append("qty", qty.toString());
        productData.append("limited_qty", limited_qty.toString());
        productData.append("status", status.toString());
        if (image) {
            productData.append("image", image);
        }

        axios.put(`http://localhost:3001/updateproduct/${id}`, productData)
            .then(() => {
                getProduct();
                Swal.fire("สำเร็จ!", "ปรับปรุงผลิตภัณฑ์เรียบร้อยแล้ว!", "success");
                resetForm();
            })
            .catch((error) => {
                console.error("เกิดข้อผิดพลาดในการปรับปรุงผลิตภัณฑ์!", error);
                Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถปรับปรุงผลิตภัณฑ์ได้", "error");
            });
    };

    const resetForm = () => {
        setName("");
        setQty(0);
        setlimitedQty(0);
        setImage(null);
        setStatus(1);
        setEditingProduct(null);
    };

    const startEditingProduct = (product: any) => {
        setEditingProduct(product.id);
        setName(product.name);
        setType(product.type);
        setQty(product.qty);
        setlimitedQty(product.limited_qty);
        setStatus(product.status);
        setImage(null);
    };

    const cancelEdit = () => {
        resetForm();
    };
    // end UPDATE

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <h1>จัดการข้อมูลทรัพย์สิน</h1>
                </div>
            </div>
            {/* ADD PRODUCT UI */}
            <div className="information">
                <form onSubmit={handleAddProduct}>
                    <div className="container-fluid">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">ชื่อทรัพย์สิน :</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Product name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="qty" className="form-label">จำนวน :</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="0"
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="qty" className="form-label">จำนวนที่เบิกได้ต่อครั้ง :</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="0"
                                value={limited_qty}
                                onChange={(e) => setlimitedQty(Number(e.target.value))}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="type" className="form-label">ประเภททรัพย์สิน :</label>
                            <select
                                className="form-control"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="อุปกรณ์เครื่องใช้สำนักงาน">อุปกรณ์เครื่องใช้สำนักงาน</option>
                                <option value="อุปกรณ์ไอที">อุปกรณ์ไอที</option>
                                <option value="อุปกรณ์การศึกษา">อุปกรณ์การศึกษา</option>
                                <option value="อุปกรณ์กีฬาและสันทนาการ">อุปกรณ์กีฬาและสันทนาการ</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">รูปสินค้า :</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                        <button type="submit" className="btn btn-success">เพิ่มทรัพย์สิน</button>
                    </div>
                </form>
            </div>

            <hr />

            <div className="user">

                <button className="btn btn-primary" onClick={getProduct}>แสดงทรัพย์สิน</button>

                <div style={{ marginTop: '20px' }}>
                    {ProductList.map((val, key) => (
                        <div className="product card" key={key}>
                            <div className="card-body text-left">
                                {/* IMAGE */}
                                {val.image && (
                                    <img
                                        src={`data:image/jpeg;base64,${val.image}`}
                                        alt={val.name}
                                        style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                                    />
                                )}
                                {/* UPDATE PRODUCT */}
                                {editingProduct === val.id ? (
                                    <form onSubmit={(e) => handleEditProduct(e, val.id)}>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">ชื่อทรัพย์สิน :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="qty" className="form-label">จำนวน :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="limitedqty" className="form-label">จำนวนการเบิกต่อครั้ง :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={limited_qty}
                                                onChange={(e) => setlimitedQty(Number(e.target.value))}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="type" className="form-label">ประเภททรัพย์สิน :</label>
                                            <select
                                                className="form-control"
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                            >
                                                <option value="อุปกรณ์เครื่องใช้สำนักงาน">อุปกรณ์เครื่องใช้สำนักงาน</option>
                                                <option value="อุปกรณ์ไอที">อุปกรณ์ไอที</option>
                                                <option value="อุปกรณ์การศึกษา">อุปกรณ์การศึกษา</option>
                                                <option value="อุปกรณ์กีฬาและสันทนาการ">อุปกรณ์กีฬาและสันทนาการ</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">รูปสินค้า :</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-success">อัพเดต</button>
                                        <button type="button" className="btn btn-secondary" onClick={cancelEdit}>ยกเลิกแก้ไข</button>
                                    </form>
                                ) : (
                                    <>
                                        {/* Show Product */}
                                        <p className="card-text">รหัส : {val.id}</p>
                                        <p className="card-text">ชื่อทรัพย์สิน : {val.name}</p>
                                        <p className="card-text">ประเภททรัพย์สิน : {val.type}</p>
                                        <p className="card-text">จำนวน : {val.qty}</p>
                                        <p className="card-text">จำนวนที่เบิกได้ต่อครั้ง : {val.limited_qty}</p>
                                        <p className="card-text">สถานะ : {val.status}</p>
                                        <button className="btn btn-warning" onClick={() => startEditingProduct(val)}>แก้ไข</button>
                                        <button className="btn btn-danger" onClick={() => deleteProduct(val.id)}>ลบ</button>
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

export default ProductManagement;
