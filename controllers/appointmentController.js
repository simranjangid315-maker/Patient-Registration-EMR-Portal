import db from "../db.js";

// ✅ Add Appointment
export const addAppointment = async (req, res) => {
  try {
    const { patientName, date, time, reason } = req.body;

    // Debug log to confirm frontend sends correct format
    console.log("Received appointment:", { patientName, date, time, reason });

    // Insert into MySQL (expects TIME in HH:MM:SS)
    await db.query(
      "INSERT INTO appointments (patientName, date, time, reason) VALUES (?, ?, ?, ?)",
      [patientName, date, time, reason]
    );

    res.status(201).json({ message: "Appointment added successfully" });
  } catch (err) {
    console.error("Error adding appointment:", err);
    res.status(500).json({ message: "Failed to add appointment" });
  }
};

// ✅ Get All Appointments
export const getAppointments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM appointments ORDER BY date, time");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// ✅ Cancel Appointment
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
