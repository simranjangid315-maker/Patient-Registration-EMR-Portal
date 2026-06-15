import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "patient"   // default to patient
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900 text-white p-6">
      
      {/* Welcome message outside the card */}
      <h1 className="text-2xl font-semibold text-purple-300 mb-2">
        👋 Welcome to Patient EMR Portal
      </h1>
      <p className="text-gray-400 mb-6">
        Create your account to get started
      </p>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-purple-300 text-center mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            className="w-full p-3 mb-3 rounded bg-[#1a1a2e] text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 mb-3 rounded bg-[#1a1a2e] text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-[#1a1a2e] text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* Role Dropdown */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-[#1a1a2e] text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="patient">Patient</option>
            <option value="admin">Admin</option>
          </select>

          <button className="bg-purple-600 hover:bg-purple-700 text-white w-full p-3 rounded">
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-gray-300">
          Already have an account?
          <Link className="text-purple-400 ml-2 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
