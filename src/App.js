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

import InternationalCountries from "./Components/Countries/InternationalCountriesTable";
import InternationalAddCountry from "./Components/Countries/InternationalCountriesForm" 



import Destinations from "./Components/Destinations/DestinationsTable";
import AddDestination from './Components/Destinations/AddDestinationsForm';

import InternationalDestinations from "./Components/Destinations/InternationalDestinationTable"
import InternationalAddDestination from "./Components/Destinations/InternationalDestinationForm"


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
import HoneymoonTourDetails from "./Components/Tours/HoneyMoonTourDetails";
import AdminVideoManager from "./Components/Home/AdminVideoManager";
import AdminDomesticTours from "./Components/Home/AdminDomesticTours";
import AdminLeads from "./Components/Home/AdminLeads";
import ContactUs from "./Components/ContactUs/ContactUs";



import Exhibition from "./Components/Exhibitions/Exhibition";
import AboutExhibitionForm from "./Components/Exhibitions/AboutExhibition/AboutExhibitionForm";
import DomesticExhibitionForm from "./Components/Exhibitions/DomesticExhibition/DomesticExhibitionForm";
import InternationalExhibitionForm from "./Components/Exhibitions/InternationalExhibition/InternationalExhibitionForm";
// import AboutMiceForm from "./Components/Mice/AboutMice/AboutMiceForm";
// import MiceDomesticForm from "./Components/Mice/MiceDomestic/MiceDomesticForm";
// import MiceInternationalForm from "./Components/Mice/MiceInternational/MiceInternationalForm";


import INTLTourDetails from "./INTLTourDetails"
import INTLGroupTourDetails from "./INTLGroupDetails"
import INTLLadiesTourDetails from "./INTLLadiesDetails"
import INTLSeniorCitizenTourDetails from "./INTLSeniorCitizenDetails"
import INTLStudentTourDetails from  "./INTLStudentDetails"
import INTLHoneymoonTourDetails from "./INTLHoneymoonDetails"

import Enquiries from './Components/Enquires/Enquires';
import Payments from "./Components/Payments/Payments"

import AdminCarousel from "./Components/Home/AdminCarousel";
import AddVendors from "./Components/Vendors/AddVendors";
import Vendors from "./Components/Vendors/Vendors";
import CategoryTable from "./Components/Vendors/Category/CategoryTable";
import AddCategory from "./Components/Vendors/Category/AddCategory";

import Mice from "./Components/Mice/Mice"
import OfflineFlightsTable from "./Components/OfflineFlights/OfflineFlightsTable";
import OfflineFlights from "./Components/OfflineFlights/OfflineFlights";

import OfflineHotelsTable from "./Components/OfflineHotels/OfflineHotelsTable";
import OfflineHotels from "./Components/OfflineHotels/OfflineHotelsForm";
import AddBungalow from "./Components/Bunglow/AddBunglow";
import BungalowsTable from "./Components/Bunglow/BunglowTable";


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

            <Route path="/intl-countries" element={<InternationalCountries />} />
         <Route path="/intl-add-country" element={<InternationalAddCountry />} />
            <Route path="/intl-add-country/:id" element={<InternationalAddCountry />} /> 

         <Route path="/destinations" element={<Destinations />} />
         <Route path="/add-destination" element={<AddDestination />} />
          <Route path="/add-destination/:id" element={<AddDestination />} />


          <Route path="/intl-destinations" element={<InternationalDestinations />} />
         <Route path="/intl-add-destination" element={<InternationalAddDestination />} />
          <Route path="/intl-add-destination/:id" element={<InternationalAddDestination />} />
          




         <Route path="/tours" element={<Tours />} />
          <Route path="/add-tour" element={<AddTour />} />
          <Route path="/edit-tour/:id" element={<AddTour />} />

          <Route path="/intl-tours" element={<INTLTours />} />
          <Route path="/intl-add-tour" element={<INTLAddTour />} />
           <Route path="/intl-edit-tour/:id" element={<INTLAddTour />} />

           <Route path="/group-tours" element={<GroupTours />} />
          <Route path="/add-group-tour" element={<AddGroupTour />} /> 
           <Route path="/edit-group-tour/:id" element={<AddGroupTour />} />

          <Route path="/intl-group-tours" element={<INTLGroupTours />} />
          <Route path="/intl-add-group-tour" element={<INTLAddGroupTour />} /> 
          <Route path="/intl-edit-group-tour/:id" element={<INTLAddGroupTour />} />


          <Route path="/tour-details/:tourId" element={<TourDetails />} />
           <Route path="/group-tour-details/:tourId" element={<GroupTourDetails />} />
             <Route path="/ladies-special-tour-details/:tourId" element={<LadiesTourDetails />} />
               <Route path="/senior-citizen-tour-details/:tourId" element={<SeniorCitizenTourDetails />} />
                 <Route path="/student-tour-details/:tourId" element={<StudentTourDetails />} />
                  <Route path="/honeymoon-tour-details/:tourId" element={<HoneymoonTourDetails />} />



                    <Route path="/intl-tour-details/:tourId" element={<INTLTourDetails />} />
           <Route path="/intl-group-tour-details/:tourId" element={<INTLGroupTourDetails />} />
             <Route path="/intl-ladies-special-tour-details/:tourId" element={<INTLLadiesTourDetails />} />
               <Route path="/intl-senior-citizen-tour-details/:tourId" element={<INTLSeniorCitizenTourDetails />} />
                 <Route path="/intl-student-tour-details/:tourId" element={<INTLStudentTourDetails />} />
                  <Route path="/intl-honeymoon-tour-details/:tourId" element={<INTLHoneymoonTourDetails />} />
       
                <Route path="/ladies-special-tours" element={<LadiesSpecialTours />} />
                <Route path="/add-ladies-special-tour" element={<AddLadiesSpecialTour />} />
                <Route path="/edit-ladies-special-tour/:id" element={<AddLadiesSpecialTour />} /> 


                 <Route path="/intl-ladies-special-tours" element={<INTLLadiesSpecialTours />} />
                <Route path="/intl-add-ladies-special-tour" element={<INTLAddLadiesSpecialTour />} />
                <Route path="/intl-edit-ladies-special-tour/:id" element={<INTLAddLadiesSpecialTour />} /> 


                <Route path="/senior-citizen-tours" element={<SeniorCitizenTours />} />
                <Route path="/add-senior-citizen-tour" element={<AddSeniorCitizenTour />} />
                <Route path="/edit-senior-citizen-tour/:id" element={<AddSeniorCitizenTour />} />
                {/* <Route path="/senior-citizen-tour-details/:id" element={<TourDetails />} /> */}

                 <Route path="/intl-senior-citizen-tours" element={<INTLSeniorCitizenTours />} />
                <Route path="/intl-add-senior-citizen-tour" element={<INTLAddSeniorCitizenTour />} />
                <Route path="/intl-edit-senior-citizen-tour/:id" element={<INTLAddSeniorCitizenTour />} />


                <Route path="/student-tours" element={<StudentTours />} />
                <Route path="/add-student-tour" element={<AddStudentTour />} />
                <Route path="/edit-student-tour/:id" element={<AddStudentTour />} />
                {/* <Route path="/student-tour-details/:id" element={<TourDetails />} /> */}


                <Route path="/intl-student-tours" element={<INTLStudentTours />} />
                <Route path="/intl-add-student-tour" element={<INTLAddStudentTour />} />
                <Route path="/intl-edit-student-tour/:id" element={<INTLAddStudentTour />} />


                <Route path="/honeymoon-tours" element={<HoneymoonTours />} />
                <Route path="/add-honeymoon-tour" element={<AddHoneymoonTour />} />
                <Route path="/edit-honeymoon-tour/:id" element={<AddHoneymoonTour />} />
                {/* <Route path="/honeymoon-tour-details/:id" element={<TourDetails />} /> */}


                <Route path="/intl-honeymoon-tours" element={<INTLHoneymoonTours />} />
                <Route path="/intl-add-honeymoon-tour" element={<INTLAddHoneymoonTour />} />
                <Route path="/intl-edit-honeymoon-tour/:id" element={<INTLAddHoneymoonTour />} />


                 <Route path="/exhibition" element={<Exhibition />} />
                 <Route path="/domestic-exhibition" element={<Exhibition />} />
                 <Route path="/international-exhibition" element={<Exhibition />} />
                 <Route path="/exhibition/about/new" element={<AboutExhibitionForm />} />
                <Route path="/exhibition/about/edit/:id" element={<AboutExhibitionForm />} />
                <Route path="/exhibition/domestic/new" element={<DomesticExhibitionForm />} />
                <Route path="/exhibition/domestic/edit/:id" element={<DomesticExhibitionForm />} />
                <Route path="/exhibition/international/new" element={<InternationalExhibitionForm />} />
                <Route path="/exhibition/international/edit/:id" element={<InternationalExhibitionForm />} />

                 <Route path="/mice" element={<Mice />} />
                   <Route path="/offline-flights-table" element={<OfflineFlightsTable />} />
                 <Route path="/add-offline-flight" element={<OfflineFlights />} />
                  <Route path="/add-offline-flight/:id" element={<OfflineFlights />} />

                      <Route path="/offline-hotels-table" element={<OfflineHotelsTable />} />
                 <Route path="/add-offline-hotels" element={<OfflineHotels />} />
                  <Route path="/add-offline-hotels/:id" element={<OfflineHotels />} />
                
                <Route path="/add-video" element={<AdminVideoManager />} /> 
                <Route path="/add-card" element={<AdminDomesticTours />} />
                <Route path="/leadspopup" element={<AdminLeads />} />
                 <Route path="/carousel-images" element={<AdminCarousel />} />


                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/enquiries" element={<Enquiries />} />
                 <Route path="/payments" element={<Payments />} />
                 <Route path="/add-vendors" element={<AddVendors />} />
                  <Route path="/add-vendors/:id" element={<AddVendors />} />
                 <Route path="/Vendors" element={<Vendors />} />
                
                               <Route path="/category-table" element={<CategoryTable />} />
                               <Route path="/vendor-category" element={<AddCategory />} />
                              <Route path="/vendor-category/:id" element={<AddCategory />} />

                 <Route path="/bungalows" element={<BungalowsTable />} />
                 <Route path="/add-bungalow" element={<AddBungalow />} />
                 <Route path="/add-bungalow/:id" element={<AddBungalow />} /> 


              

      </Routes>
    </BrowserRouter>
  );
}

export default App;