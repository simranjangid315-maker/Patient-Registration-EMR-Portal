import API from "./api"; // your axios instance pointing to http://localhost:5001

// Register user via backend
export async function registerUser(user) {
  try {
    const res = await API.post("/auth/register", user);
    return res.data; // { message: "Registration successful" }
  } catch (err) {
    throw err.response?.data?.message || "Registration failed";
  }
}

// Login user via backend
export async function loginUser(email, password) {
  try {
    const res = await API.post("/auth/login", { email, password });

    // Save returned data in localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("fullname", res.data.fullname);
    localStorage.setItem("patientEmail", res.data.email); // ✅ now available
    localStorage.setItem("role", res.data.role);

    return res.data; // { message, fullname, email, role, token }
  } catch (err) {
    throw err.response?.data?.message || "Login failed";
  }
}
