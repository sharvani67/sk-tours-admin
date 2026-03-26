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
import SportsTourDetails from "./Components/Tours/SportsTourDetails"
import FestivalTourDetails from "./Components/Tours/FestivalTourDetails"

import AdminVideoManager from "./Components/Home/AdminVideoManager";
import AdminDomesticTours from "./Components/Home/AdminDomesticTours";
import AdminLeads from "./Components/Home/AdminLeads";
import ContactUs from "./Components/ContactUs/ContactUs";



import Exhibition from "./Components/Exhibitions/Exhibition";
 import AddExhibitionDetails from './Components/Exhibitions/AddExhibition.js';
 import ExhibitionBasicDetails from './Components/Exhibitions/ExhibitionBasicDetails.js';

// import AboutExhibitionForm from "./Components/Exhibitions/AboutExhibition/AboutExhibitionForm";
// import DomesticExhibitionForm from "./Components/Exhibitions/DomesticExhibition/DomesticExhibitionForm";
// import InternationalExhibitionForm from "./Components/Exhibitions/InternationalExhibition/InternationalExhibitionForm";
// import AboutMiceForm from "./Components/Mice/AboutMice/AboutMiceForm";
// import MiceDomesticForm from "./Components/Mice/MiceDomestic/MiceDomesticForm";
// import MiceInternationalForm from "./Components/Mice/MiceInternational/MiceInternationalForm";


import INTLTourDetails from "./INTLTourDetails"
import INTLGroupTourDetails from "./INTLGroupDetails"
import INTLLadiesTourDetails from "./INTLLadiesDetails"
import INTLSeniorCitizenTourDetails from "./INTLSeniorCitizenDetails"
import INTLStudentTourDetails from  "./INTLStudentDetails"
import INTLHoneymoonTourDetails from "./INTLHoneymoonDetails"
import INTLSportsTourDetails from "./INTLSportsTourDetails"
import INTLFestivalTourDetails from "./INTLFestivalTourDetails"

import Enquiries from './Components/Enquires/Enquires';
import Payments from "./Components/Payments/Payments"

import AdminCarousel from "./Components/Home/AdminCarousel";
import UploadCarouselImage from "./Components/Home/UploadCarousel";
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

import OneDayPicnicTable from './Components/OneDayPicnic/OneDayPicnicTable';
import AddOneDayPicnic from './Components/OneDayPicnic/AddOneDayPicnic';

import MicEnquiryForm from "./Components/Mice/MicEnquiryForm";

import WeekendGatewayTable from './Components/Weekend/WeekendTable';
import AddWeekendGateway from './Components/Weekend/AddWeekendForm';
import MicEnquiryFormEdit from "./Components/Mice/MicEnquiryFormEdit";
import SportsTours from "./Components/Tours/SportsTours";
import AddSportsTour from "./Components/Tours/AddSportsTour";
import INTLSportsTours from "./Components/Tours/InternationalSportsToursTable";
import INTLSportsAddTour from "./Components/Tours/InternationalSportsAddTourForm";
import FestivalTours from "./Components/Tours/FestivalTours";
import AddFestivalTour from "./Components/Tours/AddFestivalTour";
import INTLFestivalTours from "./Components/Tours/InternationalFestivalToursTable";
import INTLFestivalAddTour from "./Components/Tours/InternationalFestivalAddTourForm";
import FlightTax from "./Components/FlightTax/FlightTax";
import AddFlightTax from "./Components/FlightTax/AddFlightTax";
import PassportTable from "./Components/Tours/Passport/PassportTable";
import PassportForm from "./Components/Tours/Passport/PassportForm";
import WeekendForm from "./Components/BookingForms/WeekendTable.js";
import OnedayBookingForm from "./Components/BookingForms/OnedaybookingTable.js";
import BungalowTable from "./Components/BookingForms/BungalowTable.js";
import BookingView from "./Components/BookingForms/BookingView";
import OnedaybookingView from "./Components/BookingForms/OnedaybookingView.js";
import OnedaybookingTable from "./Components/BookingForms/OnedaybookingTable.js";
import WeekendView from "./Components/BookingForms/WeekendView.js";
import WeekendTable from "./Components/BookingForms/WeekendTable.js";

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
                     <Route path="/sports-tour-details/:tourId" element={<SportsTourDetails />} />
                        <Route path="/festival-tour-details/:tourId" element={<FestivalTourDetails />} />



                    <Route path="/intl-tour-details/:tourId" element={<INTLTourDetails />} />
           <Route path="/intl-group-tour-details/:tourId" element={<INTLGroupTourDetails />} />
             <Route path="/intl-ladies-special-tour-details/:tourId" element={<INTLLadiesTourDetails />} />
               <Route path="/intl-senior-citizen-tour-details/:tourId" element={<INTLSeniorCitizenTourDetails />} />
                 <Route path="/intl-student-tour-details/:tourId" element={<INTLStudentTourDetails />} />
                  <Route path="/intl-honeymoon-tour-details/:tourId" element={<INTLHoneymoonTourDetails />} />
                    <Route path="/intl-sports-tour-details/:tourId" element={<INTLSportsTourDetails />} />
                        <Route path="/intl-festival-tour-details/:tourId" element={<INTLFestivalTourDetails />} />


       
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


                 <Route path="/sports-tours" element={<SportsTours />} />
                <Route path="/add-sports-tour" element={<AddSportsTour />} />
                <Route path="/edit-sports-tour/:id" element={<AddSportsTour />} />

                 <Route path="/intl-sports-tours" element={<INTLSportsTours />} />
                <Route path="/intl-add-sports-tour" element={<INTLSportsAddTour />} />
                <Route path="/intl-edit-sports-tour/:id" element={<INTLSportsAddTour />} />


                 <Route path="/festival-tours" element={<FestivalTours />} />
                <Route path="/add-festival-tour" element={<AddFestivalTour />} />
                <Route path="/edit-festival-tour/:id" element={<AddFestivalTour />} />


                   <Route path="/intl-festival-tours" element={<INTLFestivalTours />} />
                <Route path="/intl-add-festival-tour" element={<INTLFestivalAddTour />} />
                <Route path="/intl-edit-festival-tour/:id" element={<INTLFestivalAddTour  />} />




                 <Route path="/exhibition" element={<Exhibition />} />
                 <Route path="/exhibition/basic/:id/:type" element={<ExhibitionBasicDetails />} />
                 <Route path="/exhibition/details/:id/:type" element={<AddExhibitionDetails />} />
                 

                
                 <Route path="/domestic-exhibition" element={<Exhibition />} />
                 <Route path="/international-exhibition" element={<Exhibition />} />

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
                 <Route path="/admin/carousel/upload" element={<UploadCarouselImage />} />


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

                 <Route path="/one-day-picnic" element={<OneDayPicnicTable />} />
                <Route path="/add-one-day-picnic" element={<AddOneDayPicnic />} />
                <Route path="/add-one-day-picnic/:id" element={<AddOneDayPicnic />} />

                 <Route path="/micenquiry-form" element={<MicEnquiryForm />} />


<Route path="/weekend-gateways" element={<WeekendGatewayTable />} />
<Route path="/add-weekend-gateway" element={<AddWeekendGateway />} />
<Route path="/add-weekend-gateway/:id" element={<AddWeekendGateway />} />
<Route path="/Passport" element={<PassportTable />} />
<Route path="/addPassport" element={<PassportForm />} />
<Route path="/addPassport/:id" element={<PassportForm />} />
<Route path="/micenquiryform/:id" element={<MicEnquiryFormEdit />} />
<Route path="/Flighttax" element={<FlightTax />} />
<Route path="/addflighttax" element={<AddFlightTax />} />
<Route path="/addflighttax/:id" element={<AddFlightTax />} />
<Route path="/Bookingtable" element={<BungalowTable />} />
<Route path="/Bookingview" element={<BookingView  />} />
<Route path="/Bookingview/:id" element={<BookingView  />} />

<Route path="/onedaypicnicview" element={<OnedaybookingView  />} />
<Route path="/onedaypicnicview/:id" element={<OnedaybookingView  />} />
<Route path="/onedaypicnictable" element={<OnedaybookingTable />} />
<Route path="/weekendview" element={<WeekendView />} />
<Route path="/weekendview/:id" element={<WeekendView />} />

<Route path="/weekendtable" element={<WeekendTable />} />

              

      </Routes>
    </BrowserRouter>
  );
}

export default App;