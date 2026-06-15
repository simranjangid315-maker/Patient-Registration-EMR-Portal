import express from "express";
import {
  addAppointment,
  getAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

// POST /appointments → add new appointment
router.post("/", addAppointment);

// GET /appointments → fetch all appointments
router.get("/", getAppointments);

// PUT /appointments/:id → cancel appointment (update status instead of delete)
router.put("/:id", cancelAppointment);

export default router;
