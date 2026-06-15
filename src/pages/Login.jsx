import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
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
      const res = await API.post("/auth/login", form);

      // Store token, fullname, email, and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fullname", res.data.fullname);
      localStorage.setItem("patientEmail", res.data.email); // fixed: use res.data
      localStorage.setItem("role", res.data.role);

      alert("Login Successful");

      // Role-based redirect
      if (res.data.role === "admin") {
        navigate("/home");
      } else {
        navigate("/my-appointments");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900 text-white p-6">
      
      {/* Welcome message outside the card */}
      <h1 className="text-2xl font-semibold text-purple-300 mb-2">
        🔐 Welcome Back
      </h1>
      <p className="text-gray-400 mb-6">
        Please login to continue
      </p>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-purple-300 mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 mb-3 rounded bg-[#1a1a2e] text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-[#1a1a2e] text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button className="bg-purple-600 hover:bg-purple-700 text-white w-full p-3 rounded">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-300">
          New User?
          <Link to="/" className="text-purple-400 ml-2 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
