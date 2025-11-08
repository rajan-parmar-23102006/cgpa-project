const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(cors());

const ADMIN_PASSWORD = "admin123";

// Database
const db = new sqlite3.Database("./database.sqlite3");
db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    enrollment TEXT,
    cgpa REAL
)`);

// Receive student data
app.post("/submit", (req, res) => {
    const { name, enrollment, cgpa } = req.body;
    db.run(`INSERT INTO students (name, enrollment, cgpa) VALUES (?, ?, ?)`,
        [name, enrollment, cgpa]);
    res.json({ message: "Saved" });
});

// Admin login
app.post("/login", (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) {
        return res.json({ success: true });
    }
    res.json({ success: false });
});

// Admin fetch data
app.get("/getData", (req, res) => {
    db.all("SELECT * FROM students", (err, rows) => {
        res.json(rows);
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
