import express from "express";
import db from "../config/db.js";

const router = express.Router();

//  Add new patient
router.post("/", async (req, res) => {
  try {
    const { fullname, gender, age, bloodgroup, phone, address } = req.body;

    // Validation (only check required ones)
    if (!fullname || !gender || !age) {
      return res.status(400).json({ message: "Fullname, gender, and age are required" });
    }

    await db.query(
      "INSERT INTO patients (fullname, gender, age, bloodgroup, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
      [fullname, gender, age, bloodgroup || null, phone || null, address || null]
    );

    res.status(201).json({ message: "Patient added successfully" });
  } catch (err) {
    console.error("❌ Error adding patient:", err.message);
    res.status(500).json({ message: err.message });
  }
});
// DELETE patient by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM patients WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Get all patients
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM patients ORDER BY id DESC");
    res.json(rows);
  }catch (err) {
  console.error("❌ Error fetching patients:", err.message);
  res.status(500).json({ message: err.message });
}

});

export default router;
