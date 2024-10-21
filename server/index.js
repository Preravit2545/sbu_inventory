const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer'); // To handle file uploads
const path = require('path');
const helmet = require('helmet');


// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Create MySQL Connection
const db = mysql.createConnection({
    user: "root",
    host: "127.0.0.1",
    password: "",
    database: "sbu_inventory"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    } else {
        console.log("Connected to the MySQL database");
    }
});

//start dashboard
app.get('/count/staff', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM staff", (err, result) => {
        if (err) {
            console.error("Error fetching staff count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

//ทรัพย์สิน
app.get('/count/products', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM products", (err, result) => {
        if (err) {
            console.error("Error fetching product count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

//พนักงาน
app.get('/count/employees', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM employees", (err, result) => {
        if (err) {
            console.error("Error fetching employee count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/count/staff_stock', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM staff_stock", (err, result) => {
        if (err) {
            console.error("Error fetching employee count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/count/manager', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM manager", (err, result) => {
        if (err) {
            console.error("Error fetching employee count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/count/admin', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM admin", (err, result) => {
        if (err) {
            console.error("Error fetching employee count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

//จำนวนรอดำเนินการทั้งหมด
app.get('/count/products_pending', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM approval_products where status = 'รอดำเนินการ'", (err, result) => {
        if (err) {
            console.error("Error fetching products_request count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

//ของพนักงานห
app.get('/count/products_pending/:userID', (req, res) => {
    const { userID } = req.params;
    db.query("SELECT COUNT(*) AS count FROM approval_products where status = 'รอดำเนินการ' && employee_id = ?", userID, (err, result) => {
        if (err) {
            console.error("Error fetching products_pending user count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/count/products_staff_approved/:userID', (req, res) => {
    const { userID } = req.params;
    db.query("SELECT COUNT(*) AS count FROM approval_products where status = 'ได้รับการอนุมัติจากเจ้าหน้าที่' && employee_id = ?", userID, (err, result) => {
        if (err) {
            console.error("Error fetching products_staff_approved/:userID count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/count/products_manager_approved/:userID', (req, res) => {
    const { userID } = req.params;
    db.query("SELECT COUNT(*) AS count FROM approval_products where status = 'ได้รับการอนุมัติจากผู้จัดการ' && employee_id = ?", userID, (err, result) => {
        if (err) {
            console.error("Error fetching products_manager_approved/:userID count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/count/products_refused/:userID', (req, res) => {
    const { userID } = req.params;
    db.query("SELECT COUNT(*) AS count FROM approval_products where status = 'ถูกปฏิเสธ' && employee_id = ?", userID, (err, result) => {
        if (err) {
            console.error("Error fetching products_refused count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});


app.get('/count/product_available', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM products where status = 'มี'", (err, result) => {
        if (err) {
            console.error("Error fetching employee count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/count/product_out_of_stock', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM products where status = 'หมด'", (err, result) => {
        if (err) {
            console.error("Error fetching employee count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});
//จบ ของพนักงาน

//จำนวน ได้รับการอนุมัติจากเจ้าหน้าที่ ทั้งหมด
app.get('/count/products_staff_approved', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM approval_products where status = 'ได้รับการอนุมัติจากเจ้าหน้าที่'", (err, result) => {
        if (err) {
            console.error("Error fetching products_request count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

//จำนวน ได้รับการอนุมัติจากผู้จัดการ ทั้งหมด
app.get('/count/products_manager_approved', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM approval_products where status = 'ได้รับการอนุมัติจากผู้จัดการ'", (err, result) => {
        if (err) {
            console.error("Error fetching products_request count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

//จำนวน ได้รับการอนุมัติจากผู้จัดการ ทั้งหมด
app.get('/count/products_refused', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM approval_products where status = 'ถูกปฏิเสธ'", (err, result) => {
        if (err) {
            console.error("Error fetching products_request count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

//end dashboard

// Define the /product route
app.get('/product', (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("An error occurred while retrieving product data.");
        } else {
            const products = result.map(product => ({
                ...product,
                image: product.image ? Buffer.from(product.image).toString('base64') : null
            }));
            res.json(products);
        }
    });
});

app.post('/addproduct', upload.single('image'), (req, res) => {
    const { name, type, qty } = req.body;
    const image = req.file ? req.file.buffer : null; // Get the image buffer if uploaded

    // Set status based on quantity
    const status = qty > 0 ? "มี" : "หมด";

    // Correct the SQL statement to match the number of values
    const sqlInsert = "INSERT INTO products (name, type, qty, image, status) VALUES (?, ?, ?, ?, ?)";

    db.query(sqlInsert, [name, type, qty, image, status], (err, result) => {
        if (err) {
            console.error("Error inserting product:", err);
            res.status(500).send("An error occurred while inserting the product.");
        } else {
            res.status(201).send("Product added successfully!");
        }
    });
});


// Define the /user route with position-based query
app.get('/user', (req, res) => {
    const { position } = req.query;
    const table = position === 'employee' ? 'employees' :
        position === 'staff_stock' ? 'staff_stock' :
            position === 'staff' ? 'staff' : 'manager';

    db.query(`SELECT * FROM ${table}`, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("An error occurred while retrieving user data.");
        } else {
            const users = result.map(user => ({
                ...user,
                image: user.image ? Buffer.from(user.image).toString('base64') : null
            }));
            res.json(users);
        }
    });
});

// Define the /adduser route
app.post('/adduser', upload.single('image'), (req, res) => {
    const { username, password, firstname, lastname, phone, position } = req.body;
    const table = position === 'employee' ? 'employees' :
        position === 'staff' ? 'staff' :
            position === 'staff_stock' ? 'staff_stock' : 'manager';
    const image = req.file ? req.file.buffer : null; // Get the image buffer if uploaded

    const sqlInsert = `INSERT INTO ${table} (username, password, firstname, lastname, phone, image) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sqlInsert, [username, password, firstname, lastname, phone, image], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            res.status(500).send("An error occurred while inserting the user.");
        } else {
            res.status(201).send("User added successfully!");
        }
    });
});

// GET: ดึงข้อมูลผู้ใช้ตาม userType และ userID
app.get('/getuser/:userType/:userID', (req, res) => {
    const { userType, userID } = req.params;
    const table = userType === 'employee' ? 'employees' :
        userType === 'staff' ? 'staff' :
            userType === 'staff_stock' ? 'staff_stock' :
                userType === 'manager' ? 'manager' : 'admin';

    const sqlQuery = `SELECT * FROM ${table} WHERE id = ?`;

    db.query(sqlQuery, [userID], (err, result) => {
        if (err) {
            console.error("Error fetching user:", err);
            res.status(500).send("An error occurred while fetching user data.");
        } else if (result.length === 0) {
            res.status(404).send("User not found");
        } else {
            const user = result[0];
            const userData = {
                ...user,
                image: user.image ? Buffer.from(user.image).toString('base64') : null // Convert binary image to base64
            };
            res.json(userData);
        }
    });
});

// PUT: อัปเดตข้อมูลผู้ใช้ตาม userType และ userID
app.put('/editupdateuser/:userType/:userID', upload.single('image'), (req, res) => {
    const { userType, userID } = req.params;
    const { username, newPassword, firstname, lastname, phone } = req.body;
    const table = userType === 'employee' ? 'employees' :
        userType === 'staff' ? 'staff' :
            userType === 'staff_stock' ? 'staff_stock' : 'manager';

    const image = req.file ? req.file.buffer : null; // Get the image buffer if uploaded

    let sqlUpdate = `UPDATE ${table} SET username = ?, password = ?, firstname = ?, lastname = ?, phone = ?`;
    const values = [username, newPassword, firstname, lastname, phone];

    if (image) {
        sqlUpdate += `, image = ?`;
        values.push(image); // Add the image to the values if provided
    }

    sqlUpdate += ` WHERE id = ?`;
    values.push(userID); // Add userID to the values array

    db.query(sqlUpdate, values, (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            res.status(500).send("An error occurred while updating the user.");
        } else {
            res.send("User updated successfully!");
        }
    });
});


// Delete a product
app.delete('/delete/product/:id', (req, res) => {
    const productId = req.params.id;

    db.query("DELETE FROM products WHERE id = ?", [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            res.status(500).send("There was an error deleting the product.");
        } else {
            res.send("Product deleted successfully!");
        }
    });
});

// Delete a staff member
app.delete('/delete/staff/:id', (req, res) => {
    const staffId = req.params.id;

    db.query("DELETE FROM staff WHERE id = ?", [staffId], (err, result) => {
        if (err) {
            console.error("Error deleting staff member:", err);
            res.status(500).send("There was an error deleting the staff member.");
        } else {
            res.send("Staff member deleted successfully!");
        }
    });
});

// Delete a employee
app.delete('/delete/employee/:id', (req, res) => {
    const employeeId = req.params.id;
    db.query("DELETE FROM employees WHERE id = ?", [employeeId], (err, result) => {
        if (err) {
            console.error("Error deleting employee:", err);
            res.status(500).send("There was an error deleting the employee.");
        } else {
            res.send("employee deleted successfully!");
        }
    });
});

// Delete a staff_stock
app.delete('/delete/staff_stock/:id', (req, res) => {
    const staff_stockId = req.params.id;
    db.query("DELETE FROM staff_stock WHERE id = ?", [staff_stockId], (err, result) => {
        if (err) {
            console.error("Error deleting staff_stock:", err);
            res.status(500).send("There was an error deleting the staff_stock.");
        } else {
            res.send("staff_stock deleted successfully!");
        }
    });
});

// Delete a manager
app.delete('/delete/manager/:id', (req, res) => {
    const managerId = req.params.id;
    db.query("DELETE FROM manager WHERE id = ?", [managerId], (err, result) => {
        if (err) {
            console.error("Error deleting manager:", err);
            res.status(500).send("There was an error deleting the manager.");
        } else {
            res.send("manager deleted successfully!");
        }
    });
});

// Define the /updateproduct route
app.put('/updateproduct/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, type, qty } = req.body;
    const image = req.file ? req.file.buffer : null; // Get the image buffer if uploaded

    const status = qty > 0 ? "มี" : "หมด";

    let sqlUpdate = "UPDATE products SET name = ?, type = ?, qty = ?, status = ?";
    const params = [name, type, qty, status];

    if (image) {
        sqlUpdate += ", image = ?";
        params.push(image);
    }

    sqlUpdate += " WHERE id = ?";
    params.push(id);

    db.query(sqlUpdate, params, (err, result) => {
        if (err) {
            console.error("Error updating product:", err);
            res.status(500).send("An error occurred while updating the product.");
        } else {
            res.send("Product updated successfully!");
        }
    });
});

// Define the /updateuser route
app.put('/updateuser/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { username, password, firstname, lastname, phone, position } = req.body;
    const table = position === 'employee' ? 'employees' :
        position === 'staff' ? 'staff' :
            position === 'staff_stock' ? 'staff_stock' : 'manager';
    const image = req.file ? req.file.buffer : null;

    let sqlUpdate = `UPDATE ${table} SET username = ?, password = ?, firstname = ?, lastname = ?, phone = ?`;
    const params = [username, password, firstname, lastname, phone];

    if (image) {
        sqlUpdate += ", image = ?";
        params.push(image);
    }

    sqlUpdate += " WHERE id = ?";
    params.push(id);

    db.query(sqlUpdate, params, (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            res.status(500).send("An error occurred while updating the user.");
        } else {
            res.send("User updated successfully!");
        }
    });
});

// Define the /login route
app.post('/login', (req, res) => {
    const { username, password, userType } = req.body;

    const table = userType === 'employee' ? 'employees' :
        userType === 'admin' ? 'admin' :
            userType === 'staff_stock' ? 'staff_stock' :
                userType === 'staff' ? 'staff' : 'manager';


    db.query(`SELECT * FROM ${table} WHERE username = ?`, [username], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("An error occurred during login.");
        } else if (results.length === 0) {
            res.status(401).send("Invalid username or password.");
        } else {
            const user = results[0];
            if (password === user.password) {
                res.status(200).json({
                    message: "Login successful!",
                    userID: user.id,
                    name: user.firstname,
                    image: user.image ? Buffer.from(user.image).toString('base64') : null
                });
            } else {
                res.status(401).send("Invalid username or password.");
            }
        }
    });
});

app.post('/request-product', (req, res) => {
    const { employee_id, product_id, quantity, reason } = req.body;


    const insertQuery = 'INSERT INTO approval_products (employee_id, product_id, quantity, reason) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [employee_id, product_id, quantity, reason], (err, results) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการแทรกคำขอ:', err);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการประมวลผลคำขอ' });
        }

        // ตรวจสอบปริมาณสินค้าก่อนการอัปเดต
        const checkQuery = 'SELECT qty FROM products WHERE id = ?';
        db.query(checkQuery, [product_id], (err, rows) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการตรวจสอบปริมาณสินค้า:', err);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบปริมาณสินค้า' });
            }

            const currentQty = rows[0]?.qty;

            if (currentQty === undefined) {
                return res.status(404).json({ message: 'ไม่พบสินค้าที่ระบุ' });
            }

            // อัปเดตปริมาณสินค้า, จำนวนที่รอการอนุมัติ และสถานะ
            const newQty = currentQty - quantity;
            const status = newQty <= 0 ? 'หมด' : 'มี'; // กำหนดสถานะตามปริมาณใหม่

            const updateQuery = `
                UPDATE products 
                SET qty = ?, 
                    pending = pending + ?, 
                    status = ?
                WHERE id = ?
            `;

            db.query(updateQuery, [newQty, quantity, status, product_id], (err, results) => {
                if (err) {
                    console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูลสินค้า:', err);
                    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลสินค้า' });
                }

                // การทำงานของทั้งสองคำสั่งสำเร็จ
                return res.status(200).json({ message: 'ส่งคำขอแล้ว, อัปเดตผลิตภัณฑ์สำเร็จ' });
            });
        });
    });
});

app.delete('/delete_approval_request/:request_id', (req, res) => {
    const requestId = req.params.request_id;

    // Fetch product_id and quantity from the approval request
    const selectQuery = 'SELECT product_id, quantity FROM approval_products WHERE request_id = ?';
    db.query(selectQuery, [requestId], (err, results) => {
        if (err) {
            console.error('Error fetching request details:', err);
            return res.status(500).json({ message: 'Error fetching request details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const { product_id, quantity } = results[0];

        // Update the request status to "ยกเลิกโดยพนักงาน"
        const updateStatusQuery = `
            UPDATE approval_products
            SET status = 'ยกเลิกโดยพนักงาน'
            WHERE request_id = ?`;
        db.query(updateStatusQuery, [requestId], (err, result) => {
            if (err) {
                console.error('Error updating request status:', err);
                return res.status(500).json({ message: 'Error updating request status' });
            }

            // If the status was updated, update the product's pending and quantity fields
            const updateProductQuery = `
                UPDATE products
                SET pending = pending - ?, 
                    qty = qty + ?, 
                    status = CASE 
                        WHEN qty + ? > 0 THEN 'มี' 
                        ELSE 'หมด' 
                    END
                WHERE id = ?
            `;
            db.query(updateProductQuery, [quantity, quantity, quantity, product_id], (err, updateResult) => {
                if (err) {
                    console.error('Error updating product pending and quantity:', err);
                    return res.status(500).json({ message: 'Error updating product pending and quantity' });
                }

                res.status(200).json({ message: 'Request canceled and product updated successfully' });
            });
        });
    });
});

app.get('/approval_all_list', (req, res) => {
    const employee_id = req.query.employee_id;
    const query = `
    SELECT ap.request_id, ap.product_id, ap.employee_id, ap.quantity, ap.reason, ap.request_date, ap.status, 
           ap.staff_remark,ap.manager_remark,p.name AS product_name, p.image AS product_image, e.firstname AS emp_firstname, 
           e.lastname AS emp_lastname, e.phone AS emp_phone, m.firstname AS m_firstname, s.firstname AS staff_firstname
    FROM approval_products ap
    LEFT JOIN manager m ON ap.manager_approved_by = m.id
    LEFT JOIN staff s ON ap.staff_approved_by = s.id
    JOIN products p ON ap.product_id = p.id
    JOIN employees e ON ap.employee_id = e.id

    ORDER BY ap.request_date DESC;
  `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching requests.' });
        }

        // Convert each product image (if it exists) to base64
        results.forEach(result => {
            if (result.product_image) {
                result.product_image = Buffer.from(result.product_image).toString('base64');
            }
        });

        res.json(results); // Send the results to the frontend
    });
});

app.get('/approval_employee_list', (req, res) => {
    const employee_id = req.query.employee_id;
    const query = `
    SELECT ap.request_id, ap.product_id, ap.employee_id, ap.quantity, ap.reason, ap.request_date, ap.status, 
           ap.staff_remark,ap.manager_remark,p.name AS product_name, p.image AS product_image, e.firstname AS emp_firstname, 
           e.lastname AS emp_lastname, e.phone AS emp_phone, m.firstname AS m_firstname, s.firstname AS staff_firstname
    FROM approval_products ap
    LEFT JOIN manager m ON ap.manager_approved_by = m.id
    LEFT JOIN staff s ON ap.staff_approved_by = s.id
    JOIN products p ON ap.product_id = p.id
    JOIN employees e ON ap.employee_id = e.id
    WHERE ap.employee_id = ?
    ORDER BY ap.request_date DESC;
  `;

    db.query(query, [employee_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching requests.' });
        }

        // Convert each product image (if it exists) to base64
        results.forEach(result => {
            if (result.product_image) {
                result.product_image = Buffer.from(result.product_image).toString('base64');
            }
        });

        res.json(results); // Send the results to the frontend
    });
});

app.get('/approval_staff_list', (req, res) => {
    const query = `
      SELECT ap.request_id, ap.product_id, ap.quantity, ap.reason, ap.request_date, ap.status, p.name AS product_name, p.image AS product_image,e.firstname AS emp_firstname,e.lastname AS emp_lastname,e.phone AS emp_phone
      FROM approval_products ap
      JOIN products p ON ap.product_id = p.id
      JOIN employees e ON ap.employee_id = e.id
      WHERE ap.status = 'รอดำเนินการ'
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching requests.' });
        }

        // Convert each product image (if it exists) to base64
        results.forEach(result => {
            if (result.product_image) {
                result.product_image = Buffer.from(result.product_image).toString('base64');
            }
        });

        res.json(results);
    });
});

app.get('/approval_manager_list', (req, res) => {
    const query = `
      SELECT ap.request_id, ap.product_id, ap.quantity, ap.reason, ap.staff_remark, ap.request_date, ap.status, p.name AS product_name, p.image AS product_image,e.firstname AS emp_firstname,e.lastname AS emp_lastname,e.phone AS emp_phone, s.firstname AS staff_firstname, s.lastname AS staff_lastname
      FROM approval_products ap
      JOIN products p ON ap.product_id = p.id
      JOIN employees e ON ap.employee_id = e.id
      JOIN staff s ON ap.staff_approved_by = s.id
      WHERE ap.status = 'ได้รับการอนุมัติจากเจ้าหน้าที่'
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching requests.' });
        }

        // Convert each product image (if it exists) to base64
        results.forEach(result => {
            if (result.product_image) {
                result.product_image = Buffer.from(result.product_image).toString('base64');
            }
        });

        res.json(results);
    });
});

app.post('/approve_staff', (req, res) => {
    const { staffID, request_id, status, staff_remark, Request_qty, product_id } = req.body;

    // SQL statement to update approval status
    const sql = 'UPDATE approval_products SET staff_approved_by = ?, status = ?, staff_remark = ?, staff_approval_date = NOW() WHERE request_id = ?';
    const values = [staffID, status, staff_remark, request_id];

    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error updating request status:', error);
            return res.status(500).json({ message: 'Error updating request status' });
        }

        // If status is rejected, update both pending and qty
        if (status === 'ถูกปฏิเสธ') {
            const sql_productupdate = 'UPDATE products SET pending = (pending - ?), qty = (qty + ?) WHERE id = ?';
            const values_productupdate = [Request_qty, Request_qty, product_id];

            db.query(sql_productupdate, values_productupdate, (error, results) => {
                if (error) {
                    console.error('Error updating product status:', error);
                    return res.status(500).json({ message: 'Error updating product status' });
                }

                // Check if qty > 0, and if so, update the product status to 'มี'
                const sql_check_qty = 'UPDATE products SET status = "มี" WHERE id = ? AND qty > 0';
                db.query(sql_check_qty, [product_id], (error, results) => {
                    if (error) {
                        console.error('Error updating product availability status:', error);
                        return res.status(500).json({ message: 'Error updating product availability status' });
                    }

                    // Send response after all updates are completed
                    return res.status(200).json({ message: 'Request and product status updated successfully', results });
                });
            });
        } else {
            // If status is not rejected, send the response immediately
            res.status(200).json({ message: 'Request status updated successfully', results });
        }
    });
});

app.post('/approve_manager', (req, res) => {
    const { managerID, request_id, status, manager_remark, Request_qty, product_id } = req.body;

    // SQL statement to update approval status
    const sql_approvalupdate = 'UPDATE approval_products SET manager_approved_by = ?, status = ?, manager_remark = ?, manager_approval_date = NOW() WHERE request_id = ?';
    const values_approvalupdate = [managerID, status, manager_remark, request_id];

    db.query(sql_approvalupdate, values_approvalupdate, (error, results) => {
        if (error) {
            console.error('Error updating request status:', error);
            return res.status(500).json({ message: 'Error updating request status' });
        }

        let sql_productupdate;
        let values_productupdate;

        // Check if the status is rejected
        if (status === 'ถูกปฏิเสธ') {
            // Update both pending and qty
            sql_productupdate = 'UPDATE products SET pending = (pending - ?), qty = (qty + ?) WHERE id = ?';
            values_productupdate = [Request_qty, Request_qty, product_id];
        } else {
            // Only update pending
            sql_productupdate = 'UPDATE products SET pending = (pending - ?) WHERE id = ?';
            values_productupdate = [Request_qty, product_id];
        }

        db.query(sql_productupdate, values_productupdate, (error, results) => {
            if (error) {
                console.error('Error updating product status:', error);
                return res.status(500).json({ message: 'Error updating product status' });
            }

            // Check if qty is greater than 0 to update product status to 'มี'
            const sql_check_qty = 'UPDATE products SET status = "มี" WHERE id = ? AND qty > 0';
            db.query(sql_check_qty, [product_id], (error, results) => {
                if (error) {
                    console.error('Error updating product availability status:', error);
                    return res.status(500).json({ message: 'Error updating product availability status' });
                }

                // Send response after all queries are successful
                res.status(200).json({ message: 'Request and product status updated successfully', results });
            });
        });
    });
});

// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
