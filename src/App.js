import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Login/Login";
import CruiseBookings from "./Components/Cruisebookings/CruiseBookings/CruiseBookings";
import CruiseBookingDetails from "./Components/Cruisebookings/CruiseBookings/CruiseBookingsDetails";
import AdvancedCruiseBookings from "./Components/Cruisebookings/AdvancedCruiseBookings/AdvancedCruisebookings";
import AdvancedCruiseBookingDetails from "./Components/Cruisebookings/AdvancedCruiseBookings/AdvanceCruiseBookingDetails";
import Visaappointments from "./Components/Cruisebookings/Visaappoinments/Visaappointments";
import VisaAppointmentDetails from "./Components/Cruisebookings/Visaappoinments/VisaappoinmentsDetails";
import TourCategoriesTable from "./Components/ToursCategories/TourCategoriesTable";
import AddTourCategory from "./Components/ToursCategories/ToursCategoriesForm"; // Add this import
import Countries from "./Components/Countries/CountriesTable";
 import AddCountry from './Components/Countries/CountriesForm';
import Destinations from "./Components/Destinations/DestinationsTable";
import AddDestination from './Components/Destinations/AddDestinationsForm';
import Tours from "./Components/Tours/Tours";
import AddTour from "./Components/Tours/AddTour";
import TourDetails from "./Components/Tours/TourDetails";

import GroupTours from "./Components/Tours/GroupTour"
import AddGroupTour from "./Components/Tours/AddGroupTour";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/cruise-bookings" element={<CruiseBookings />} />
        <Route path="/cruise-booking-details" element={<CruiseBookingDetails />} />
        <Route path="/advanced-cruise-bookings" element={<AdvancedCruiseBookings />} />
        <Route path="/advanced-cruise-booking-details" element={<AdvancedCruiseBookingDetails />} />
        <Route path="/visa-appointments" element={<Visaappointments />} />
        <Route path="/visa-appointment-details" element={<VisaAppointmentDetails />} />
         <Route path="/categories-tours" element={<TourCategoriesTable />} />
        <Route path="/add-tour-category" element={<AddTourCategory />} /> {/* Add this route */}
         <Route path="/countries" element={<Countries />} />
         <Route path="/add-country" element={<AddCountry />} />
         <Route path="/destinations" element={<Destinations />} />
         <Route path="/add-destination" element={<AddDestination />} />
         <Route path="/tours" element={<Tours />} />
          <Route path="/add-tour" element={<AddTour />} />

           <Route path="/group-tours" element={<GroupTours />} />
          <Route path="/add-group-tour" element={<AddGroupTour />} /> 

          <Route path="/tour-details/:tourId" element={<TourDetails />} />
        {/* Catch-all Route */}
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
