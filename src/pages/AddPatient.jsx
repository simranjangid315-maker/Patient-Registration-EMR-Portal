import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AddPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    gender: "",
    age: "",
    bloodgroup: "",
    phone: "",
    address: ""
  });

  //  Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/patients", form); // backend route
      alert("Patient Added Successfully");
      navigate("/patients"); // redirect to Patients list
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Failed to add patient");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6 text-white">
        <div className="bg-[#2e2e4f] shadow-xl rounded-2xl p-8 w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
            Add New Patient
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="fullname"
              placeholder="Full Name"
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              value={form.fullname}
              onChange={handleChange}
              required
            />
            <select
              name="gender"
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              value={form.age}
              onChange={handleChange}
              required
            />
            <select
              name="bloodgroup"
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              value={form.bloodgroup}
              onChange={handleChange}
              required
            >
              <option value="">Blood Group</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option>
              <option>AB+</option><option>AB-</option>
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="address"
              placeholder="Address"
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              value={form.address}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="btn w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800"
            >
              Save Patient
            </button>
          </form>

          {/*  Back Button */}
          <button
            onClick={() => navigate("/home")}
            className="btn mt-6 w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
