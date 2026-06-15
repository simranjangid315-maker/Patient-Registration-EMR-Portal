import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AddAppointment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    date: "",
    hour: "",
    minute: "",
    meridian: "AM",
    reason: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Convert dropdown values to 24-hour format
  const convertTo24Hour = (hour, minute, meridian) => {
    let h = parseInt(hour, 10);
    if (meridian === "PM" && h < 12) h += 12;
    if (meridian === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${minute}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    const apptDate = new Date(form.date).toLocaleDateString("en-CA");

    // Prevent past dates
    if (apptDate < today) {
      alert("❌ You cannot select a past date for an appointment.");
      return;
    }

    const time24 = convertTo24Hour(form.hour, form.minute, form.meridian);

    // Prevent past times if date is today
    if (apptDate === today) {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS
      if (time24 < currentTime) {
        alert("❌ You cannot select a past time for today's appointment.");
        return;
      }
    }

    const appointmentData = {
      patientName: form.patientName,
      phone: form.phone,
      email: form.email,
      date: form.date,
      time: time24, // always in HH:MM:SS format
      reason: form.reason
    };

    try {
      await API.post("/appointments", appointmentData);
      alert("✅ Appointment added successfully");
      navigate("/patients");
    } catch (err) {
      console.error("Error adding appointment:", err);

      if (err.response && err.response.status === 409) {
        alert("⚠️ This slot is already taken. Please choose another time.");
      } else {
        alert(err.response?.data?.message || "❌ Failed to add appointment");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 text-white">
        
        {/*Heading outside the form card */}
        <h1 className="text-3xl font-bold mb-6 text-purple-400">
          Add Appointment
        </h1>

        <div className="bg-[#2e2e4f] shadow-xl rounded-2xl p-8 w-full max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              onChange={handleChange}
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              required
            />

            <input
              type="date"
              name="date"
              onChange={handleChange}
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              required
            />

            {/* Hour/Minute/AM-PM dropdowns */}
            <div className="flex gap-4">
              <select
                name="hour"
                value={form.hour}
                onChange={handleChange}
                className="w-1/3 border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
                required
              >
                <option value="">Hour</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                name="minute"
                value={form.minute}
                onChange={handleChange}
                className="w-1/3 border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
                required
              >
                <option value="">Minute</option>
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                name="meridian"
                value={form.meridian}
                onChange={handleChange}
                className="w-1/3 border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
                required
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <textarea
              name="reason"
              placeholder="Reason for Appointment"
              onChange={handleChange}
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              required
            />

            <button className="bg-purple-600 hover:bg-purple-700 text-white w-full p-3 rounded">
              Save Appointment
            </button>
          </form>

          {/* Back Button */}
          <button
            onClick={() => navigate("/home")}
            className="mt-6 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 w-full"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
