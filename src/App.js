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
// import EditTour from "./Components/Tours/EditTour"
import TourDetails from "./Components/Tours/TourDetails";

import INTLTours from "./Components/Tours/InternationalIndividualToursTable";
import INTLAddTour from "./Components/Tours/InternationalIndividualAddTourForm";

import GroupTours from "./Components/Tours/GroupTour"
import AddGroupTour from "./Components/Tours/AddGroupTour";
import GroupTourDetails from "./Components/Tours/GroupTourDetails";

import INTLGroupTours from "./Components/Tours/InternationalGroupTourTable"
import INTLAddGroupTour from "./Components/Tours/InternationalAddGroupTourForm";




import LadiesSpecialTours from './Components/Tours/LadiesSpecialTable';
import AddLadiesSpecialTour from './Components/Tours/AddLadiesSpecial';


import INTLLadiesSpecialTours from './Components/Tours/InternationalLadiesSpecialTable';
import INTLAddLadiesSpecialTour from './Components/Tours/InternationalAddLadiesSpeciaForm';



import SeniorCitizenTours from './Components/Tours/SeniorCitizenTable';
import AddSeniorCitizenTour from './Components/Tours/AddSeniorCitizen';

import INTLSeniorCitizenTours from './Components/Tours/InternationalSeniorCitizenTable';
import INTLAddSeniorCitizenTour from './Components/Tours/InternationalAddSeniorCitizenForm';




import StudentTours from './Components/Tours/StudentToursTable';
import AddStudentTour from './Components/Tours/AddStudentToursForm';


import INTLStudentTours from './Components/Tours/InternationalStudentToursTable';
import INTLAddStudentTour from './Components/Tours/InternationalAddStudentToursForm';



import HoneymoonTours from './Components/Tours/HoneyMoonTable';
import AddHoneymoonTour from './Components/Tours/AddHoneyMoonForm';


import INTLHoneymoonTours from './Components/Tours/InternationalHoneyMoonTable';
import INTLAddHoneymoonTour from './Components/Tours/InternationalAddHoneyMoonForm';



import LadiesTourDetails from "./Components/Tours/LadiesTourDetails";
import SeniorCitizenTourDetails from "./Components/Tours/SetizenTourDetails";
import StudentTourDetails from "./Components/Tours/StudentTourDetails";
import HoneymoonTourDetails from "./Components/Tours/HoneyMoonTour";
import AdminVideoManager from "./Components/Home/AdminVideoManager";
import AdminDomesticTours from "./Components/Home/AdminDomesticTours";
import AdminLeads from "./Components/Home/AdminLeads";
import ContactUs from "./Components/ContactUs/ContactUs";


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
        <Route path="/add-category" element={<AddTourCategory />} /> {/* Add this route */}
         <Route path="/countries" element={<Countries />} />
         <Route path="/add-country" element={<AddCountry />} />
            <Route path="/add-country/:id" element={<AddCountry />} /> 

         <Route path="/destinations" element={<Destinations />} />
         <Route path="/add-destination" element={<AddDestination />} />
          <Route path="/add-destination/:id" element={<AddDestination />} />
         <Route path="/tours" element={<Tours />} />
          <Route path="/add-tour" element={<AddTour />} />
          <Route path="/edit-tour/:id" element={<AddTour />} />

          <Route path="/intl-tours" element={<INTLTours />} />
          <Route path="/intl-add-tour" element={<INTLAddTour />} />


           <Route path="/group-tours" element={<GroupTours />} />
          <Route path="/add-group-tour" element={<AddGroupTour />} /> 
           <Route path="/edit-group-tour/:id" element={<AddGroupTour />} />

              <Route path="/intl-group-tours" element={<INTLGroupTours />} />
          <Route path="/intl-add-group-tour" element={<INTLAddGroupTour />} /> 



          <Route path="/tour-details/:tourId" element={<TourDetails />} />
           <Route path="/group-tour-details/:tourId" element={<GroupTourDetails />} />
             <Route path="/ladies-special-tour-details/:tourId" element={<LadiesTourDetails />} />
               <Route path="/senior-citizen-tour-details/:tourId" element={<SeniorCitizenTourDetails />} />
                 <Route path="/student-tour-details/:tourId" element={<StudentTourDetails />} />
                  <Route path="/honeymoon-tour-details/:tourId" element={<HoneymoonTourDetails />} />
       
                <Route path="/ladies-special-tours" element={<LadiesSpecialTours />} />
                <Route path="/add-ladies-special-tour" element={<AddLadiesSpecialTour />} />
                <Route path="/edit-ladies-special-tour/:id" element={<AddLadiesSpecialTour />} /> 


                 <Route path="/intl-ladies-special-tours" element={<INTLLadiesSpecialTours />} />
                <Route path="/intl-add-ladies-special-tour" element={<INTLAddLadiesSpecialTour />} />



                <Route path="/senior-citizen-tours" element={<SeniorCitizenTours />} />
                <Route path="/add-senior-citizen-tour" element={<AddSeniorCitizenTour />} />
                <Route path="/edit-senior-citizen-tour/:id" element={<AddSeniorCitizenTour />} />
                {/* <Route path="/senior-citizen-tour-details/:id" element={<TourDetails />} /> */}

                 <Route path="/intl-senior-citizen-tours" element={<INTLSeniorCitizenTours />} />
                <Route path="/intl-add-senior-citizen-tour" element={<INTLAddSeniorCitizenTour />} />



                <Route path="/student-tours" element={<StudentTours />} />
                <Route path="/add-student-tour" element={<AddStudentTour />} />
                <Route path="/edit-student-tour/:id" element={<AddStudentTour />} />
                {/* <Route path="/student-tour-details/:id" element={<TourDetails />} /> */}


                  <Route path="/intl-student-tours" element={<INTLStudentTours />} />
                <Route path="/intl-add-student-tour" element={<INTLAddStudentTour />} />



                <Route path="/honeymoon-tours" element={<HoneymoonTours />} />
                <Route path="/add-honeymoon-tour" element={<AddHoneymoonTour />} />
                <Route path="/edit-honeymoon-tour/:id" element={<AddHoneymoonTour />} />
                {/* <Route path="/honeymoon-tour-details/:id" element={<TourDetails />} /> */}


                <Route path="/intl-honeymoon-tours" element={<INTLHoneymoonTours />} />
                <Route path="/intl-add-honeymoon-tour" element={<INTLAddHoneymoonTour />} />



                
                <Route path="/add-video" element={<AdminVideoManager />} /> 
                <Route path="/add-card" element={<AdminDomesticTours />} />
                <Route path="/leadspopup" element={<AdminLeads />} />


                <Route path="/contact-us" element={<ContactUs />} />
              

      </Routes>
    </BrowserRouter>
  );
}

export default App;