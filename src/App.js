import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Login/Login";
import CruiseBookings from "./Components/Cruisebookings/CruiseBookings";
import AdvancedCruiseBookings from "./Components/Cruisebookings/AdvancedCruisebookings";
import Visaappointments from "./Components/Cruisebookings/Visaappointments";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/cruise-bookings" element={<CruiseBookings />} />
        <Route path="/advanced-cruise-bookings" element={<AdvancedCruiseBookings />} />
        <Route path="/visa-appointments" element={<Visaappointments />} />
        

        {/* Catch-all Route */}
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
