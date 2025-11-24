import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Login/Login";
import CruiseBookings from "./Components/Cruisebookings/CruiseBookings";
import AdvancedCruiseBookings from "./Components/Cruisebookings/AdvancedCruisebookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/cruise-bookings" element={<CruiseBookings />} />
         <Route path="/advanced-cruise-bookings" element={<AdvancedCruiseBookings />} />

        

        {/* Catch-all Route */}
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
