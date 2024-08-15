const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

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
        process.exit(1); // Exit the process with an error code
    } else {
        console.log("Connected to the MySQL database");
    }
});

// Define the /staff route
app.get('/staff', (req, res) => {
    db.query("SELECT * FROM staff", (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("An error occurred while retrieving staff data.");
        } else {
            res.json(result); // Send the result as JSON
        }
    });
});

// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});