import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import AddAppointment from "./pages/AddAppointment";

function App() {
  return (
    <Router>
      <Routes>
        {/*  Default route → Sign‑Up */}
        <Route path="/" element={<Signup />} />

        {/*  After sign‑up → Login */}
        <Route path="/login" element={<Login />} />

        {/*  After login → Dashboard */}
        <Route path="/home" element={<Home />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/add-patient" element={<AddPatient />} />
        <Route path="/add-appointment" element={<AddAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;
