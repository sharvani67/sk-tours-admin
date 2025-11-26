import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Login/Login";
import CruiseBookings from "./Components/Cruisebookings/CruiseBookings";
import AdvancedCruiseBookings from "./Components/Cruisebookings/AdvancedCruisebookings";
import Visaappointments from "./Components/Cruisebookings/Visaappointments";
import TourCategoriesTable from "./Components/ToursCategories/TourCategoriesTable";
import AddTourCategory from "./Components/ToursCategories/ToursCategoriesForm"; // Add this import
import Countries from "./Components/Countries/CountriesTable";
 import AddCountry from './Components/Countries/CountriesForm';
import Destinations from "./Components/Destinations/DestinationsTable";
import AddDestination from './Components/Destinations/AddDestinationsForm';
import Tours from "./Components/Tours/Tours";
import AddTour from "./Components/Tours/AddTour";

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
         <Route path="/categories-tours" element={<TourCategoriesTable />} />
        <Route path="/add-tour-category" element={<AddTourCategory />} /> {/* Add this route */}
         <Route path="/countries" element={<Countries />} />
         <Route path="/add-country" element={<AddCountry />} />
         <Route path="/destinations" element={<Destinations />} />
         <Route path="/add-destination" element={<AddDestination />} />
         <Route path="/tours" element={<Tours />} />
          <Route path="/add-tour" element={<AddTour />} />
        {/* Catch-all Route */}
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
