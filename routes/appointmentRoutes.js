import express from "express";
import { addAppointment, getAppointments, cancelAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

// POST /appointments → add new appointment
router.post("/", addAppointment);

// GET /appointments → fetch all appointments
router.get("/", getAppointments);

// DELETE /appointments/:id → cancel appointment
router.delete("/:id", cancelAppointment);

export default router;
