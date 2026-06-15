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
    address: "",
    reason: ""   // new field
  });

  const [suggestions, setSuggestions] = useState([]);

  // City + State list
  const cities = [
    "Hyderabad, Telangana",
    "Secunderabad, Telangana",
    "Warangal, Telangana",
    "Karimnagar, Telangana",
    "Nizamabad, Telangana",
    "Khammam, Telangana",
    "Mahbubnagar, Telangana",
    "Adilabad, Telangana",
    "Sangareddy, Telangana",
    "Vijayawada, Andhra Pradesh",
    "Visakhapatnam, Andhra Pradesh",
    "Tirupati, Andhra Pradesh",
    "Chennai, Tamil Nadu",
    "Bengaluru, Karnataka",
    "Mumbai, Maharashtra",
    "Delhi, Delhi",
    "Kolkata, West Bengal",
    "Pune, Maharashtra",
    "Nagpur, Maharashtra",
    "Aurangabad, Maharashtra",
    "Coimbatore, Tamil Nadu",
    "Madurai, Tamil Nadu",
    "Lucknow, Uttar Pradesh",
    "Kanpur, Uttar Pradesh",
    "Agra, Uttar Pradesh",
    "Jaipur, Rajasthan",
    "Bhopal, Madhya Pradesh",
    "Indore, Madhya Pradesh",
    "Patna, Bihar",
    "Ranchi, Jharkhand",
    "Raipur, Chhattisgarh",
    "Chandigarh, Chandigarh",
    "Amritsar, Punjab",
    "Shimla, Himachal Pradesh",
    "Dehradun, Uttarakhand",
    "Noida, Uttar Pradesh",
    "Gurgaon, Haryana"
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "address") {
      const filtered = cities.filter((city) =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/patients", form);
      alert("Patient Added Successfully");
      navigate("/patients");
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Failed to add patient");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 text-white">
        
        <h1 className="text-3xl font-bold mb-6 text-purple-400">
          Add New Patient
        </h1>

        <div className="bg-[#2e2e4f] shadow-xl rounded-2xl p-8 w-full max-w-lg">
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

            {/* Address with city + state autocomplete */}
            <div className="relative">
              <input
                type="text"
                name="address"
                placeholder="Enter City, State"
                className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
                value={form.address}
                onChange={handleChange}
                required
              />
              {suggestions.length > 0 && (
                <ul className="absolute bg-gray-800 text-white w-full rounded mt-1 shadow-lg max-h-40 overflow-y-auto z-10">
                  {suggestions.map((city, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setForm({ ...form, address: city });
                        setSuggestions([]);
                      }}
                      className="p-2 hover:bg-purple-600 cursor-pointer"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Reason field */}
            <textarea
              name="reason"
              placeholder="Reason"
              className="w-full border border-purple-500 p-3 rounded bg-[#1a1a2e] text-white"
              value={form.reason}
              onChange={handleChange}
              rows="3"
            />

            <button
              type="submit"
              className="btn w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800"
            >
              Save Patient
            </button>
          </form>

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
