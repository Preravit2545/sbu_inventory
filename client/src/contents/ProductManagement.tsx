import axios from "axios";
import { useState, useEffect } from "react";

function ProductManagement() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [qty, setQty] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [status, setStatus] = useState(1);
    const [ProductList, setProductList] = useState<any[]>([]);

    const getProduct = () => {
        axios.get('http://localhost:3001/product').then((response) => {
            setProductList(response.data);
        });
    };

    useEffect(() => {
        getProduct();
      }, []);

    const deleteProduct = (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
          axios.delete(`http://localhost:3001/delete/product/${id}`)
            .then(response => {
              alert(response.data);
              setProductList(ProductList.filter(product => product.id !== id));
            })
            .catch(error => {
              console.error("There was an error deleting the product!", error);
            });
        }
      };
    

    const handleAddProduct = (event: React.FormEvent) => {
        event.preventDefault();

        const productData = new FormData();
        productData.append("name", name);
        productData.append("type", type);
        productData.append("qty", qty.toString());
        productData.append("status", status.toString());
        if (image) {
            productData.append("image", image);
        }

        axios.post('http://localhost:3001/addproduct', productData)
            .then(() => {
                getProduct();
                setName("");
                setType("");
                setQty(0);
                setImage(null);
                setStatus(1);
            });
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <h1>จัดการข้อมูลทรัพย์สิน</h1>
                </div>
            </div>

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
                            <label htmlFor="type" className="form-label">ประเภททรัพย์สิน :</label>
                            <select
                                className="form-control"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="เจ้าหน้าที่">เจ้าหน้าที่</option>
                                <option value="อาจารย์">อาจารย์</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">สถานะทรัพย์สิน :</label>
                            <select
                                className="form-control"
                                value={status}
                                onChange={(e) => setStatus(Number(e.target.value))}
                            >
                                <option value={1}>มี</option>
                                <option value={0}>หมด</option>
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
                                {val.image && (
                                    <img
                                        src={`data:image/jpeg;base64,${val.image}`}
                                        alt={val.name}
                                        style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                                    />
                                )}
                                <p className="card-text">id : {val.id}</p>
                                <p className="card-text">name : {val.name}</p>
                                <p className="card-text">Type : {val.type}</p>
                                <p className="card-text">Qty : {val.qty}</p>
                                <p className="card-text">Status : {val.status === 1 ? 'มี' : 'หมด'}</p>
                                <button className="btn btn-danger" onClick={() => deleteProduct(val.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductManagement;
