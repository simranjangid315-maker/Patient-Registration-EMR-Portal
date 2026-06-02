import express from "express";
import { addAppointment, getAppointments } from "../controllers/appointmentController.js";

const router = express.Router();

// POST /appointments → add new appointment
router.post("/", addAppointment);

// GET /appointments → fetch all appointments
router.get("/", getAppointments);

// DELETE /appointments/:id → cancel appointment
// (optional if you want cancellation support)
import { cancelAppointment } from "../controllers/appointmentController.js";
router.delete("/:id", cancelAppointment);

export default router;
