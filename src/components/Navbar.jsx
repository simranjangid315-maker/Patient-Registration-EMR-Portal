import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const fullname = localStorage.getItem("fullname");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullname");
    navigate("/login");
  };

  return (
    <nav className="bg-purple-800 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 className="font-bold text-2xl">EMR Portal</h1>
      <div className="space-x-5 flex items-center">
        <span className="mr-4">Welcome, {fullname}</span>
        <Link to="/home" className="hover:text-purple-300">Dashboard</Link>
        <Link to="/patients" className="hover:text-purple-300">Patients</Link>
        <Link to="/add-patient" className="hover:text-purple-300">Add Patient</Link>
        <Link to="/add-appointment" className="hover:text-purple-300">Add Appointment</Link>
        <button onClick={logout} className="btn bg-red-600 px-4 py-1 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
}
