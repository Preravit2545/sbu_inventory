function ProductManagement() {
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
                            <label htmlFor="username" className="form-label">ชื่อทรัพย์สิน :</label>
                            <input type="text" className="form-control" placeholder="Product name" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="qty" className="form-label">จำนวน :</label>
                            <input type="text" className="form-control" placeholder="0" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="userRole" className="form-label">ประเภททรัพย์สิน :</label>
                            <select className="form-control">
                                <option value="เจ้าหน้าที่"> </option>
                                <option value="อาจารย์"></option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Status" className="form-label">สถานะทรัพย์สิน :</label>
                            <select className="form-control">
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
                <button className="btn btn-primary">แสดงผู้ใช้</button>
            </div>
        </div>
    );
}

export default ProductManagement;
