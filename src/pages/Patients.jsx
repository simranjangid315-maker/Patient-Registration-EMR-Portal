import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch patients and appointments
  const fetchData = async () => {
    try {
      const resPatients = await API.get("/patients");
      setPatients(resPatients.data);

      const resAppointments = await API.get("/appointments");
      setAppointments(resAppointments.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete patient
  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await API.delete(`/patients/${id}`);
      alert("Patient deleted successfully");
      fetchData();
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient");
    }
  };

  // Cancel appointment
  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await API.put(`/appointments/${id}`, { status: "Cancelled" });
      fetchData(); // refresh data
      alert("Appointment cancelled successfully");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.fullname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-8 bg-[#1a1a2e] min-h-screen text-white">
        {/* Patients List */}
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Patients List</h1>

        {/* ✅ Single Search Bar */}
        <input
          className="border border-purple-500 p-2 w-full mb-4 rounded bg-[#2e2e4f] text-white"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-[#2e2e4f] shadow-lg rounded-xl overflow-hidden mb-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="p-4">S.No</th> {/* ✅ New column */}
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, index) => (
                <tr key={p.id} className="border-b hover:bg-purple-900">
                  <td className="p-4">{index + 1}</td> {/* ✅ Serial number */}
                  <td>{p.fullname}</td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.bloodgroup}</td>
                  <td>{p.phone}</td>
                  <td>{p.address}</td>
                  <td>{p.reason}</td>
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

        {/* Appointments List */}
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Appointments List</h1>

        <div className="bg-[#2e2e4f] shadow-lg rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="p-4">S.No</th> {/* ✅ New column */}
                <th>Patient Name</th>
                <th>Date</th>
                <th>Day</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments
                .filter((a) => {
                  const today = new Date().toLocaleDateString("en-CA");
                  const apptDate = new Date(a.date).toLocaleDateString("en-CA");
                  const now = new Date();
                  const currentTime = now.toTimeString().slice(0, 8);
                  const apptTime = a.time.length === 5 ? a.time + ":00" : a.time;

                  const isPastDate = apptDate < today;
                  const isPastTime = apptDate === today && apptTime < currentTime;

                  let status = a.status || "Scheduled";
                  if ((isPastDate || isPastTime) && status.trim().toLowerCase() !== "cancelled") {
                    status = "Completed";
                  }

                  if (!search) {
                    return status.toLowerCase() === "scheduled";
                  } else {
                    return a.patientName.toLowerCase().includes(search.toLowerCase());
                  }
                })
                .map((a, index) => {
                  const dayName = new Date(a.date).toLocaleDateString("en-US", { weekday: "long" });
                  const formattedDate = new Date(a.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  const formattedTime = new Date(`1970-01-01T${a.time}`).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <tr key={a.id} className="border-b hover:bg-purple-900">
                      <td className="p-4">{index + 1}</td> {/* ✅ Serial number */}
                      <td>{a.patientName}</td>
                      <td>{formattedDate}</td>
                      <td>{dayName}</td>
                      <td>{formattedTime}</td>
                      <td>{a.reason}</td>
                      <td>{a.phone}</td>
                      <td>{a.email}</td>
                      <td>{a.status}</td>
                      <td>
                        {a.status.trim().toLowerCase() === "scheduled" && (
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            onClick={() => cancelAppointment(a.id)}
                          >
                            Cancel
                          </button>
                        )}
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
