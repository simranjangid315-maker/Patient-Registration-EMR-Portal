import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Helper function to convert AM/PM → 24-hour format
function convertTo24Hour(time, period) {
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
}

export default function AddAppointment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientName: "",
    date: "",
    time: "",
    meridian: "AM", // AM/PM selector
    reason: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Convert time before sending
    const time24 = convertTo24Hour(form.time, form.meridian);

    const appointmentData = {
      patientName: form.patientName,
      date: form.date,
      time: time24, // ✅ always in HH:MM:SS format
      reason: form.reason
    };

    try {
      await API.post("/appointments", appointmentData);
      alert("Appointment added successfully");
      navigate("/patients");
    } catch (err) {
      console.error("Error adding appointment:", err);
      alert(err.response?.data?.message || "Failed to add appointment");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 bg-[#1a1a2e] min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Add Appointment</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#2e2e4f] p-6 rounded-lg shadow-lg max-w-lg mx-auto"
        >
          <input
            type="text"
            name="patientName"
            placeholder="Patient Name"
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              name="time"
              placeholder="HH:MM"
              onChange={handleChange}
              className="flex-1 p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
            />
            <select
              name="meridian"
              value={form.meridian}
              onChange={handleChange}
              className="p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <input
            type="text"
            name="reason"
            placeholder="Reason"
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
          />

          <button className="bg-purple-600 hover:bg-purple-700 text-white w-full p-3 rounded">
            Add Appointment
          </button>
        </form>

        <button
          onClick={() => navigate("/home")}
          className="mt-6 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          ← Back to Dashboard
        </button>
      </div>
    </>
  );
}
