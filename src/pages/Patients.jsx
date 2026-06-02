import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  //  Fetch patients and appointments
  const fetchData = async () => {
    const resPatients = await API.get("/patients");
    setPatients(resPatients.data);

    const resAppointments = await API.get("/appointments");
    setAppointments(resAppointments.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  Delete patient
  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    await API.delete(`/patients/${id}`);
    fetchData();
  };

  //  Cancel appointment
  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    await API.delete(`/appointments/${id}`);
    fetchData();
  };

  const filteredPatients = patients.filter((p) =>
    p.fullname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-8 bg-[#1a1a2e] min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Patients List</h1>

        <input
          className="border border-purple-500 p-2 w-full mb-4 rounded bg-[#2e2e4f] text-white"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Patients Table */}
        <div className="bg-[#2e2e4f] shadow-lg rounded-xl overflow-hidden mb-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="p-4">Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.id} className="border-b hover:bg-purple-900">
                  <td className="p-4">{p.fullname}</td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.bloodgroup}</td>
                  <td>{p.phone}</td>
                  <td>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => deletePatient(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Appointments Table */}
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Appointments List</h1>
        <div className="bg-[#2e2e4f] shadow-lg rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="p-4">Patient Name</th>
                <th>Date</th>
                <th>Day</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => {
                const dayName = new Date(a.date).toLocaleDateString("en-US", {
                  weekday: "long",
                });
                return (
                  <tr key={a.id} className="border-b hover:bg-purple-900">
                    <td className="p-4">{a.patientName}</td>
                    <td>{a.date}</td>
                    <td>{dayName}</td>
                    <td>{a.time}</td>
                    <td>{a.reason}</td>
                    <td>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => cancelAppointment(a.id)}
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

        {/* Back Button */}
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
