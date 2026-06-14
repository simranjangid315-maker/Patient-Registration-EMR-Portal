import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch patients + appointments
  const fetchData = async () => {
    try {
      const resPatients = await API.get("/patients");
      setPatients(resPatients.data);

      const resAppointments = await API.get("/appointments");
      setAppointments(resAppointments.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPatients = patients.length;

  // Today's date string (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];
  const appointmentsToday = appointments.filter((a) => a.date === today);

  // Cancelled appointments
  const cancelledAppointments = appointments.filter((a) => a.status === "Cancelled");

  // Recent patients (last 5 added)
  const recentPatients = patients.slice(-5).reverse();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
          <p>Loading dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center p-6 text-white">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">

          {/* Total Patients */}
          <div className="bg-[#2e2e4f] rounded-xl p-8 text-center shadow-lg hover:shadow-purple-500/30 transition flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-purple-400 mb-3 flex items-center justify-center gap-2">
              👥 Total Patients
            </h3>
            <p className="text-6xl font-bold text-purple-300">{totalPatients}</p>
            <button
              onClick={() => navigate("/add-patient")}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              ➕ Add Patient
            </button>
          </div>

          {/* Upcoming Appointments Box */}
<div className="bg-[#2e2e4f] rounded-xl p-8 shadow-lg hover:shadow-purple-500/30 transition text-center w-96 h-80 flex flex-col">
  <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center justify-center gap-2">
    🗓️ Upcoming Appointments
  </h3>

  <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-[#1a1a2e]">
    {appointments.length === 0 ? (
      <p className="text-gray-400 italic">No upcoming appointments</p>
    ) : (
      <ul className="space-y-3 text-gray-300">
        {appointments.slice(0, 10).map((appt) => (
          <li
            key={appt.id}
            className="p-3 rounded bg-[#1a1a2e] hover:bg-[#24243e] transition"
          >
            <p className="font-bold text-purple-300">{appt.patientName}</p>
            <p>
              {new Date(appt.date).toLocaleDateString("en-IN", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
              })} • {appt.time}
            </p>
            <p className="text-sm text-gray-400">{appt.reason}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>


          {/* Appointments Today */}
          <div className="bg-[#2e2e4f] rounded-xl p-8 text-center shadow-lg hover:shadow-purple-500/30 transition flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-purple-400 mb-3 flex items-center justify-center gap-2">
              ⚡ Appointments Today
            </h3>
            <p className="text-5xl font-bold text-purple-300">{appointmentsToday.length}</p>
            <button
              onClick={() => navigate("/appointments")}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              View All
            </button>
          </div>

          {/* Cancelled Appointments */}
          <div className="bg-[#2e2e4f] rounded-xl p-8 text-center shadow-lg hover:shadow-red-500/30 transition flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-red-400 mb-3 flex items-center justify-center gap-2">
              ❌ Cancelled Appointments
            </h3>
            <p className="text-5xl font-bold text-red-300">{cancelledAppointments.length}</p>
          </div>

          {/* Recent Patients */}
          <div className="bg-[#2e2e4f] rounded-xl p-8 shadow-lg hover:shadow-purple-500/30 transition col-span-2 md:col-span-3">
            <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
              🆕 Recent Patients
            </h3>
            {recentPatients.length === 0 ? (
              <p className="text-gray-400 italic">No patients added yet</p>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-5 gap-4 text-gray-300">
                {recentPatients.map((p) => (
                  <li
                    key={p.id}
                    className="p-3 rounded bg-[#1a1a2e] hover:bg-[#24243e] transition text-center"
                  >
                    <p className="font-bold text-purple-300">{p.fullname}</p>
                    <p className="text-sm text-gray-400">Age {p.age}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 mt-10 text-sm">
          © 2026 Patient EMR Portal — Designed by Simran
        </footer>
      </div>
    </>
  );
}
