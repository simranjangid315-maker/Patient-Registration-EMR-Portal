import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const patientEmail = localStorage.getItem("patientEmail"); // use email instead of fullname
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/appointments");
        // filter appointments by email
        const myAppointments = res.data.filter(
          (appt) => appt.email === patientEmail
        );
        setAppointments(myAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientEmail]);

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await API.delete(`/appointments/${id}`);
      alert("Appointment cancelled successfully");
      setAppointments(appointments.filter((appt) => appt.id !== id));
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patientEmail"); // clear email on logout
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900 text-white">
        <p>Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-purple-300">
          Patient Appointments & EMR Portal
        </h1>
        <div className="flex items-center space-x-6">
          <span className="text-lg">Welcome, {patientEmail}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-300 mb-6 text-center">
            My Appointments
          </h2>

          {appointments.length === 0 ? (
            <p className="text-gray-300 text-center">
              You have no upcoming appointments.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-purple-500 rounded-lg text-gray-300">
                <thead className="bg-purple-700 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Patient Name</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Day</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Reason</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {appointments.map((appt) => {
                    const dayName = new Date(appt.date).toLocaleDateString(
                      "en-US",
                      { weekday: "long" }
                    );
                    return (
                      <tr
                        key={appt.id}
                        className="odd:bg-[#1a1a2e] even:bg-[#2e2e4f]"
                      >
                        <td className="px-4 py-2">{appt.patientName}</td>
                        <td className="px-4 py-2">{appt.date}</td>
                        <td className="px-4 py-2">{dayName}</td>
                        <td className="px-4 py-2">{appt.time}</td>
                        <td className="px-4 py-2">{appt.reason}</td>
                        <td className="px-4 py-2">{appt.phone}</td>
                        <td className="px-4 py-2">{appt.email}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => cancelAppointment(appt.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
