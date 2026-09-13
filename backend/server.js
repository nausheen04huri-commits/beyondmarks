const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("BeyondMarks Backend is running!");
});

app.get("/api/test", (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
app.post("/api/students", (req, res) => {
    const { student_id, name, department, attendance } = req.body;

    const sql = `
        INSERT INTO students (student_id, name, department, attendance)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [student_id, name, department, attendance],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Student added successfully!",
                id: result.insertId
            });
        }
    );
});