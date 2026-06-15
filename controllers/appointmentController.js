import db from "../db.js";

// Add Appointment
export const addAppointment = async (req, res) => {
  try {
    const { patientName, phone, email, date, time, reason } = req.body;

    // Validation
    if (!patientName || !date || !time) {
      return res.status(400).json({ message: "Patient name, date, and time are required" });
    }

    // Check for duplicate slot
    const [existing] = await db.query(
      "SELECT * FROM appointments WHERE date = ? AND time = ?",
      [date, time]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "This slot is already taken." });
    }

    // Insert new appointment with default status
    await db.query(
      "INSERT INTO appointments (patientName, phone, email, date, time, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [patientName, phone || null, email || null, date, time, reason || null, "Scheduled"]
    );

    res.status(201).json({ message: "Appointment added successfully" });
  } catch (err) {
    console.error("❌ Error adding appointment:", err);
    res.status(500).json({ message: "Server error while adding appointment" });
  }
};

// Get All Appointments
export const getAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, patientName, date, time, reason, phone, email, status FROM appointments ORDER BY date, time"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    res.status(500).json({ message: "Server error while fetching appointments" });
  }
};

// Cancel Appointment (update status instead of delete)
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "UPDATE appointments SET status = ? WHERE id = ?",
      ["Cancelled", id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("❌ Error cancelling appointment:", err);
    res.status(500).json({ message: "Server error while cancelling appointment" });
  }
};
