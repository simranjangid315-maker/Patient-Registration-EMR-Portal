import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Home() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPatients = await API.get("/patients");
        setPatients(resPatients.data);

        const resAppointments = await API.get("/appointments");
        setAppointments(resAppointments.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  const total = patients.length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6">
        <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
          
          {/*  Total Patients Box */}
<div className="bg-[#2e2e4f] rounded-xl p-8 text-center w-72 h-48 flex flex-col justify-center">
  <h3 className="text-xl font-semibold text-purple-400 mb-3">Total Patients</h3>
  <p className="text-6xl font-bold text-purple-300">{total}</p>
</div>

{/*  Upcoming Appointments Box */}
<div className="bg-[#2e2e4f] rounded-xl p-8 w-96 h-auto text-center">
  <h3 className="text-xl font-semibold text-purple-400 mb-4">Upcoming Appointments</h3>
  {appointments.length === 0 ? (
    <p className="text-gray-400">No appointments scheduled.</p>
  ) : (
    <ul className="space-y-3 text-gray-300">
      {appointments.slice(0, 5).map((appt) => (
        <li key={appt.id} className="p-3 rounded bg-[#1a1a2e]">
          <p className="font-bold text-purple-300">{appt.patientName}</p>
          <p>{appt.date} at {appt.time}</p>
          <p className="text-sm text-gray-400">{appt.reason}</p>
        </li>
      ))}
    </ul>
  )}
</div>
        </div>
      </div>
    </>
  );
}
