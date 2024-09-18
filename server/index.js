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

app.get('/count/teachers', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM teachers", (err, result) => {
        if (err) {
            console.error("Error fetching teacher count:", err);
            res.status(500).send({ count: 0 });
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/count/orders', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM orders", (err, result) => {
        if (err) {
            console.error("Error fetching order count:", err);
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

// Define the /addproduct route
app.post('/addproduct', upload.single('image'), (req, res) => {
    const { name, type, qty } = req.body;
    const image = req.file ? req.file.buffer : null; // Get the image buffer if uploaded

    const status = qty > 0 ? 1 : 0;

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
    const table = position === 'teacher' ? 'teachers' : 'staff';

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
    const table = position === 'teacher' ? 'teachers' : 'staff';
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

// Delete a teacher
app.delete('/delete/teacher/:id', (req, res) => {
    const teacherId = req.params.id;

    db.query("DELETE FROM teachers WHERE id = ?", [teacherId], (err, result) => {
        if (err) {
            console.error("Error deleting teacher:", err);
            res.status(500).send("There was an error deleting the teacher.");
        } else {
            res.send("Teacher deleted successfully!");
        }
    });
});

// Define the /updateproduct route
app.put('/updateproduct/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, type, qty } = req.body;
    const image = req.file ? req.file.buffer : null; // Get the image buffer if uploaded

    const status = qty > 0 ? 1 : 0;

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
    const table = position === 'teacher' ? 'teachers' : 'staff';
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

    const table = userType === 'teacher' ? 'teachers' :
                  userType === 'admin' ? 'admin' : 'staff';

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
                    name: user.firstname,
                    image: user.image ? Buffer.from(user.image).toString('base64') : null
                });
            } else {
                res.status(401).send("Invalid username or password.");
            }
        }
    });
});


// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
