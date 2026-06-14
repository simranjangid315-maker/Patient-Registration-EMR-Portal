import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";   // bcryptjs works well on Windows
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection (use pool, not top-level await)
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "MySQL@315",
  database: process.env.DB_NAME || "emr_portal",
});

// Register route
app.post("/auth/register", async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)",
      [fullname, email, hashedPassword, role || "patient"] // default patient
    );

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Login route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "emr_secret_key",
      { expiresIn: "1h" }
    );

    res.json({
  message: "Login successful",
  fullname: user.fullname,
  email: user.email,   // add this
  role: user.role,
  token
});

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Patients routes
app.post("/patients", async (req, res) => {
  try {
    const { fullname, gender, age, bloodgroup, phone, address } = req.body;

    if (!fullname || !gender || !age) {
      return res.status(400).json({ message: "Fullname, gender, and age are required" });
    }

    await db.query(
      "INSERT INTO patients (fullname, gender, age, bloodgroup, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
      [fullname, gender, age, bloodgroup || null, phone || null, address || null]
    );

    res.status(201).json({ message: "Patient added successfully" });
  } catch (err) {
    console.error("Error adding patient:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/patients", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM patients ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching patients:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Delete Patient route
app.delete("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM patients WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error("Error deleting patient:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Appointments routes
app.post("/appointments", async (req, res) => {
  try {
    const { patientName, phone, email, date, time, reason } = req.body;
    if (!patientName || !phone || !email || !date || !time || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if slot already taken
    const [existing] = await db.query(
      "SELECT * FROM appointments WHERE date = ? AND time = ?",
      [date, time]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "This slot is already taken" });
    }

    // Insert new appointment with phone + email
    await db.query(
      "INSERT INTO appointments (patientName, phone, email, date, time, reason) VALUES (?, ?, ?, ?, ?, ?)",
      [patientName, phone, email, date, time, reason]
    );

    res.status(201).json({ message: "Appointment added successfully" });
  } catch (err) {
    console.error("Error inserting appointment:", err.message);
    res.status(500).json({ message: err.message });
  }
});
//  This is the GET route you asked about
app.get("/appointments", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, patientName, phone, email, date, time, reason FROM appointments ORDER BY date ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Cancel Appointment route
app.delete("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM appointments WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling appointment:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(process.env.PORT || 5001, () =>
  console.log(`Server running on port ${process.env.PORT || 5001}`)
);
