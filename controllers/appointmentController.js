import db from "../db.js";

// Add Appointment
export const addAppointment = async (req, res) => {
  try {
    const { patientName, phone, email, date, time, reason } = req.body;

    // Check for duplicate slot
    const [existing] = await db.query(
      "SELECT * FROM appointments WHERE date = ? AND time = ?",
      [date, time]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "This slot is already taken." });
    }

    // Insert new appointment
    await db.query(
      "INSERT INTO appointments (patientName, phone, email, date, time, reason) VALUES (?, ?, ?, ?, ?, ?)",
      [patientName, phone, email, date, time, reason]
    );

    res.status(201).json({ message: "Appointment added successfully" });
  } catch (err) {
    console.error("Error adding appointment:", err);
    res.status(500).json({ message: "Failed to add appointment" });
  }
};

// Get All Appointments
export const getAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, patientName, date, time, reason, phone, email FROM appointments ORDER BY date, time"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};


// Cancel Appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM appointments WHERE id = ?", [id]);
    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};
