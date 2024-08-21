const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer'); // To handle file uploads
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

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
    const { name, type, qty, status } = req.body;
    const image = req.file ? req.file.buffer : null; // Get the image buffer if uploaded

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


// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
