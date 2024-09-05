import React from 'react';

const OrderForm = () => {
    return (
        <div className="content-wrapper">
            <div className="card">
                <div className="content-header">
                    <h1 className="card-title">คำสั่งซื้อ</h1>
                </div>
                {/* /.card-header */}
                <div className="card-body">
                    <table id="example2" className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>เลขที่</th>
                                <th>รูปทรัพย์สิน</th>
                                <th>ชื่อทรัพย์สิน</th>
                                <th>ประเภททรัพย์สิน</th>
                                <th>จำนวน</th>
                                <th>การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>
                                </td>
                                <td>กรรไกร</td>
                                <td>บลาๆ</td>
                                <td>4</td>
                                <td>
                                    <button className='btn btn-primary'>เบิก</button>
                                    <button className='btn btn-success'>ดู</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* /.card-body */}
            </div>
        </div>

    );
};

export default OrderForm;