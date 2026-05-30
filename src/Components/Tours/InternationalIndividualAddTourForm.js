import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Tabs,
  Tab,
  Table,
  InputGroup,
  Modal
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import { Pencil, Trash } from 'react-bootstrap-icons';

// Helper component for Option Tabs
const OptionTabs = ({ activeOption, onOptionChange, option1Value, option2Value, onOption1Change, onOption2Change, placeholder, label }) => (
  <div>
    <Form.Label>{label}</Form.Label>
    <Tabs
      activeKey={activeOption}
      onSelect={(k) => onOptionChange(k)}
      className="mb-3"
    >
      <Tab eventKey="option1" title="Option 1">
        <Form.Control
          as="textarea"
          rows={3}
          value={option1Value}
          onChange={(e) => onOption1Change(e.target.value)}
          placeholder={placeholder || `Enter ${label} for Option 1`}
        />
      </Tab>
      <Tab eventKey="option2" title="Option 2">
        <Form.Control
          as="textarea"
          rows={3}
          value={option2Value}
          onChange={(e) => onOption2Change(e.target.value)}
          placeholder={placeholder || `Enter ${label} for Option 2`}
        />
      </Tab>
    </Tabs>
  </div>
);

const INTLAddTour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal state for editing items
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  // ========================
  // STATE FOR OPTION TABS (Option 1 / Option 2)
  // ========================
  
  // For Cost Remarks
  const [costRemarksActiveOption, setCostRemarksActiveOption] = useState('option1');
  const [costRemarksOption1, setCostRemarksOption1] = useState('');
  const [costRemarksOption2, setCostRemarksOption2] = useState('');
  
  // For Hotel Remarks
  const [hotelRemarksActiveOption, setHotelRemarksActiveOption] = useState('option1');
  const [hotelRemarksOption1, setHotelRemarksOption1] = useState('');
  const [hotelRemarksOption2, setHotelRemarksOption2] = useState('');
  
  // For Flight/Transport Remarks
  const [flightRemarksActiveOption, setFlightRemarksActiveOption] = useState('option1');
  const [flightRemarksOption1, setFlightRemarksOption1] = useState('');
  const [flightRemarksOption2, setFlightRemarksOption2] = useState('');
  
  // For EMI Remarks
  const [emiRemarksActiveOption, setEmiRemarksActiveOption] = useState('option1');
  const [emiRemarksOption1, setEmiRemarksOption1] = useState('');
  const [emiRemarksOption2, setEmiRemarksOption2] = useState('');
  
  // For Booking POI Remarks
  const [bookingPoiRemarksActiveOption, setBookingPoiRemarksActiveOption] = useState('option1');
  const [bookingPoiRemarksOption1, setBookingPoiRemarksOption1] = useState('');
  const [bookingPoiRemarksOption2, setBookingPoiRemarksOption2] = useState('');
  
  // For Cancellation Remarks
  const [cancellationRemarksActiveOption, setCancellationRemarksActiveOption] = useState('option1');
  const [cancellationRemarksOption1, setCancellationRemarksOption1] = useState('');
  const [cancellationRemarksOption2, setCancellationRemarksOption2] = useState('');
  
  // For Optional Tour Remarks
  const [optionalTourRemarksActiveOption, setOptionalTourRemarksActiveOption] = useState('option1');
  const [optionalTourRemarksOption1, setOptionalTourRemarksOption1] = useState('');
  const [optionalTourRemarksOption2, setOptionalTourRemarksOption2] = useState('');
  
  // For Departure Description
  const [departureActiveOption, setDepartureActiveOption] = useState('option1');
  const [departureOption1, setDepartureOption1] = useState('');
  const [departureOption2, setDepartureOption2] = useState('');
  
  // For Instructions
  const [instructionActiveOption, setInstructionActiveOption] = useState('option1');
  const [instructionOption1, setInstructionOption1] = useState('');
  const [instructionOption2, setInstructionOption2] = useState('');
  
  // For Visa Remarks
  const [visaRemarksActiveOption, setVisaRemarksActiveOption] = useState('option1');
  const [visaRemarksOption1, setVisaRemarksOption1] = useState('');
  const [visaRemarksOption2, setVisaRemarksOption2] = useState('');

  // Edit state for visa form
  const [editingVisaItemId, setEditingVisaItemId] = useState(null);
  const [editingVisaFormIndex, setEditingVisaFormIndex] = useState(null);
  const [visaFormEditData, setVisaFormEditData] = useState({
    type: '',
    download_action: '',
    fill_action: '',
    action1_file: null,
    action2_file: null
  });

  // Reset editing context for visa items
  const resetVisaEditing = () => {
    setEditingItem(null);
    setEditingType('');
    setEditIndex(-1);
    setEditingVisaItemId(null);
    setEditingVisaFormIndex(null);
    
    setTouristVisaForm({ description: '' });
    setTransitVisaForm({ description: '' });
    setBusinessVisaForm({ description: '' });
    setPhotoForm({ description: '' });
    setFreeFlowPhotoText('');
    
    setVisaFormEditData({
      type: '',
      download_action: '',
      fill_action: '',
      action1_file: null,
      action2_file: null
    });
  };

  // Dropdowns
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // BASIC DETAILS
  const [formData, setFormData] = useState({
    tour_code: '',
    tour_type: "individual",
    title: '',
    category_id: 1,
    primary_destination_id: '',
    country_id: '',
    duration_days: '',
    overview: '',
    base_price_adult: '',
    emi_price: '',
    is_international: 1
  });

  const visaSubTabs = ['tourist', 'transit', 'business', 'form', 'photo', 'fees', 'submission'];

  const TAB_LIST = [
    'basic',
    'itineraries',
    'departures',
    'costs',
    'optionalTours',
    'emiOptions',
    'inclusions',
    'exclusions',
    'transport',
    'hotels',
    ...(formData.is_international === 1 ? ['visa'] : []),
    'bookingPoi',
    'cancellation',
    'instructions',
    'images'
  ];
  
  // DEPARTURES
  const [departureForm, setDepartureForm] = useState({
    departure_date: '',
    return_date: '',
    adult_price: '',
    child_price: '',
    infant_price: '',
    description: '',
    total_seats: ''
  });
  const [departures, setDepartures] = useState([]);

  // EXCLUSIONS
  const [exclusionText, setExclusionText] = useState('');
  const [exclusions, setExclusions] = useState([]);

  // INCLUSIONS
  const [inclusionText, setInclusionText] = useState('');
  const [inclusions, setInclusions] = useState([]);

  // IMAGES
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageCaption, setImageCaption] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);
  
  // TOUR COST
  const [tourCostItem, setTourCostItem] = useState({
    pax: '',
    standard_hotel: '',
    deluxe_hotel: '',
    executive_hotel: '',
    child_with_bed: '',
    child_no_bed: '',
    remarks: ''
  });
  const [tourCosts, setTourCosts] = useState([]);

  // OPTIONAL TOURS
  const [optionalTourItem, setOptionalTourItem] = useState({
    tour_name: '',
    adult_price: '',
    child_price: ''
  });
  const [optionalTours, setOptionalTours] = useState([]);

  // EMI OPTIONS
  const [emiOptions, setEmiOptions] = useState([
    { particulars: 'Per Month Payment', loan_amount: '', months: 6, emi: '' },
    { particulars: 'Per Month Payment', loan_amount: '', months: 12, emi: '' },
    { particulars: 'Per Month Payment', loan_amount: '', months: 18, emi: '' },
    { particulars: 'Per Month Payment', loan_amount: '', months: 24, emi: '' },
    { particulars: 'Per Month Payment', loan_amount: '', months: 30, emi: '' },
    { particulars: 'Per Month Payment', loan_amount: '', months: 36, emi: '' },
    { particulars: 'Per Month Payment', loan_amount: '', months: 48, emi: '' }
  ]);

  const [emiLoanAmount, setEmiLoanAmount] = useState('');
  const [emiInterestRate, setEmiInterestRate] = useState(18);

  const calculateEMI = (loanAmount, months, interestRate = 18) => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = (interestRate / 100) / 12;
    const n = parseInt(months, 10);
    
    if (isNaN(principal) || principal <= 0 || isNaN(n) || n <= 0) return 0;
    
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / 
                (Math.pow(1 + monthlyRate, n) - 1);
    
    return Math.round(emi * 100) / 100;
  };

  useEffect(() => {
    if (emiLoanAmount && !isNaN(emiLoanAmount) && emiLoanAmount > 0) {
      const updatedOptions = emiOptions.map(option => ({
        ...option,
        loan_amount: emiLoanAmount,
        emi: calculateEMI(emiLoanAmount, option.months, emiInterestRate)
      }));
      setEmiOptions(updatedOptions);
    }
  }, [emiLoanAmount, emiInterestRate]);

  // HOTELS
  const [hotelItem, setHotelItem] = useState({
    city: '',
    nights: '',
    standard_hotel_name: '', 
    deluxe_hotel_name: '',   
    executive_hotel_name: '',
    remarks: ''
  });
  const [hotelRows, setHotelRows] = useState([]);

  // TRANSPORT
  const [transportItem, setTransportItem] = useState({
    mode: '',
    from_city: '',
    to_city: '',
    carrier: '',
    number_code: '',
    departure_datetime: '',
    arrival_datetime: '',
    description: '',
    remarks: ''
  });
  const [transports, setTransports] = useState([]);

  // BOOKING POI
  const [poiText, setPoiText] = useState('');
  const [poiAmount, setPoiAmount] = useState("");
  const [bookingPois, setBookingPois] = useState([]);

  // CANCELLATION
  const [cancelItem, setCancelItem] = useState({
    cancellation_policy: "",
    charges: ""
  });
  const [cancelPolicies, setCancelPolicies] = useState([]);

  // INSTRUCTIONS
  const [instructionText, setInstructionText] = useState('');
  const [instructions, setInstructions] = useState([]);

  // ITINERARIES
  const [itineraryItem, setItineraryItem] = useState({
    day: '',
    title: '',
    description: '',
    meals: {
      breakfast: false,
      lunch: false,
      dinner: false
    }
  });
  const [itineraries, setItineraries] = useState([]);

  // ========================
  // VISA STATE
  // ========================

  // Tourist Visa
  const [touristVisaItems, setTouristVisaItems] = useState([]);
  const [touristVisaForm, setTouristVisaForm] = useState({ description: '' });
  const [activeVisaSubTab, setActiveVisaSubTab] = useState('tourist');

  // Transit Visa
  const [transitVisaItems, setTransitVisaItems] = useState([]);
  const [transitVisaForm, setTransitVisaForm] = useState({ description: '' });

  // Business Visa
  const [businessVisaItems, setBusinessVisaItems] = useState([]);
  const [businessVisaForm, setBusinessVisaForm] = useState({ description: '' });

  // Visa Form
  const [visaFormItems, setVisaFormItems] = useState([]);

  // Photo
  const [photoItems, setPhotoItems] = useState([]);
  const [photoForm, setPhotoForm] = useState({ description: '' });
  const [freeFlowPhotoEntries, setFreeFlowPhotoEntries] = useState([]);
  const [freeFlowPhotoText, setFreeFlowPhotoText] = useState('');

  // Visa Fees
  const [visaFeesRows, setVisaFeesRows] = useState([
    { 
      id: 1,
      type: 'Visa Fee', 
      tourist: '', 
      transit: '', 
      business: '', 
      tourist_charges: '',
      transit_charges: '',
      business_charges: ''
    },
    { 
      id: 2,
      type: 'VFS Fee', 
      tourist: '', 
      transit: '', 
      business: '', 
      tourist_charges: '',
      transit_charges: '',
      business_charges: ''
    },
    { 
      id: 3,
      type: 'Other Charges', 
      tourist: '', 
      transit: '', 
      business: '', 
      tourist_charges: '',
      transit_charges: '',
      business_charges: ''
    }
  ]);

  // Submission & Pick Up
  const [submissionRows, setSubmissionRows] = useState([
    { 
      id: 1,
      label: 'Passport Submission Day', 
      tourist: '', 
      transit: '', 
      business: '' 
    },
    { 
      id: 2,
      label: 'Passport Submission Time', 
      tourist: '', 
      transit: '', 
      business: '' 
    },
    { 
      id: 3,
      label: 'Passport pick up Days', 
      tourist: '', 
      transit: '', 
      business: '' 
    },
    { 
      id: 4,
      label: 'Passport Pick Up Time', 
      tourist: '', 
      transit: '', 
      business: '' 
    },
    { 
      id: 5,
      label: 'Biometric requirement', 
      tourist: '', 
      transit: '', 
      business: '' 
    }
  ]);

  // ========================
  // DEFAULT CONTENT SETUP - ONLY FOR NEW TOURS (NOT EDIT MODE)
  // ========================

  useEffect(() => {
    if (!isEditMode) {
      // Cost Remarks
      setCostRemarksOption1("Please note that while the tour price has been indicated, it may vary if you choose dates closer to departure or during periods when the season transitions from low to high. We therefore kindly request you to confirm the final tour price before proceeding with your booking and to mention the tour code when inquiring to receive the exact cost. Child pricing is calculated based on the standard hotel category, and if you choose Deluxe or Executive accommodations, child rates may be adjusted accordingly.");
      setCostRemarksOption2("Premium package includes all taxes and surcharges. Price guaranteed for next 30 days. Early bird discount available for bookings made 60 days in advance. Group discount applicable for 10+ persons.");
      
      // Hotel Remarks
      setHotelRemarksOption1("Hotel categories are subject to availability. Standard, Deluxe, and Executive categories based on room types and amenities. Early check-in subject to availability.");
      setHotelRemarksOption2("Premium hotel collection with guaranteed upgrades. Welcome drinks and late checkout included. Complimentary breakfast and airport transfers. Best rate guarantee.");
      
      // Flight Remarks
      setFlightRemarksOption1("Flight prices are indicative and subject to change at the time of booking. Airline and timing subject to availability. Baggage allowance as per airline policy.");
      setFlightRemarksOption2("Guaranteed lowest airfare. Flexible cancellation up to 24 hours. Priority boarding and extra baggage included. Seat selection available complimentary.");
      
      // EMI Remarks
      setEmiRemarksOption1("EMI options available with 18% interest rate. Processing fee of 2% applicable. Terms and conditions apply. Credit cards from all major banks accepted.");
      setEmiRemarksOption2("No cost EMI available on select credit cards. Zero processing fee for limited period. Flexible tenure up to 36 months. Contact bank for pre-approved offers.");
      
      // Booking POI Remarks
      setBookingPoiRemarksOption1("Booking amount is non-refundable. Balance payment to be made as per the payment schedule. 50% payment required 30 days before departure.");
      setBookingPoiRemarksOption2("Flexible booking policy with free cancellation up to 15 days. Pay only 10% to book. Zero cancellation charges for COVID-related issues.");
      
      // Cancellation Remarks
      setCancellationRemarksOption1("Cancellation charges apply as per the policy mentioned above. No refunds for no-shows. 50% refund for cancellations made 30 days before departure.");
      setCancellationRemarksOption2("Full refund for cancellations 45+ days before departure. 75% refund for 30-44 days. 50% refund for 15-29 days. Travel credit available instead of refund.");
      
      // Optional Tour Remarks
      setOptionalTourRemarksOption1("Optional tours are subject to availability and weather conditions. Prices are per person. Minimum 4 persons required for each optional tour. Book at least 2 days in advance.");
      setOptionalTourRemarksOption2("Exclusive optional tours with private guide. Flexible timing available. Includes lunch and entry fees. Priority access to attractions. Cancel 24 hours before for full refund.");
      
      // Departure Description
      setDepartureOption1("Standard departure with regular transfers and shared sightseeing. Departure dates are fixed and subject to minimum group size of 6 persons. Check-in time 12 PM and check-out time 10 AM.");
      setDepartureOption2("Premium departure with private transfers and exclusive sightseeing. Flexible departure dates available for minimum 2 persons. Early check-in and late check-out available on request.");
      
      // Instructions
      setInstructionOption1("Please carry valid ID proof. Reporting time is 2 hours before departure. Carry comfortable clothing and walking shoes. Follow the itinerary timings strictly.");
      setInstructionOption2("Passport required for international travel. Visa assistance available. Travel insurance is mandatory. Medical fitness certificate required for adventure activities.");
      
      // Visa Remarks
      setVisaRemarksOption1("Visa requirements are subject to change based on embassy regulations. Processing time may vary. It is recommended to apply at least 3-4 weeks before departure. All documents must be original and valid for at least 6 months from the date of return.");
      setVisaRemarksOption2("Express visa processing available for additional fee. Visa on arrival available for eligible nationalities. E-visa facility available online. 24/7 visa support available.");

      // Set default active options
      setCostRemarksActiveOption('option1');
      setHotelRemarksActiveOption('option1');
      setFlightRemarksActiveOption('option1');
      setEmiRemarksActiveOption('option1');
      setBookingPoiRemarksActiveOption('option1');
      setCancellationRemarksActiveOption('option1');
      setOptionalTourRemarksActiveOption('option1');
      setDepartureActiveOption('option1');
      setInstructionActiveOption('option1');
      setVisaRemarksActiveOption('option1');

      // Prefill Booking Policy if empty
      if (bookingPois.length === 0) {
        setBookingPois([
          {
            item: "Per Person Booking Amount",
            amount_details: ""
          },
          {
            item: "30 Days Prior Per person cost ",
            amount_details: "50 % of the tour cost"
          },
          {
            item: "21 Days Prior Per person cost",
            amount_details: "Balance amount to pay"
          }
        ]);
      }

      // Prefill Cancellation Policy if empty
      if (cancelPolicies.length === 0) {
        setCancelPolicies([
          {
            cancellation_policy: "45 Days to 30 Days Cost per person ",
            charges: ""
          },
          {
            cancellation_policy: "30 Days to 21 Days Cost per person ",
            charges: "50% of tour cost"
          },
          {
            cancellation_policy: "21 Days till Departure date Cost per person",
            charges: "100 % Cancellation applies"
          }
        ]);
      }
    }
  }, [isEditMode]);

  // Helper function for file URLs
  const getFileUrl = (fileName) => {
    if (!fileName || typeof fileName !== 'string') return null;
    if (fileName.startsWith('http')) return fileName;
    if (fileName.startsWith('/uploads/')) return `${baseurl}${fileName}`;
    return `${baseurl}/uploads/visa/${fileName}`;
  };

  const openFileInNewTab = (url) => {
    if (url) window.open(url, '_blank');
  };

  // ========================
  // EDIT FUNCTIONS
  // ========================

  const editItinerary = (idx) => {
    const item = itineraries[idx];
    const mealsArray = item.meals ? item.meals.split(', ') : [];
    setItineraryItem({
      day: item.day,
      title: item.title,
      description: item.description || '',
      meals: {
        breakfast: mealsArray.includes('Breakfast'),
        lunch: mealsArray.includes('Lunch'),
        dinner: mealsArray.includes('Dinner')
      }
    });
    setEditingItem(item);
    setEditingType('itinerary');
    setEditIndex(idx);
  };

  const editDeparture = (idx) => {
    const departure = departures[idx];
    setDepartureForm(departure);
    setEditingItem(departure);
    setEditingType('departure');
    setEditIndex(idx);
  };

  const editCostRow = (idx) => {
    const item = tourCosts[idx];
    setTourCostItem(item);
    setEditingItem(item);
    setEditingType('cost');
    setEditIndex(idx);
  };

  const editOptionalTourRow = (idx) => {
    const item = optionalTours[idx];
    setOptionalTourItem(item);
    setEditingItem(item);
    setEditingType('optionalTour');
    setEditIndex(idx);
  };

  const editHotelRow = (idx) => {
    const item = hotelRows[idx];
    setHotelItem(item);
    setEditingItem(item);
    setEditingType('hotel');
    setEditIndex(idx);
  };

  const editTransportRow = (idx) => {
    const item = transports[idx];
    setTransportItem(item);
    setEditingItem(item);
    setEditingType('transport');
    setEditIndex(idx);
  };

  const editInclusion = (idx) => {
    const inclusion = inclusions[idx];
    setInclusionText(inclusion);
    setEditingItem(inclusion);
    setEditingType('inclusion');
    setEditIndex(idx);
  };

  const editExclusion = (idx) => {
    const exclusion = exclusions[idx];
    setExclusionText(exclusion);
    setEditingItem(exclusion);
    setEditingType('exclusion');
    setEditIndex(idx);
  };

  const editPoi = (idx) => {
    const poi = bookingPois[idx];
    setPoiText(poi.item);
    setPoiAmount(poi.amount_details);
    setEditingItem(poi);
    setEditingType('poi');
    setEditIndex(idx);
  };

  const editCancelRow = (idx) => {
    const policy = cancelPolicies[idx];
    setCancelItem(policy);
    setEditingItem(policy);
    setEditingType('cancellation');
    setEditIndex(idx);
  };

  const editInstruction = (idx) => {
    const instruction = instructions[idx];
    setInstructionText(instruction);
    setEditingItem(instruction);
    setEditingType('instruction');
    setEditIndex(idx);
  };

  const editTouristVisa = (idx) => {
    const item = touristVisaItems[idx];
    setTouristVisaForm({ description: item.description });
    setEditingItem(item);
    setEditingType('touristVisa');
    setEditIndex(idx);
    setEditingVisaItemId(idx);
  };

  const editTransitVisa = (idx) => {
    const item = transitVisaItems[idx];
    setTransitVisaForm({ description: item.description });
    setEditingItem(item);
    setEditingType('transitVisa');
    setEditIndex(idx);
    setEditingVisaItemId(idx);
  };

  const editBusinessVisa = (idx) => {
    const item = businessVisaItems[idx];
    setBusinessVisaForm({ description: item.description });
    setEditingItem(item);
    setEditingType('businessVisa');
    setEditIndex(idx);
    setEditingVisaItemId(idx);
  };

  const editPhoto = (idx) => {
    const item = photoItems[idx];
    setPhotoForm({ description: item.description });
    setEditingItem(item);
    setEditingType('photo');
    setEditIndex(idx);
    setEditingVisaItemId(idx);
  };

  // ========================
  // ADD FUNCTIONS
  // ========================

  const handleAddItinerary = () => {
    const { day, title, description, meals } = itineraryItem;
    if (!day || !title.trim()) return;

    const selectedMeals = [];
    if (meals.breakfast) selectedMeals.push('Breakfast');
    if (meals.lunch) selectedMeals.push('Lunch');
    if (meals.dinner) selectedMeals.push('Dinner');
    const mealsString = selectedMeals.join(', ');

    const newItem = {
      day: Number(day),
      title: title.trim(),
      description: description.trim(),
      meals: mealsString
    };

    if (editingType === 'itinerary' && editIndex !== -1) {
      const updated = [...itineraries];
      updated[editIndex] = newItem;
      setItineraries(updated);
    } else {
      setItineraries(prev => [...prev, newItem]);
    }

    setItineraryItem({
      day: '',
      title: '',
      description: '',
      meals: { breakfast: false, lunch: false, dinner: false }
    });
    resetEditing();
  };

  // Note: handleAddDeparture is removed - data is saved on main save only

  const addCostRow = () => {
    if (!tourCostItem.pax) return;
    
    const newItem = { ...tourCostItem };
    
    if (editingType === 'cost' && editIndex !== -1) {
      const updated = [...tourCosts];
      updated[editIndex] = newItem;
      setTourCosts(updated);
    } else {
      setTourCosts(prev => [...prev, newItem]);
    }

    setTourCostItem({
      pax: '',
      standard_hotel: '',
      deluxe_hotel: '',
      executive_hotel: '',
      child_with_bed: '',
      child_no_bed: '',
      remarks: ''
    });
    resetEditing();
  };

  const addOptionalTourRow = () => {
    if (!optionalTourItem.tour_name.trim()) return;

    const processedItem = { ...optionalTourItem };

    if (editingType === 'optionalTour' && editIndex !== -1) {
      const updated = [...optionalTours];
      updated[editIndex] = processedItem;
      setOptionalTours(updated);
    } else {
      setOptionalTours(prev => [...prev, processedItem]);
    }

    setOptionalTourItem({
      tour_name: '',
      adult_price: '',
      child_price: ''
    });
    resetEditing();
  };

  const addHotelRow = () => {
    if (!hotelItem.city.trim() || 
      (!hotelItem.standard_hotel_name.trim() && 
       !hotelItem.deluxe_hotel_name.trim() && 
       !hotelItem.executive_hotel_name.trim())) {
      setError('Please enter city and at least one hotel name');
      return;
    }
    if (editingType === 'hotel' && editIndex !== -1) {
      const updated = [...hotelRows];
      updated[editIndex] = { ...hotelItem };
      setHotelRows(updated);
    } else {
      setHotelRows(prev => [...prev, { ...hotelItem }]);
    }

    setHotelItem({
      city: '',
      nights: '',
      standard_hotel_name: '', 
      deluxe_hotel_name: '',   
      executive_hotel_name: '',
      remarks: ''
    });
    resetEditing();
  };

  const addTransportRow = () => {
    if (!transportItem.description.trim()) return;
    
    if (editingType === 'transport' && editIndex !== -1) {
      const updated = [...transports];
      updated[editIndex] = { ...transportItem };
      setTransports(updated);
    } else {
      setTransports(prev => [...prev, { ...transportItem }]);
    }

    setTransportItem({
      mode: '',
      from_city: '',
      to_city: '',
      carrier: '',
      number_code: '',
      departure_datetime: '',
      arrival_datetime: '',
      description: '',
      remarks: ''
    });
    resetEditing();
  };

  const handleAddInclusion = () => {
    const trimmed = inclusionText.trim();
    if (!trimmed) return;
    
    if (editingType === 'inclusion' && editIndex !== -1) {
      const updated = [...inclusions];
      updated[editIndex] = trimmed;
      setInclusions(updated);
    } else {
      setInclusions(prev => [...prev, trimmed]);
    }
    
    setInclusionText('');
    resetEditing();
  };

  const handleAddExclusion = () => {
    const trimmed = exclusionText.trim();
    if (!trimmed) return;
    
    if (editingType === 'exclusion' && editIndex !== -1) {
      const updated = [...exclusions];
      updated[editIndex] = trimmed;
      setExclusions(updated);
    } else {
      setExclusions(prev => [...prev, trimmed]);
    }
    
    setExclusionText('');
    resetEditing();
  };

  const addPoi = () => {
    const txt = poiText.trim();
    if (!txt) return;
    
    const newPoi = { item: poiText, amount_details: poiAmount };
    
    if (editingType === 'poi' && editIndex !== -1) {
      const updated = [...bookingPois];
      updated[editIndex] = newPoi;
      setBookingPois(updated);
    } else {
      setBookingPois([...bookingPois, newPoi]);
    }
    
    setPoiText('');
    setPoiAmount("");
    resetEditing();
  };

  const addCancelRow = () => {
    if (!cancelItem.cancellation_policy.trim()) return;
    
    if (editingType === 'cancellation' && editIndex !== -1) {
      const updated = [...cancelPolicies];
      updated[editIndex] = { ...cancelItem };
      setCancelPolicies(updated);
    } else {
      setCancelPolicies(prev => [...prev, { ...cancelItem }]);
    }
    
    setCancelItem({ cancellation_policy: "", charges: "" });
    resetEditing();
  };

  // Note: addInstruction is removed - data is saved on main save only

  const addTouristVisa = () => {
    const trimmed = touristVisaForm.description.trim();
    if (!trimmed) return;
    
    const newItem = { description: trimmed };
    
    if (editingType === 'touristVisa' && editIndex !== -1) {
      const updated = [...touristVisaItems];
      updated[editIndex] = newItem;
      setTouristVisaItems(updated);
    } else {
      setTouristVisaItems(prev => [...prev, newItem]);
    }
    
    setTouristVisaForm({ description: '' });
    resetVisaEditing();
  };

  const addTransitVisa = () => {
    const trimmed = transitVisaForm.description.trim();
    if (!trimmed) return;
    
    const newItem = { description: trimmed };
    
    if (editingType === 'transitVisa' && editIndex !== -1) {
      const updated = [...transitVisaItems];
      updated[editIndex] = newItem;
      setTransitVisaItems(updated);
    } else {
      setTransitVisaItems(prev => [...prev, newItem]);
    }
    
    setTransitVisaForm({ description: '' });
    resetVisaEditing();
  };

  const addBusinessVisa = () => {
    const trimmed = businessVisaForm.description.trim();
    if (!trimmed) return;
    
    const newItem = { description: trimmed };
    
    if (editingType === 'businessVisa' && editIndex !== -1) {
      const updated = [...businessVisaItems];
      updated[editIndex] = newItem;
      setBusinessVisaItems(updated);
    } else {
      setBusinessVisaItems(prev => [...prev, newItem]);
    }
    
    setBusinessVisaForm({ description: '' });
    resetVisaEditing();
  };

  const addPhoto = () => {
    const trimmed = photoForm.description.trim();
    if (!trimmed) return;
    
    const newItem = { description: trimmed };
    
    if (editingType === 'photo' && editIndex !== -1) {
      const updated = [...photoItems];
      updated[editIndex] = newItem;
      setPhotoItems(updated);
    } else {
      setPhotoItems(prev => [...prev, newItem]);
    }
    
    setPhotoForm({ description: '' });
    resetVisaEditing();
  };

  const editVisaFormItem = (index) => {
    const formItem = visaFormItems[index];
    setVisaFormEditData({
      type: formItem.type,
      download_action: formItem.download_action,
      fill_action: formItem.fill_action,
      action1_file: formItem.action1_file,
      action2_file: formItem.action2_file
    });
    setEditingVisaFormIndex(index);
    setActiveVisaSubTab('form');
  };

  const updateVisaFormItem = () => {
    if (editingVisaFormIndex === null) return;
    
    const updated = [...visaFormItems];
    updated[editingVisaFormIndex] = {
      ...updated[editingVisaFormIndex],
      ...visaFormEditData
    };
    
    setVisaFormItems(updated);
    resetVisaFormEdit();
  };

  const resetVisaFormEdit = () => {
    setEditingVisaFormIndex(null);
    setVisaFormEditData({
      type: '',
      download_action: '',
      fill_action: '',
      action1_file: null,
      action2_file: null
    });
  };

  const handleVisaFormFileChange = async (index, action, file) => {
    if (!file) return;
    
    if (editingVisaFormIndex !== null && editingVisaFormIndex === index) {
      setVisaFormEditData(prev => ({
        ...prev,
        [action === 'action1' ? 'action1_file' : 'action2_file']: file
      }));
    } else {
      const updated = [...visaFormItems];
      if (action === 'action1') {
        updated[index].action1_file = file;
      } else {
        updated[index].action2_file = file;
      }
      setVisaFormItems(updated);
    }
    
    if (isEditMode && id) {
      const visaType = editingVisaFormIndex !== null 
        ? visaFormEditData.type 
        : visaFormItems[index].type;
      
      const uploadedFileName = await handleVisaFormFileUpload(id, visaType, action, file);
      if (uploadedFileName) {
        if (editingVisaFormIndex !== null && editingVisaFormIndex === index) {
          setVisaFormEditData(prev => ({
            ...prev,
            [action === 'action1' ? 'action1_file' : 'action2_file']: uploadedFileName
          }));
        } else {
          const updatedWithFilename = [...visaFormItems];
          if (action === 'action1') {
            updatedWithFilename[index].action1_file = uploadedFileName;
          } else {
            updatedWithFilename[index].action2_file = uploadedFileName;
          }
          setVisaFormItems(updatedWithFilename);
        }
      }
    }
  };

  const handleVisaFormFileUpload = async (tourId, visaType, actionType, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('visa_type', visaType);
      formData.append('action_type', actionType);

      const response = await fetch(`${baseurl}/api/visa/upload-file/${tourId}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        return result.fileName;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  // Reset editing context
  const resetEditing = () => {
    setEditingItem(null);
    setEditingType('');
    setEditIndex(-1);
    setEditingVisaItemId(null);
    setEditingVisaFormIndex(null);
    
    setTouristVisaForm({ description: '' });
    setTransitVisaForm({ description: '' });
    setBusinessVisaForm({ description: '' });
    setPhotoForm({ description: '' });
    setFreeFlowPhotoText('');
    
    setVisaFormEditData({
      type: '',
      download_action: '',
      fill_action: '',
      action1_file: null,
      action2_file: null
    });
  };

  // ========================
  // REMOVE FUNCTIONS
  // ========================

  const handleRemoveItinerary = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this itinerary?');
    if (confirmDelete) {
      setItineraries(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleRemoveDeparture = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this departure?');
    if (confirmDelete) {
      setDepartures(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeCostRow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this cost row?');
    if (confirmDelete) {
      setTourCosts(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeOptionalTourRow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this optional tour?');
    if (confirmDelete) {
      setOptionalTours(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeHotelRow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this hotel?');
    if (confirmDelete) {
      setHotelRows(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeTransportRow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this transport?');
    if (confirmDelete) {
      setTransports(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleRemoveInclusion = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this inclusion?');
    if (confirmDelete) {
      setInclusions(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleRemoveExclusion = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this exclusion?');
    if (confirmDelete) {
      setExclusions(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removePoi = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this booking POI?');
    if (confirmDelete) {
      setBookingPois(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeCancelRow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this cancellation policy?');
    if (confirmDelete) {
      setCancelPolicies(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeInstruction = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this instruction?');
    if (confirmDelete) {
      setInstructions(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeTouristVisa = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this tourist visa item?');
    if (confirmDelete) {
      setTouristVisaItems(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeTransitVisa = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this transit visa item?');
    if (confirmDelete) {
      setTransitVisaItems(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeBusinessVisa = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this business visa item?');
    if (confirmDelete) {
      setBusinessVisaItems(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removePhoto = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this photo item?');
    if (confirmDelete) {
      setPhotoItems(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const removeVisaFeesRow = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this visa fee row?');
    if (confirmDelete) {
      setVisaFeesRows(visaFeesRows.filter(row => row.id !== id));
    }
  };

  const removeSubmissionRow = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this submission row?');
    if (confirmDelete) {
      setSubmissionRows(submissionRows.filter(row => row.id !== id));
    }
  };

  const addVisaFeesRow = () => {
    const newId = visaFeesRows.length > 0 
      ? Math.max(...visaFeesRows.map(row => row.id)) + 1 
      : 1;
    
    setVisaFeesRows([
      ...visaFeesRows,
      { 
        id: newId,
        type: 'Free Flow Entry', 
        tourist: '', 
        transit: '', 
        business: '', 
        tourist_charges: '',
        transit_charges: '',
        business_charges: ''
      }
    ]);
  };

  const addSubmissionRow = () => {
    const newId = submissionRows.length > 0 
      ? Math.max(...submissionRows.map(row => row.id)) + 1 
      : 1;
    
    setSubmissionRows([
      ...submissionRows,
      { 
        id: newId,
        label: 'Free Flow Entry', 
        tourist: '', 
        transit: '', 
        business: '' 
      }
    ]);
  };

  const handleVisaFeesChange = (id, field, value) => {
    const updated = visaFeesRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    );
    setVisaFeesRows(updated);
  };

  const handleSubmissionLabelChange = (id, value) => {
    const updated = submissionRows.map(row => 
      row.id === id ? { ...row, label: value } : row
    );
    setSubmissionRows(updated);
  };

  const handleSubmissionValueChange = (id, field, value) => {
    const updated = submissionRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    );
    setSubmissionRows(updated);
  };

  // ========================
  // HANDLER FUNCTIONS
  // ========================

  const handleCostChange = (e) => {
    const { name, value } = e.target;
    setTourCostItem(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionalTourChange = (e) => {
    const { name, value } = e.target;
    setOptionalTourItem(prev => ({ ...prev, [name]: value }));
  };

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelItem(prev => ({ ...prev, [name]: value }));
  };

  const handleTransportChange = (e) => {
    const { name, value } = e.target;
    setTransportItem(prev => ({ ...prev, [name]: value }));
  };

  const handleLoanAmountChange = (value) => {
    setEmiLoanAmount(value);
    
    if (value && !isNaN(value) && value > 0) {
      const updatedOptions = emiOptions.map(option => ({
        ...option,
        loan_amount: value,
        emi: calculateEMI(value, option.months, emiInterestRate)
      }));
      setEmiOptions(updatedOptions);
    }
  };
  
  const handleCancelChange = (e) => {
    const { name, value } = e.target;
    setCancelItem(prev => ({ ...prev, [name]: value }));
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      'duration_days',
      'base_price_adult',
      'emi_price',
      'category_id',
      'primary_destination_id',
      'country_id',
      'is_international'
    ];
    const finalValue = numericFields.includes(name)
      ? value === '' ? '' : Number(value)
      : value;
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // Handlers for Cost Remarks
  const handleCostRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setCostRemarksOption1(value);
    } else {
      setCostRemarksOption2(value);
    }
  };

  const handleCostRemarksActiveChange = (option) => {
    setCostRemarksActiveOption(option);
  };

  // Handlers for Hotel Remarks
  const handleHotelRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setHotelRemarksOption1(value);
    } else {
      setHotelRemarksOption2(value);
    }
  };

  const handleHotelRemarksActiveChange = (option) => {
    setHotelRemarksActiveOption(option);
  };

  // Handlers for Flight Remarks
  const handleFlightRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setFlightRemarksOption1(value);
    } else {
      setFlightRemarksOption2(value);
    }
  };

  const handleFlightRemarksActiveChange = (option) => {
    setFlightRemarksActiveOption(option);
  };

  // Handlers for EMI Remarks
  const handleEmiRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setEmiRemarksOption1(value);
    } else {
      setEmiRemarksOption2(value);
    }
  };

  const handleEmiRemarksActiveChange = (option) => {
    setEmiRemarksActiveOption(option);
  };

  // Handlers for Booking POI Remarks
  const handleBookingPoiRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setBookingPoiRemarksOption1(value);
    } else {
      setBookingPoiRemarksOption2(value);
    }
  };

  const handleBookingPoiRemarksActiveChange = (option) => {
    setBookingPoiRemarksActiveOption(option);
  };

  // Handlers for Cancellation Remarks
  const handleCancellationRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setCancellationRemarksOption1(value);
    } else {
      setCancellationRemarksOption2(value);
    }
  };

  const handleCancellationRemarksActiveChange = (option) => {
    setCancellationRemarksActiveOption(option);
  };

  // Handlers for Optional Tour Remarks
  const handleOptionalTourRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setOptionalTourRemarksOption1(value);
    } else {
      setOptionalTourRemarksOption2(value);
    }
  };

  const handleOptionalTourRemarksActiveChange = (option) => {
    setOptionalTourRemarksActiveOption(option);
  };

  // Handlers for Departure Description
  const handleDepartureDescriptionOptionChange = (option, value) => {
    if (option === 'option1') {
      setDepartureOption1(value);
    } else {
      setDepartureOption2(value);
    }
  };

  // Handlers for Instructions
  const handleInstructionOptionChange = (option, value) => {
    if (option === 'option1') {
      setInstructionOption1(value);
    } else {
      setInstructionOption2(value);
    }
  };

  // Handlers for Visa Remarks
  const handleVisaRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setVisaRemarksOption1(value);
    } else {
      setVisaRemarksOption2(value);
    }
  };

  const handleVisaRemarksActiveChange = (option) => {
    setVisaRemarksActiveOption(option);
  };

  const handleDepartureChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['adult_price', 'child_price', 'total_seats', 'infant_price'];
    setDepartureForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  const handleItineraryChange = (e) => {
    const { name, value } = e.target;
    setItineraryItem((prev) => ({
      ...prev,
      [name]: name === 'day' ? value.replace(/[^0-9]/g, '') : value
    }));
  };

  const handleMealsCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setItineraryItem((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [name]: checked
      }
    }));
  };

  const handleTouristVisaChange = (e) => {
    const { name, value } = e.target;
    setTouristVisaForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTransitVisaChange = (e) => {
    const { name, value } = e.target;
    setTransitVisaForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBusinessVisaChange = (e) => {
    const { name, value } = e.target;
    setBusinessVisaForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const { name, value } = e.target;
    setPhotoForm(prev => ({ ...prev, [name]: value }));
  };

  // IMAGE HANDLERS
  const handleImageChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleReplacementFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    setReplacementFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setReplacementPreview(preview);
    }
  };

  const startEditImage = (image) => {
    setEditingImageId(image.image_id);
    setReplacementFile(null);
    setReplacementPreview(null);
  };

  const cancelEditImage = () => {
    setEditingImageId(null);
    setReplacementFile(null);
    setReplacementPreview(null);
    const fileInput = document.getElementById('replacementFileInput');
    if (fileInput) fileInput.value = '';
  };

  const updateImage = async (imageId) => {
    if (!replacementFile) {
      alert('Please select a new image file to replace the existing one');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const deleteResponse = await fetch(`${baseurl}/api/images/${imageId}`, {
        method: 'DELETE'
      });
      
      if (!deleteResponse.ok) {
        throw new Error('Failed to delete old image');
      }

      const formData = new FormData();
      formData.append('images', replacementFile);
      
      const uploadResponse = await fetch(`${baseurl}/api/images/upload/${id}`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload new image');
      }

      await loadTourData();
      
      setSuccess('Image updated successfully');
      cancelEditImage();
    } catch (err) {
      setError('Failed to update image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/images/${imageId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setExistingImages(prev => prev.filter(img => img.image_id !== imageId));
      
      setSuccess('Image deleted successfully');
    } catch (err) {
      setError('Failed to delete image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const setCoverImage = async (imageId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/images/cover/${imageId}`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Failed to set cover image');
      }

      setExistingImages(prev => 
        prev.map(img => ({
          ...img,
          is_cover: img.image_id === imageId ? 1 : 0
        }))
      );
      
      setSuccess('Cover image updated successfully');
    } catch (err) {
      setError('Failed to set cover image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  // ========================
  // LOAD DATA
  // ========================

  useEffect(() => {
    const loadDropdownsAndTourCode = async () => {
      try {
        const catRes = await fetch(`${baseurl}/api/categories/all-tours`);
        const categoryData = await catRes.json();
        setCategories(Array.isArray(categoryData) ? categoryData : []);

        const destRes = await fetch(`${baseurl}/api/destinations`);
        const destData = await destRes.json();

        const internationalDestinations = Array.isArray(destData) 
          ? destData.filter(destination => destination.is_domestic == 0)
          : [];
        
        const sortedDestinations = internationalDestinations.sort((a, b) => {
          const nameA = a.name ? a.name.toLowerCase() : '';
          const nameB = b.name ? b.name.toLowerCase() : '';
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        
        setDestinations(sortedDestinations);

        if (isEditMode) {
          await loadTourData();
        } else {
          setFormData(prev => ({
            ...prev,
            is_international: 1
          }));
          
          const tourCodeRes = await fetch(`${baseurl}/api/tours/next-tour-code?tour_type=individual&is_international=1`);
          if (tourCodeRes.ok) {
            const tourCodeData = await tourCodeRes.json();
            setFormData(prev => ({
              ...prev,
              tour_code: tourCodeData.next_tour_code,
              is_international: 1
            }));
          }
        }
      } catch (err) {
        setError('Failed to load dropdown data');
      }
    };

    loadDropdownsAndTourCode();
  }, [id]);

  const loadTourData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/tours/tour/full/individual/${id}`);
      if (!response.ok) throw new Error('Failed to fetch tour data');
      
      const data = await response.json();
      
      if (data.success) {
        const basic = data.basic_details;
        
        // Load remarks from child tables
        if (data.costs && data.costs.length > 0) {
          const firstCost = data.costs[0];
          setCostRemarksOption1(firstCost.cost_remarks_option1 || '');
          setCostRemarksOption2(firstCost.cost_remarks_option2 || '');
          setCostRemarksActiveOption(firstCost.cost_remarks_active || 'option1');
        }
        
        if (data.hotels && data.hotels.length > 0) {
          const firstHotel = data.hotels[0];
          setHotelRemarksOption1(firstHotel.hotel_remarks_option1 || '');
          setHotelRemarksOption2(firstHotel.hotel_remarks_option2 || '');
          setHotelRemarksActiveOption(firstHotel.hotel_remarks_active || 'option1');
        }
        
        if (data.transport && data.transport.length > 0) {
          const firstTransport = data.transport[0];
          setFlightRemarksOption1(firstTransport.flight_remarks_option1 || '');
          setFlightRemarksOption2(firstTransport.flight_remarks_option2 || '');
          setFlightRemarksActiveOption(firstTransport.flight_remarks_active || 'option1');
        }
        
        if (data.emi_options && data.emi_options.length > 0) {
          const firstEmi = data.emi_options[0];
          setEmiRemarksOption1(firstEmi.emi_remarks_option1 || '');
          setEmiRemarksOption2(firstEmi.emi_remarks_option2 || '');
          setEmiRemarksActiveOption(firstEmi.emi_remarks_active || 'option1');
        }
        
        if (data.booking_poi && data.booking_poi.length > 0) {
          const firstPoi = data.booking_poi[0];
          setBookingPoiRemarksOption1(firstPoi.booking_remarks_option1 || '');
          setBookingPoiRemarksOption2(firstPoi.booking_remarks_option2 || '');
          setBookingPoiRemarksActiveOption(firstPoi.booking_remarks_active || 'option1');
        }
        
        if (data.cancellation_policies && data.cancellation_policies.length > 0) {
          const firstPolicy = data.cancellation_policies[0];
          setCancellationRemarksOption1(firstPolicy.cancellation_remarks_option1 || '');
          setCancellationRemarksOption2(firstPolicy.cancellation_remarks_option2 || '');
          setCancellationRemarksActiveOption(firstPolicy.cancellation_remarks_active || 'option1');
        }
        
        if (data.optional_tours && data.optional_tours.length > 0) {
          const firstOptional = data.optional_tours[0];
          setOptionalTourRemarksOption1(firstOptional.optional_remarks_option1 || '');
          setOptionalTourRemarksOption2(firstOptional.optional_remarks_option2 || '');
          setOptionalTourRemarksActiveOption(firstOptional.optional_remarks_active || 'option1');
        }
        
        if (data.departures && data.departures.length > 0) {
          const firstDeparture = data.departures[0];
          setDepartureOption1(firstDeparture.description_option1 || '');
          setDepartureOption2(firstDeparture.description_option2 || '');
          setDepartureActiveOption(firstDeparture.description_active || 'option1');
          setDepartures(data.departures);
        }
        
        if (data.instructions && data.instructions.length > 0) {
          const firstInstruction = data.instructions[0];
          setInstructionOption1(firstInstruction.item_option1 || '');
          setInstructionOption2(firstInstruction.item_option2 || '');
          setInstructionActiveOption(firstInstruction.item_active || 'option1');
          setInstructions(data.instructions.map(inst => inst.item));
        }
        
        if (data.visa_forms && data.visa_forms.length > 0) {
          const firstVisaForm = data.visa_forms[0];
          setVisaRemarksOption1(firstVisaForm.remarks_option1 || '');
          setVisaRemarksOption2(firstVisaForm.remarks_option2 || '');
          setVisaRemarksActiveOption(firstVisaForm.remarks_active || 'option1');
        }
        
        setFormData({
          tour_code: basic.tour_code || '',
          tour_type: basic.tour_type || 'individual',
          title: basic.title || '',
          category_id: basic.category_id || 1,
          primary_destination_id: basic.primary_destination_id || '',
          country_id: basic.country_id || '',
          duration_days: basic.duration_days || '',
          overview: basic.overview || '',
          base_price_adult: basic.base_price_adult || '',
          emi_price: basic.emi_price || '',
          is_international: basic.is_international || 0
        });

        if (data.itinerary && Array.isArray(data.itinerary)) {
          const formattedItineraries = data.itinerary.map(item => ({
            day: item.day,
            title: item.title,
            description: item.description || '',
            meals: item.meals || ''
          }));
          setItineraries(formattedItineraries);
        }

        if (data.inclusions && Array.isArray(data.inclusions)) {
          setInclusions(data.inclusions.map(inc => inc.item));
        }

        if (data.exclusions && Array.isArray(data.exclusions)) {
          setExclusions(data.exclusions.map(exc => exc.item));
        }

        if (data.costs && Array.isArray(data.costs)) {
          setTourCosts(data.costs);
        }

        if (data.optional_tours && Array.isArray(data.optional_tours)) {
          setOptionalTours(data.optional_tours);
        }

        if (data.emi_options && Array.isArray(data.emi_options)) {
          const defaultOptions = [
            { particulars: 'Per Month Payment', months: 6, loan_amount: '', emi: '' },
            { particulars: 'Per Month Payment', months: 12, loan_amount: '', emi: '' },
            { particulars: 'Per Month Payment', months: 18, loan_amount: '', emi: '' },
            { particulars: 'Per Month Payment', months: 24, loan_amount: '', emi: '' },
            { particulars: 'Per Month Payment', months: 30, loan_amount: '', emi: '' },
            { particulars: 'Per Month Payment', months: 36, loan_amount: '', emi: '' },
            { particulars: 'Per Month Payment', months: 48, loan_amount: '', emi: '' }
          ];

          const updatedOptions = defaultOptions.map(option => {
            const existingOption = data.emi_options.find(eo => eo.months === option.months);
            return existingOption ? {
              ...option,
              loan_amount: existingOption.loan_amount || '',
              emi: existingOption.emi || ''
            } : option;
          });

          setEmiOptions(updatedOptions);
          
          const firstEmi = data.emi_options[0];
          if (firstEmi && firstEmi.loan_amount) {
            setEmiLoanAmount(firstEmi.loan_amount);
          }
        }

        if (data.hotels && Array.isArray(data.hotels)) {
          const formattedHotels = data.hotels.map(hotel => ({
            ...hotel,
            standard_hotel_name: hotel.standard_hotel_name || '',
            deluxe_hotel_name: hotel.deluxe_hotel_name || '',
            executive_hotel_name: hotel.executive_hotel_name || ''
          }));
          setHotelRows(formattedHotels);
        }

        if (data.transport && Array.isArray(data.transport)) {
          const formattedTransports = data.transport.map(t => ({
            description: t.description || ''
          }));
          setTransports(formattedTransports);
        }

        if (data.visa_details && Array.isArray(data.visa_details)) {
          const touristVisaData = data.visa_details.filter(item => item.type === 'tourist');
          setTouristVisaItems(touristVisaData.map(item => ({ description: item.description })));
          
          const transitVisaData = data.visa_details.filter(item => item.type === 'transit');
          setTransitVisaItems(transitVisaData.map(item => ({ description: item.description })));
          
          const businessVisaData = data.visa_details.filter(item => item.type === 'business');
          setBusinessVisaItems(businessVisaData.map(item => ({ description: item.description })));
          
          const photoData = data.visa_details.filter(item => item.type === 'photo');
          setPhotoItems(photoData.map(item => ({ description: item.description })));
        }
        
        if (data.visa_forms && Array.isArray(data.visa_forms)) {
          const formattedForms = data.visa_forms.map(form => ({
            type: form.visa_type,
            download_action: form.download_action,
            fill_action: form.fill_action,
            action1_file: form.action1_file,
            action2_file: form.action2_file
          }));
          setVisaFormItems(formattedForms);
        }
        
        if (data.visa_fees && Array.isArray(data.visa_fees)) {
          const visaFeeRows = data.visa_fees.map(fee => ({
            id: fee.fee_id || fee.id,
            type: fee.row_type,
            tourist: fee.tourist || '',
            transit: fee.transit || '',
            business: fee.business || '',
            tourist_charges: fee.tourist_charges || '',
            transit_charges: fee.transit_charges || '',
            business_charges: fee.business_charges || ''
          }));
          setVisaFeesRows(visaFeeRows);
        }
        
        if (data.visa_submission && Array.isArray(data.visa_submission)) {
          const submissionRowsData = data.visa_submission.map(item => ({
            id: item.submission_id || item.id,
            label: item.label || '',
            tourist: item.tourist || '',
            transit: item.transit || '',
            business: item.business || ''
          }));
          setSubmissionRows(submissionRowsData);
        }

        if (data.booking_poi && Array.isArray(data.booking_poi)) {
          const formattedPois = data.booking_poi.map(poi => ({
            item: poi.item,
            amount_details: poi.amount_details || ''
          }));
          setBookingPois(formattedPois);
        }

        if (data.cancellation_policies && Array.isArray(data.cancellation_policies)) {
          const formattedPolicies = data.cancellation_policies.map(policy => ({
            cancellation_policy: policy.cancellation_policy,
            charges: policy.charges || ''
          }));
          setCancelPolicies(formattedPolicies);
        }

        if (data.images && Array.isArray(data.images)) {
          setExistingImages(data.images);
        }

        setSuccess('Tour data loaded successfully');
      }
    } catch (err) {
      setError('Failed to load tour data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // NAVIGATION
  // ========================

  const goNext = () => {
    const currentIndex = TAB_LIST.indexOf(activeTab);
    
    if (activeTab === 'visa') {
      const currentSubTabIndex = visaSubTabs.indexOf(activeVisaSubTab);
      
      if (currentSubTabIndex < visaSubTabs.length - 1) {
        setActiveVisaSubTab(visaSubTabs[currentSubTabIndex + 1]);
        return;
      } else {
        if (currentIndex < TAB_LIST.length - 1) {
          setActiveTab(TAB_LIST[currentIndex + 1]);
        }
        return;
      }
    }
    
    if (currentIndex < TAB_LIST.length - 1) {
      setActiveTab(TAB_LIST[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const currentIndex = TAB_LIST.indexOf(activeTab);
    
    if (activeTab === 'visa') {
      const currentSubTabIndex = visaSubTabs.indexOf(activeVisaSubTab);
      
      if (currentSubTabIndex > 0) {
        setActiveVisaSubTab(visaSubTabs[currentSubTabIndex - 1]);
        return;
      } else {
        if (currentIndex > 0) {
          setActiveTab(TAB_LIST[currentIndex - 1]);
        }
        return;
      }
    }
    
    if (currentIndex > 0) {
      setActiveTab(TAB_LIST[currentIndex - 1]);
    }
  };

  const handleCancel = () => {
    navigate('/intl-tours');
  };

  const isLastTab = activeTab === TAB_LIST[TAB_LIST.length - 1];

  // ========================
  // SAVE FUNCTIONS
  // ========================

  const uploadVisaFormFiles = async (tourId, visaForms) => {
    const uploadedForms = [];

    for (const form of visaForms) {
      const formData = {
        type: form.type,
        download_action: form.download_action,
        fill_action: form.fill_action,
        action1_file: null,
        action2_file: null
      };

      if (form.action1_file && typeof form.action1_file === 'object' && form.action1_file instanceof File) {
        const fileName = await handleVisaFormFileUpload(tourId, form.type, 'action1', form.action1_file);
        if (fileName) formData.action1_file = fileName;
      } else if (typeof form.action1_file === 'string') {
        formData.action1_file = form.action1_file;
      }

      if (form.action2_file && typeof form.action2_file === 'object' && form.action2_file instanceof File) {
        const fileName = await handleVisaFormFileUpload(tourId, form.type, 'action2', form.action2_file);
        if (fileName) formData.action2_file = fileName;
      } else if (typeof form.action2_file === 'string') {
        formData.action2_file = form.action2_file;
      }

      uploadedForms.push(formData);
    }

    return uploadedForms;
  };

  const createTour = async () => {
    if (!formData.tour_code.trim()) {
      setError('Tour code is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.title.trim()) {
      setError('Tour title is required');
      setActiveTab('basic');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const completeFormData = {
        tour_code: formData.tour_code,
        title: formData.title,
        tour_type: formData.tour_type || 'individual',
        primary_destination_id: formData.primary_destination_id,
        country_id: formData.country_id,
        duration_days: Number(formData.duration_days) || 0,
        overview: formData.overview || '',
        base_price_adult: Number(formData.base_price_adult) || 0,
        emi_price: formData.emi_price ? Number(formData.emi_price) : null,
        is_international: 1,
        status: 1
      };

      const tourRes = await fetch(`${baseurl}/api/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeFormData)
      });

      if (!tourRes.ok) {
        const err = await tourRes.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create tour');
      }

      const tourData = await tourRes.json();
      const tourId = tourData.tour_id || tourData.id || tourData.insertId;

      const uploadedVisaForms = await uploadVisaFormFiles(tourId, visaFormItems);

      if (itineraries.length > 0) {
        const itineraryPayload = itineraries.map((item) => ({
          ...item,
          tour_id: tourId
        }));
        await fetch(`${baseurl}/api/itineraries/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itineraryPayload)
        });
      }

      if (departures.length > 0) {
        const departuresWithOptions = departures.map(dep => ({
          ...dep,
          tour_type: 'Individual',
          description_option1: departureOption1,
          description_option2: departureOption2,
          description_active: departureActiveOption,
          description: departureActiveOption === 'option1' ? departureOption1 : departureOption2
        }));
        await fetch(`${baseurl}/api/departures/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, departures: departuresWithOptions })
        });
      }

      if (tourCosts.length > 0) {
        const costsWithBothOptions = tourCosts.map(cost => ({
          ...cost,
          cost_remarks: costRemarksActiveOption === 'option1' ? costRemarksOption1 : costRemarksOption2,
          cost_remarks_option1: costRemarksOption1,
          cost_remarks_option2: costRemarksOption2,
          cost_remarks_active: costRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-costs/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, costs: costsWithBothOptions })
        });
      }

      if (optionalTours.length > 0) {
        const optionalWithBothOptions = optionalTours.map(opt => ({
          ...opt,
          optional_remarks: optionalTourRemarksActiveOption === 'option1' ? optionalTourRemarksOption1 : optionalTourRemarksOption2,
          optional_remarks_option1: optionalTourRemarksOption1,
          optional_remarks_option2: optionalTourRemarksOption2,
          optional_remarks_active: optionalTourRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/optional-tours/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, optional_tours: optionalWithBothOptions })
        });
      }

      if (emiLoanAmount && !isNaN(emiLoanAmount) && emiLoanAmount > 0) {
        await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tour_id: tourId, 
            loan_amount: emiLoanAmount,
            emi_remarks: emiRemarksActiveOption === 'option1' ? emiRemarksOption1 : emiRemarksOption2,
            emi_remarks_option1: emiRemarksOption1,
            emi_remarks_option2: emiRemarksOption2,
            emi_remarks_active: emiRemarksActiveOption
          })
        });
      }

      if (hotelRows.length > 0) {
        const hotelsWithBothOptions = hotelRows.map(hotel => ({
          ...hotel,
          hotel_remarks: hotelRemarksActiveOption === 'option1' ? hotelRemarksOption1 : hotelRemarksOption2,
          hotel_remarks_option1: hotelRemarksOption1,
          hotel_remarks_option2: hotelRemarksOption2,
          hotel_remarks_active: hotelRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-hotels/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, hotels: hotelsWithBothOptions })
        });
      }

      const visaData = {
        tourist_visa: touristVisaItems,
        transit_visa: transitVisaItems,
        business_visa: businessVisaItems,
        visa_forms: uploadedVisaForms.map(form => ({
          visa_type: form.type,
          type: form.type,
          download_action: form.download_action || 'Download',
          fill_action: form.fill_action || 'Fill Manually',
          action1_file: form.action1_file,
          action2_file: form.action2_file,
          remarks: visaRemarksActiveOption === 'option1' ? visaRemarksOption1 : visaRemarksOption2,
          remarks_option1: visaRemarksOption1,
          remarks_option2: visaRemarksOption2,
          remarks_active: visaRemarksActiveOption
        })),
        photo: [...photoItems],
        visa_fees: visaFeesRows.map((row, index) => ({
          type: row.type,
          tourist: row.tourist || '',
          transit: row.transit || '',
          business: row.business || '',
          tourist_charges: row.tourist_charges || '',
          transit_charges: row.transit_charges || '',
          business_charges: row.business_charges || '',
          row_order: index
        })),
        submission: submissionRows.map((row, index) => ({
          label: row.label,
          tourist: row.tourist,
          transit: row.transit,
          business: row.business,
          row_order: index
        }))
      };

      if (touristVisaItems.length > 0 || transitVisaItems.length > 0 || businessVisaItems.length > 0 || photoItems.length > 0) {
        const visaResponse = await fetch(`${baseurl}/api/visa/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, ...visaData })
        });
        
        if (!visaResponse.ok) {
          const visaResult = await visaResponse.json();
          throw new Error(`Visa save failed: ${visaResult.error || visaResponse.statusText}`);
        }
      }

      if (transports.length > 0) {
        const transportsWithBothOptions = transports.map(transport => ({
          ...transport,
          flight_remarks: flightRemarksActiveOption === 'option1' ? flightRemarksOption1 : flightRemarksOption2,
          flight_remarks_option1: flightRemarksOption1,
          flight_remarks_option2: flightRemarksOption2,
          flight_remarks_active: flightRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-transports/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: transportsWithBothOptions })
        });
      }

      if (inclusions.length > 0) {
        await fetch(`${baseurl}/api/inclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: inclusions })
        });
      }

      if (exclusions.length > 0) {
        await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: exclusions })
        });
      }

      if (bookingPois.length > 0) {
        const poisWithBothOptions = bookingPois.map(poi => ({
          ...poi,
          booking_remarks: bookingPoiRemarksActiveOption === 'option1' ? bookingPoiRemarksOption1 : bookingPoiRemarksOption2,
          booking_remarks_option1: bookingPoiRemarksOption1,
          booking_remarks_option2: bookingPoiRemarksOption2,
          booking_remarks_active: bookingPoiRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-booking-poi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: poisWithBothOptions })
        });
      }

      if (cancelPolicies.length > 0) {
        const policiesWithBothOptions = cancelPolicies.map(policy => ({
          ...policy,
          cancellation_remarks: cancellationRemarksActiveOption === 'option1' ? cancellationRemarksOption1 : cancellationRemarksOption2,
          cancellation_remarks_option1: cancellationRemarksOption1,
          cancellation_remarks_option2: cancellationRemarksOption2,
          cancellation_remarks_active: cancellationRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-cancellation/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, policies: policiesWithBothOptions })
        });
      }

      if (instructions.length > 0) {
        const instructionsWithBothOptions = instructions.map(inst => ({
          item: instructionActiveOption === 'option1' ? instructionOption1 : instructionOption2,
          item_option1: instructionOption1,
          item_option2: instructionOption2,
          item_active: instructionActiveOption
        }));
        await fetch(`${baseurl}/api/tour-instructions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: instructionsWithBothOptions })
        });
      }

      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach((file) => {
          formDataImages.append('images', file);
        });
        await fetch(`${baseurl}/api/images/upload/${tourId}`, {
          method: 'POST',
          body: formDataImages
        });
      }

      setSuccess('Tour created successfully!');
      setTimeout(() => navigate('/intl-tours'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create tour');
    } finally {
      setLoading(false);
    }
  };

  const updateTour = async () => {
    if (!formData.tour_code.trim()) {
      setError('Tour code is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.title.trim()) {
      setError('Tour title is required');
      setActiveTab('basic');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const tourUpdateData = {
        title: formData.title.trim(),
        tour_type: formData.tour_type || 'individual',
        primary_destination_id: formData.primary_destination_id,
        country_id: formData.country_id,
        duration_days: Number(formData.duration_days) || 0,
        overview: formData.overview || '',
        base_price_adult: Number(formData.base_price_adult) || 0,
        emi_price: formData.emi_price ? Number(formData.emi_price) : null,
        is_international: 1
      };

      const tourRes = await fetch(`${baseurl}/api/tours/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourUpdateData)
      });

      const tourResponse = await tourRes.json();
      if (!tourRes.ok) {
        throw new Error(tourResponse.error || tourResponse.message || 'Failed to update tour');
      }

      const deleteEndpoints = [
        `${baseurl}/api/departures/bulk/${id}`,
        `${baseurl}/api/tour-costs/tour/${id}`,
        `${baseurl}/api/optional-tours/tour/${id}`,
        `${baseurl}/api/emi-options/tour/${id}`,
        `${baseurl}/api/tour-hotels/tour/${id}`,
        `${baseurl}/api/tour-transports/tour/${id}`,
        `${baseurl}/api/tour-booking-poi/tour/${id}`,
        `${baseurl}/api/tour-cancellation/tour/${id}`,
        `${baseurl}/api/tour-instructions/tour/${id}`,
        `${baseurl}/api/exclusions/tour/${id}`,
        `${baseurl}/api/inclusions/tour/${id}`,
        `${baseurl}/api/itineraries/tour/${id}`
      ];

      for (const endpoint of deleteEndpoints) {
        try {
          await fetch(endpoint, { method: 'DELETE' });
        } catch (err) {
          console.warn(`Failed to delete from ${endpoint}:`, err.message);
        }
      }

      if (itineraries.length > 0) {
        const itineraryPayload = itineraries.map((item) => ({
          ...item,
          tour_id: id
        }));
        await fetch(`${baseurl}/api/itineraries/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itineraryPayload)
        });
      }

      if (departures.length > 0) {
        const departuresWithOptions = departures.map(dep => ({
          ...dep,
          tour_type: 'Individual',
          description_option1: departureOption1,
          description_option2: departureOption2,
          description_active: departureActiveOption,
          description: departureActiveOption === 'option1' ? departureOption1 : departureOption2
        }));
        await fetch(`${baseurl}/api/departures/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, departures: departuresWithOptions })
        });
      }

      if (tourCosts.length > 0) {
        const costsWithBothOptions = tourCosts.map(cost => ({
          ...cost,
          cost_remarks: costRemarksActiveOption === 'option1' ? costRemarksOption1 : costRemarksOption2,
          cost_remarks_option1: costRemarksOption1,
          cost_remarks_option2: costRemarksOption2,
          cost_remarks_active: costRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-costs/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, costs: costsWithBothOptions })
        });
      }

      if (optionalTours.length > 0) {
        const optionalWithBothOptions = optionalTours.map(opt => ({
          ...opt,
          optional_remarks: optionalTourRemarksActiveOption === 'option1' ? optionalTourRemarksOption1 : optionalTourRemarksOption2,
          optional_remarks_option1: optionalTourRemarksOption1,
          optional_remarks_option2: optionalTourRemarksOption2,
          optional_remarks_active: optionalTourRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/optional-tours/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, optional_tours: optionalWithBothOptions })
        });
      }

      if (emiLoanAmount && !isNaN(emiLoanAmount) && emiLoanAmount > 0) {
        await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tour_id: id, 
            loan_amount: emiLoanAmount,
            emi_remarks: emiRemarksActiveOption === 'option1' ? emiRemarksOption1 : emiRemarksOption2,
            emi_remarks_option1: emiRemarksOption1,
            emi_remarks_option2: emiRemarksOption2,
            emi_remarks_active: emiRemarksActiveOption
          })
        });
      }

      if (hotelRows.length > 0) {
        const hotelsWithBothOptions = hotelRows.map(hotel => ({
          ...hotel,
          hotel_remarks: hotelRemarksActiveOption === 'option1' ? hotelRemarksOption1 : hotelRemarksOption2,
          hotel_remarks_option1: hotelRemarksOption1,
          hotel_remarks_option2: hotelRemarksOption2,
          hotel_remarks_active: hotelRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-hotels/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, hotels: hotelsWithBothOptions })
        });
      }

      try {
        await fetch(`${baseurl}/api/visa/tour/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Failed to delete visa data:', err.message);
      }

      const uploadedVisaForms = await uploadVisaFormFiles(id, visaFormItems);

      const visaData = {
        tourist_visa: touristVisaItems,
        transit_visa: transitVisaItems,
        business_visa: businessVisaItems,
        visa_forms: uploadedVisaForms.map(form => ({
          visa_type: form.type,
          type: form.type,
          download_action: form.download_action || 'Download',
          fill_action: form.fill_action || 'Fill Manually',
          action1_file: form.action1_file,
          action2_file: form.action2_file,
          remarks: visaRemarksActiveOption === 'option1' ? visaRemarksOption1 : visaRemarksOption2,
          remarks_option1: visaRemarksOption1,
          remarks_option2: visaRemarksOption2,
          remarks_active: visaRemarksActiveOption
        })),
        photo: [...photoItems],
        visa_fees: visaFeesRows.map((row, index) => ({
          type: row.type,
          tourist: row.tourist || '',
          transit: row.transit || '',
          business: row.business || '',
          tourist_charges: row.tourist_charges || '',
          transit_charges: row.transit_charges || '',
          business_charges: row.business_charges || '',
          row_order: index
        })),
        submission: submissionRows.map((row, index) => ({
          label: row.label,
          tourist: row.tourist,
          transit: row.transit,
          business: row.business,
          row_order: index
        }))
      };

      if (touristVisaItems.length > 0 || transitVisaItems.length > 0 || businessVisaItems.length > 0 || photoItems.length > 0) {
        const visaResponse = await fetch(`${baseurl}/api/visa/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, ...visaData })
        });
        
        if (!visaResponse.ok) {
          const visaResult = await visaResponse.json();
          throw new Error(`Visa save failed: ${visaResult.error || visaResponse.statusText}`);
        }
      }

      if (transports.length > 0) {
        const transportsWithBothOptions = transports.map(transport => ({
          ...transport,
          flight_remarks: flightRemarksActiveOption === 'option1' ? flightRemarksOption1 : flightRemarksOption2,
          flight_remarks_option1: flightRemarksOption1,
          flight_remarks_option2: flightRemarksOption2,
          flight_remarks_active: flightRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-transports/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: transportsWithBothOptions })
        });
      }

      if (inclusions.length > 0) {
        await fetch(`${baseurl}/api/inclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: inclusions })
        });
      }

      if (exclusions.length > 0) {
        await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: exclusions })
        });
      }

      if (bookingPois.length > 0) {
        const poisWithBothOptions = bookingPois.map(poi => ({
          ...poi,
          booking_remarks: bookingPoiRemarksActiveOption === 'option1' ? bookingPoiRemarksOption1 : bookingPoiRemarksOption2,
          booking_remarks_option1: bookingPoiRemarksOption1,
          booking_remarks_option2: bookingPoiRemarksOption2,
          booking_remarks_active: bookingPoiRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-booking-poi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: poisWithBothOptions })
        });
      }

      if (cancelPolicies.length > 0) {
        const policiesWithBothOptions = cancelPolicies.map(policy => ({
          ...policy,
          cancellation_remarks: cancellationRemarksActiveOption === 'option1' ? cancellationRemarksOption1 : cancellationRemarksOption2,
          cancellation_remarks_option1: cancellationRemarksOption1,
          cancellation_remarks_option2: cancellationRemarksOption2,
          cancellation_remarks_active: cancellationRemarksActiveOption
        }));
        await fetch(`${baseurl}/api/tour-cancellation/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, policies: policiesWithBothOptions })
        });
      }

      if (instructions.length > 0) {
        const instructionsWithBothOptions = instructions.map(inst => ({
          item: instructionActiveOption === 'option1' ? instructionOption1 : instructionOption2,
          item_option1: instructionOption1,
          item_option2: instructionOption2,
          item_active: instructionActiveOption
        }));
        await fetch(`${baseurl}/api/tour-instructions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: instructionsWithBothOptions })
        });
      }

      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach((file) => {
          formDataImages.append('images', file);
        });
        await fetch(`${baseurl}/api/images/upload/${id}`, {
          method: 'POST',
          body: formDataImages
        });
      }

      setSuccess('Tour updated successfully!');
      setTimeout(() => navigate('/intl-tours'), 1500);
    } catch (err) {
      console.error('Error updating tour:', err);
      setError(err.message || 'Failed to update tour');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (isLastTab) {
      const confirmMessage = isEditMode 
        ? 'Are you sure you want to update this tour with all changes?'
        : 'Are you sure you want to save this tour with all data?';
      
      const confirmed = window.confirm(confirmMessage);
      
      if (confirmed) {
        if (isEditMode) {
          updateTour();
        } else {
          createTour();
        }
      }
    } else {
      // Automatic navigation - no confirmation popup
      if (activeTab === 'visa') {
        const currentSubTabIndex = visaSubTabs.indexOf(activeVisaSubTab);
        
        if (currentSubTabIndex < visaSubTabs.length - 1) {
          setActiveVisaSubTab(visaSubTabs[currentSubTabIndex + 1]);
        } else {
          const currentIndex = TAB_LIST.indexOf(activeTab);
          if (currentIndex < TAB_LIST.length - 1) {
            setActiveTab(TAB_LIST[currentIndex + 1]);
          }
        }
      } else {
        goNext();
      }
    }
  };

  // ========================
  // RENDER
  // ========================

  const getAddConfigForTab = (tabKey) => {
    switch (tabKey) {
      case 'itineraries':
        return { 
          label: editingType === 'itinerary' ? 'Update Day' : '+ Add Day', 
          onClick: handleAddItinerary 
        };
      case 'departures':
        // No add button for Departures - data saved on main save only
        return null;
      case 'costs':
        return { 
          label: editingType === 'cost' ? 'Update Cost Row' : '+ Add Cost Row', 
          onClick: addCostRow 
        };
      case 'optionalTours':
        return { 
          label: editingType === 'optionalTour' ? 'Update Optional Tour' : '+ Add Optional Tour', 
          onClick: addOptionalTourRow 
        };
      case 'inclusions':
        return { 
          label: editingType === 'inclusion' ? 'Update Inclusion' : '+ Add Inclusion', 
          onClick: handleAddInclusion 
        };
      case 'exclusions':
        return { 
          label: editingType === 'exclusion' ? 'Update Exclusion' : '+ Add Exclusion', 
          onClick: handleAddExclusion 
        };
      case 'transport':
        return { 
          label: editingType === 'transport' ? 'Update Flight' : '+ Add Flight', 
          onClick: addTransportRow 
        };
      case 'hotels':
        return { 
          label: editingType === 'hotel' ? 'Update Hotel' : '+ Add Hotel', 
          onClick: addHotelRow 
        };
      case 'visa':
        if (activeVisaSubTab === 'tourist') {
          return { 
            label: editingType === 'touristVisa' ? 'Update Tourist Visa' : '+ Add Tourist Visa', 
            onClick: addTouristVisa 
          };
        } else if (activeVisaSubTab === 'transit') {
          return { 
            label: editingType === 'transitVisa' ? 'Update Transit Visa' : '+ Add Transit Visa', 
            onClick: addTransitVisa 
          };
        } else if (activeVisaSubTab === 'business') {
          return { 
            label: editingType === 'businessVisa' ? 'Update Business Visa' : '+ Add Business Visa', 
            onClick: addBusinessVisa 
          };
        } else if (activeVisaSubTab === 'photo') {
          return { 
            label: editingType === 'photo' ? 'Update Photo' : '+ Add Photo', 
            onClick: addPhoto 
          };
        } else if (activeVisaSubTab === 'form') {
          if (editingVisaFormIndex !== null) {
            return {
              label: 'Update Visa Form',
              onClick: updateVisaFormItem
            };
          }
        }
        return null;
      case 'bookingPoi':
        return { 
          label: editingType === 'poi' ? 'Update Booking Policy' : '+ Add Booking Policy', 
          onClick: addPoi 
        };
      case 'cancellation':
        return { 
          label: editingType === 'cancellation' ? 'Update Cancellation Policy' : '+ Add Cancellation Policy', 
          onClick: addCancelRow 
        };
      case 'instructions':
        // No add button for Instructions - data saved on main save only
        return null;
      default:
        return null;
    }
  };

  const addConfig = getAddConfigForTab(activeTab);

  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">{isEditMode ? 'Edit International Tour' : 'Add International Tour'}</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="d-flex justify-content-end gap-2 mt-4 mb-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="secondary"
            onClick={goBack}
            disabled={activeTab === 'basic' || loading}
          >
            Back
          </Button>

          {addConfig && (
            <Button
              variant="success"
              onClick={addConfig.onClick}
              disabled={loading}
            >
              {addConfig.label}
            </Button>
          )}

          <Button
            variant="primary"
            onClick={handleSaveClick}
            disabled={loading}
          >
            {loading ? 'Saving...' : 
            isLastTab ? (isEditMode ? 'Update All' : 'Save All') : 
            activeTab === 'visa' ? `Next (${visaSubTabs.indexOf(activeVisaSubTab) + 1}/${visaSubTabs.length})` : 
            'Save & Continue'}
          </Button>
        </div>

        <Card>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              {/* ======== TAB 1: BASIC DETAILS ======== */}
              <Tab eventKey="basic" title="Basic Details">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tour Code *</Form.Label>
                      <Form.Control
                        type="text"
                        name="tour_code"
                        value={formData.tour_code}
                        onChange={handleBasicChange}
                        readOnly
                        disabled={isEditMode}
                        style={{
                          cursor: isEditMode ? "not-allowed" : "default",
                          fontWeight: "bold",
                          backgroundColor: isEditMode ? "#f8f9fa" : "white"
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tour Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleBasicChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tour Price *</Form.Label>
                      <Form.Control
                        type="number"
                        name="base_price_adult"
                        value={formData.base_price_adult}
                        onChange={handleBasicChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>International Destinations *</Form.Label>
                      <Form.Select
                        name="primary_destination_id"
                        value={formData.primary_destination_id}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedDestination = destinations.find(d => d.destination_id == selectedId);
                          
                          setFormData(prev => ({
                            ...prev,
                            primary_destination_id: selectedId,
                            country_id: selectedDestination ? selectedDestination.country_id : ''
                          }));
                        }}
                      >
                        <option value="">Select Destination</option>
                        {destinations.map((d) => (
                          <option
                            key={d.destination_id}
                            value={d.destination_id}
                          >
                            {d.name} ({d.country_name})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Duration Days *</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration_days"
                        value={formData.duration_days}
                        onChange={handleBasicChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>EMI Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="emi_price"
                        value={formData.emi_price}
                        onChange={handleBasicChange}
                        placeholder="Optional EMI price"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              {/* ====== ITINERARIES TAB ====== */}
              <Tab eventKey="itineraries" title="Itineraries">
                <Row>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Day</Form.Label>
                      <Form.Control
                        type="number"
                        name="day"
                        value={itineraryItem.day}
                        onChange={handleItineraryChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={itineraryItem.title}
                        onChange={handleItineraryChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Meals</Form.Label>
                      <div className="d-flex gap-3">
                        <Form.Check
                          type="checkbox"
                          label="Breakfast"
                          name="breakfast"
                          checked={itineraryItem.meals.breakfast}
                          onChange={handleMealsCheckboxChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Lunch"
                          name="lunch"
                          checked={itineraryItem.meals.lunch}
                          onChange={handleMealsCheckboxChange}
                        />
                        <Form.Check
                          type="checkbox"
                          label="Dinner"
                          name="dinner"
                          checked={itineraryItem.meals.dinner}
                          onChange={handleMealsCheckboxChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={itineraryItem.description}
                    onChange={handleItineraryChange}
                  />
                </Form.Group>

                {itineraries.length > 0 && (
                  <Table striped bordered hover size="sm" className="mt-3">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Day</th>
                        <th>Title</th>
                        <th>Meals</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itineraries
                        .sort((a, b) => a.day - b.day)
                        .map((item, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{item.day}</td>
                            <td>{item.title}</td>
                            <td>{item.meals || '-'}</td>
                            <td>{item.description || '-'}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  onClick={() => editItinerary(idx)}
                                  title="Edit"
                                >
                                  <Pencil size={14} />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRemoveItinerary(idx)}
                                  title="Remove"
                                >
                                  <Trash size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== DEPARTURES TAB ====== */}
              <Tab eventKey="departures" title="Departures">
                <Form.Group className="mb-3">
                  <OptionTabs
                    activeOption={departureActiveOption}
                    onOptionChange={setDepartureActiveOption}
                    option1Value={departureOption1}
                    option2Value={departureOption2}
                    onOption1Change={(val) => handleDepartureDescriptionOptionChange('option1', val)}
                    onOption2Change={(val) => handleDepartureDescriptionOptionChange('option2', val)}
                    placeholder="Enter departure description for Option 1"
                    label="Departures Description"
                  />
                </Form.Group>

                {departures.length > 0 && (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departures.map((dep, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{dep.description || '-'}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editDeparture(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveDeparture(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== COSTS TAB ====== */}
              <Tab eventKey="costs" title="Tour Cost">
                <Row className="align-items-end">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Pax *</Form.Label>
                      <Form.Control
                        type="number"
                        name="pax"
                        value={tourCostItem.pax}
                        onChange={handleCostChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Standard Hotel</Form.Label>
                      <Form.Control
                        type="number"
                        name="standard_hotel"
                        value={tourCostItem.standard_hotel}
                        onChange={handleCostChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Deluxe Hotel</Form.Label>
                      <Form.Control
                        type="number"
                        name="deluxe_hotel"
                        value={tourCostItem.deluxe_hotel}
                        onChange={handleCostChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Executive Hotel</Form.Label>
                      <Form.Control
                        type="number"
                        name="executive_hotel"
                        value={tourCostItem.executive_hotel}
                        onChange={handleCostChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Child With Bed</Form.Label>
                      <Form.Control
                        type="number"
                        name="child_with_bed"
                        value={tourCostItem.child_with_bed}
                        onChange={handleCostChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Child No Bed</Form.Label>
                      <Form.Control
                        type="number"
                        name="child_no_bed"
                        value={tourCostItem.child_no_bed}
                        onChange={handleCostChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <OptionTabs
                    activeOption={costRemarksActiveOption}
                    onOptionChange={handleCostRemarksActiveChange}
                    option1Value={costRemarksOption1}
                    option2Value={costRemarksOption2}
                    onOption1Change={(val) => handleCostRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleCostRemarksOptionChange('option2', val)}
                    placeholder="Enter cost remarks for Option 1"
                    label="Cost Remarks"
                  />
                </Form.Group>

                {tourCosts.length > 0 && (
                  <Table striped bordered hover size="sm" className="mt-3">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Pax</th>
                        <th>Standard</th>
                        <th>Deluxe</th>
                        <th>Executive</th>
                        <th>Chd Bed</th>
                        <th>Chd NoBed</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tourCosts.map((c, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{c.pax}</td>
                          <td>{c.standard_hotel || 'NA'}</td>
                          <td>{c.deluxe_hotel || 'NA'}</td>
                          <td>{c.executive_hotel || 'NA'}</td>
                          <td>{c.child_with_bed || 'NA'}</td>
                          <td>{c.child_no_bed || 'NA'}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editCostRow(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeCostRow(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== OPTIONAL TOURS TAB ====== */}
              <Tab eventKey="optionalTours" title="Optional Tour">
                <Row className="align-items-end">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Tour Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="tour_name"
                        value={optionalTourItem.tour_name}
                        onChange={handleOptionalTourChange}
                        placeholder="Enter optional tour name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Adult Price</Form.Label>
                      <Form.Control
                        type="text"
                        name="adult_price"
                        value={optionalTourItem.adult_price}
                        onChange={handleOptionalTourChange}
                        placeholder="Enter adult price"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Child Price</Form.Label>
                      <Form.Control
                        type="text"
                        name="child_price"
                        value={optionalTourItem.child_price}
                        onChange={handleOptionalTourChange}
                        placeholder="Enter child price"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <OptionTabs
                    activeOption={optionalTourRemarksActiveOption}
                    onOptionChange={handleOptionalTourRemarksActiveChange}
                    option1Value={optionalTourRemarksOption1}
                    option2Value={optionalTourRemarksOption2}
                    onOption1Change={(val) => handleOptionalTourRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleOptionalTourRemarksOptionChange('option2', val)}
                    placeholder="Enter optional tour remarks for Option 1"
                    label="Optional Tour Remarks"
                  />
                </Form.Group>

                {optionalTours.length > 0 && (
                  <Table striped bordered hover size="sm" className="mt-3">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tour Name</th>
                        <th>Adult Price</th>
                        <th>Child Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optionalTours.map((tour, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{tour.tour_name}</td>
                          <td>{tour.adult_price || 'NA'}</td>
                          <td>{tour.child_price || 'NA'}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editOptionalTourRow(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeOptionalTourRow(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== EMI OPTIONS TAB ====== */}
              <Tab eventKey="emiOptions" title="EMI Options">
                <Card className="mb-4">
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Loan Amount *</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>₹</InputGroup.Text>
                            <Form.Control
                              type="number"
                              min="0"
                              step="1000"
                              value={emiLoanAmount}
                              onChange={(e) => handleLoanAmountChange(e.target.value)}
                              placeholder="Enter loan amount"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Interest Rate (%) *</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>%</InputGroup.Text>
                            <Form.Control
                              type="number"
                              min="0"
                              max="50"
                              step="0.1"
                              value={emiInterestRate}
                              onChange={(e) => setEmiInterestRate(e.target.value)}
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Table striped bordered hover responsive className="align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th width="5%">#</th>
                      <th width="30%">Particulars</th>
                      <th width="25%">Loan Amount</th>
                      <th width="15%">Months</th>
                      <th width="25%">EMI (Calculated)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emiOptions.map((option, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          <Form.Control
                            type="text"
                            value={option.particulars}
                            readOnly
                            plaintext
                            className="border-0 bg-transparent"
                          />
                        </td>
                        <td>
                          <Form.Group className="mb-0">
                            <InputGroup>
                              <InputGroup.Text>₹</InputGroup.Text>
                              <Form.Control
                                type="number"
                                min="0"
                                step="1000"
                                value={option.loan_amount || ''}
                                onChange={(e) => {
                                  const updatedOptions = [...emiOptions];
                                  updatedOptions[index].loan_amount = e.target.value;
                                  updatedOptions[index].emi = calculateEMI(
                                    e.target.value, 
                                    option.months, 
                                    emiInterestRate
                                  );
                                  setEmiOptions(updatedOptions);
                                }}
                                placeholder="Enter amount"
                                readOnly={!!emiLoanAmount}
                              />
                            </InputGroup>
                          </Form.Group>
                        </td>
                        <td className="text-center">
                          <Form.Control
                            type="text"
                            value={option.months}
                            readOnly
                            plaintext
                            className="border-0 bg-transparent text-center"
                          />
                        </td>
                        <td>
                          <Form.Group className="mb-0">
                            <InputGroup>
                              <InputGroup.Text>₹</InputGroup.Text>
                              <Form.Control
                                type="number"
                                min="0"
                                step="100"
                                value={option.emi || ''}
                                readOnly
                                className="bg-light"
                                style={{ fontWeight: 'bold' }}
                              />
                            </InputGroup>
                          </Form.Group>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Form.Group className="mt-4">
                  <OptionTabs
                    activeOption={emiRemarksActiveOption}
                    onOptionChange={handleEmiRemarksActiveChange}
                    option1Value={emiRemarksOption1}
                    option2Value={emiRemarksOption2}
                    onOption1Change={(val) => handleEmiRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleEmiRemarksOptionChange('option2', val)}
                    placeholder="Enter EMI remarks for Option 1"
                    label="EMI Remarks"
                  />
                </Form.Group>
              </Tab>

              {/* ====== INCLUSIONS TAB ====== */}
              <Tab eventKey="inclusions" title="Inclusions">
                <Form.Group className="mb-3">
                  <Form.Label>Add Inclusion</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={inclusionText}
                    onChange={(e) => setInclusionText(e.target.value)}
                    placeholder="Type an inclusion"
                  />
                </Form.Group>

                {inclusions.length > 0 && (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Inclusion</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inclusions.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editInclusion(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveInclusion(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== EXCLUSIONS TAB ====== */}
              <Tab eventKey="exclusions" title="Exclusions">
                <Form.Group className="mb-3">
                  <Form.Label>Add Exclusion</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={exclusionText}
                    onChange={(e) => setExclusionText(e.target.value)}
                    placeholder="Type an exclusion"
                  />
                </Form.Group>

                {exclusions.length > 0 && (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Exclusion</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exclusions.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editExclusion(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveExclusion(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== TRANSPORT TAB ====== */}
              <Tab eventKey="transport" title="Flights">
                <Row className="mt-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Flights Details</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={transportItem.description}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <OptionTabs
                    activeOption={flightRemarksActiveOption}
                    onOptionChange={handleFlightRemarksActiveChange}
                    option1Value={flightRemarksOption1}
                    option2Value={flightRemarksOption2}
                    onOption1Change={(val) => handleFlightRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleFlightRemarksOptionChange('option2', val)}
                    placeholder="Enter flight remarks for Option 1"
                    label="Flight Remarks"
                  />
                </Form.Group>

                {transports.length > 0 && (
                  <Table striped bordered hover size="sm" className="mt-3">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transports.map((t, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{t.description || 'NA'}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editTransportRow(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeTransportRow(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== HOTELS TAB ====== */}
              <Tab eventKey="hotels" title="Hotels">
                <Row className="align-items-end">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={hotelItem.city}
                        onChange={handleHotelChange}
                        placeholder="Enter city name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nights</Form.Label>
                      <Form.Control
                        type="number"
                        name="nights"
                        value={hotelItem.nights}
                        onChange={handleHotelChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mt-3">
                      <Form.Label>Standard Hotel Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="standard_hotel_name"
                        value={hotelItem.standard_hotel_name}
                        onChange={handleHotelChange}
                        placeholder="Enter standard hotel name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mt-3">
                      <Form.Label>Deluxe Hotel Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="deluxe_hotel_name"
                        value={hotelItem.deluxe_hotel_name}
                        onChange={handleHotelChange}
                        placeholder="Enter deluxe hotel name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mt-3">
                      <Form.Label>Executive Hotel Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="executive_hotel_name"
                        value={hotelItem.executive_hotel_name}
                        onChange={handleHotelChange}
                        placeholder="Enter executive hotel name"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <OptionTabs
                    activeOption={hotelRemarksActiveOption}
                    onOptionChange={handleHotelRemarksActiveChange}
                    option1Value={hotelRemarksOption1}
                    option2Value={hotelRemarksOption2}
                    onOption1Change={(val) => handleHotelRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleHotelRemarksOptionChange('option2', val)}
                    placeholder="Enter hotel remarks for Option 1"
                    label="Hotel Remarks"
                  />
                </Form.Group>

                {hotelRows.length > 0 && (
                  <Table striped bordered hover size="sm" className="mt-3">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>City</th>
                        <th>Nights</th>
                        <th>Standard Hotel</th>
                        <th>Deluxe Hotel</th>
                        <th>Executive Hotel</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelRows.map((h, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{h.city}</td>
                          <td>{h.nights}</td>
                          <td>{h.standard_hotel_name || '-'}</td>
                          <td>{h.deluxe_hotel_name || '-'}</td>
                          <td>{h.executive_hotel_name || '-'}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editHotelRow(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeHotelRow(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== VISA TAB ====== */}
              <Tab eventKey="visa" title="Visa">
                <Tabs
                  activeKey={activeVisaSubTab}
                  onSelect={(k) => setActiveVisaSubTab(k)}
                  className="mb-4"
                >
                  {/* Subtab 1: Tourist Visa */}
                  <Tab eventKey="tourist" title="Tourist Visa">
                    <Form.Group className="mb-3">
                      <Form.Label>Tourist Visa Entry</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={touristVisaForm.description}
                        onChange={handleTouristVisaChange}
                        placeholder="Enter tourist visa details"
                      />
                    </Form.Group>

                    {touristVisaItems.length > 0 && (
                      <Table striped bordered hover size="sm" className="mt-3">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {touristVisaItems.map((item, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{item.description || '-'}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => editTouristVisa(idx)}
                                    title="Edit"
                                  >
                                    <Pencil size={14} />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeTouristVisa(idx)}
                                    title="Remove"
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Tab>

                  {/* Subtab 2: Transit Visa */}
                  <Tab eventKey="transit" title="Transit Visa">
                    <Form.Group className="mb-3">
                      <Form.Label>Transit Visa Entry</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={transitVisaForm.description}
                        onChange={handleTransitVisaChange}
                        placeholder="Enter transit visa details"
                      />
                    </Form.Group>

                    {transitVisaItems.length > 0 && (
                      <Table striped bordered hover size="sm" className="mt-3">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transitVisaItems.map((item, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{item.description || '-'}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => editTransitVisa(idx)}
                                    title="Edit"
                                  >
                                    <Pencil size={14} />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeTransitVisa(idx)}
                                    title="Remove"
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Tab>

                  {/* Subtab 3: Business Visa */}
                  <Tab eventKey="business" title="Business Visa">
                    <Form.Group className="mb-3">
                      <Form.Label>Business Visa Entry</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={businessVisaForm.description}
                        onChange={handleBusinessVisaChange}
                        placeholder="Enter business visa details"
                      />
                    </Form.Group>

                    {businessVisaItems.length > 0 && (
                      <Table striped bordered hover size="sm" className="mt-3">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {businessVisaItems.map((item, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{item.description || '-'}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => editBusinessVisa(idx)}
                                    title="Edit"
                                  >
                                    <Pencil size={14} />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeBusinessVisa(idx)}
                                    title="Remove"
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Tab>

                  {/* Subtab 4: Visa Form */}
                  <Tab eventKey="form" title="Visa Form">
                    <div className="mb-3">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => {
                          const newVisaForm = {
                            type: 'New Visa Type',
                            download_action: 'Download',
                            fill_action: 'Fill Manually',
                            action1_file: null,
                            action2_file: null
                          };
                          setVisaFormItems([...visaFormItems, newVisaForm]);
                        }}
                      >
                        + Add New Visa Form
                      </Button>
                    </div>

                    {visaFormItems.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted">No visa forms added yet. Click "Add New Visa Form" to get started.</p>
                      </div>
                    ) : (
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th width="20%">Visa Type</th>
                            <th width="35%">Upload PDF</th>
                            <th width="35%">Upload Word</th>
                            <th width="10%">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visaFormItems.map((item, idx) => {
                            const pdfFile = item.action1_file;
                            const wordFile = item.action2_file;
                            const pdfUrl = getFileUrl(pdfFile);
                            const wordUrl = getFileUrl(wordFile);
                            
                            return (
                              <tr key={idx}>
                                <td>
                                  <Form.Control
                                    type="text"
                                    value={item.type}
                                    onChange={(e) => {
                                      const updated = [...visaFormItems];
                                      updated[idx].type = e.target.value;
                                      setVisaFormItems(updated);
                                    }}
                                    placeholder="Enter visa type"
                                    size="sm"
                                  />
                                </td>
                                <td>
                                  <div className="d-flex flex-column gap-2">
                                    <div>
                                      <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => document.getElementById(`pdf-upload-${idx}`).click()}
                                      >
                                        {pdfFile ? 'Change PDF' : 'Upload PDF'}
                                      </Button>
                                      <Form.Control
                                        type="file"
                                        id={`pdf-upload-${idx}`}
                                        accept=".pdf"
                                        className="d-none"
                                        onChange={(e) => handleVisaFormFileChange(idx, 'action1', e.target.files[0])}
                                      />
                                    </div>
                                    
                                    {pdfFile && (
                                      <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded">
                                        <div className="flex-grow-1">
                                          <small className="text-success d-block">
                                            <strong>✓ Uploaded:</strong>
                                          </small>
                                          <small className="text-muted d-block">
                                            {typeof pdfFile === 'string' ? pdfFile.substring(pdfFile.lastIndexOf('/') + 1) : pdfFile.name}
                                          </small>
                                        </div>
                                        
                                        {pdfUrl && (
                                          <div className="ms-2">
                                            <Button
                                              variant="outline-info"
                                              size="sm"
                                              onClick={() => openFileInNewTab(pdfUrl)}
                                              title="View PDF"
                                              className="d-flex align-items-center"
                                            >
                                              👁️ View
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                
                                <td>
                                  <div className="d-flex flex-column gap-2">
                                    <div>
                                      <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={() => document.getElementById(`word-upload-${idx}`).click()}
                                      >
                                        {wordFile ? 'Change Word' : 'Upload Word'}
                                      </Button>
                                      <Form.Control
                                        type="file"
                                        id={`word-upload-${idx}`}
                                        accept=".doc,.docx"
                                        className="d-none"
                                        onChange={(e) => handleVisaFormFileChange(idx, 'action2', e.target.files[0])}
                                      />
                                    </div>
                                    
                                    {wordFile && (
                                      <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded">
                                        <div className="flex-grow-1">
                                          <small className="text-success d-block">
                                            <strong>✓ Uploaded:</strong>
                                          </small>
                                          <small className="text-muted d-block">
                                            {typeof wordFile === 'string' ? wordFile.substring(wordFile.lastIndexOf('/') + 1) : wordFile.name}
                                          </small>
                                        </div>
                                        
                                        {wordUrl && (
                                          <div className="ms-2">
                                            <Button
                                              variant="outline-info"
                                              size="sm"
                                              onClick={() => openFileInNewTab(wordUrl)}
                                              title="View Document"
                                              className="d-flex align-items-center"
                                            >
                                              👁️ View
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex flex-column gap-1">
                                    {editingVisaFormIndex === idx ? (
                                      <Button
                                        variant="success"
                                        size="sm"
                                        onClick={updateVisaFormItem}
                                      >
                                        Save
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline-warning"
                                        size="sm"
                                        onClick={() => editVisaFormItem(idx)}
                                      >
                                        <Pencil size={14} />
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => {
                                        const newItems = [...visaFormItems];
                                        newItems.splice(idx, 1);
                                        setVisaFormItems(newItems);
                                      }}
                                      title="Remove"
                                    >
                                      <Trash size={14} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}

                    <Card className="mt-3">
                      <Card.Body>
                        <Form.Group>
                          <OptionTabs
                            activeOption={visaRemarksActiveOption}
                            onOptionChange={handleVisaRemarksActiveChange}
                            option1Value={visaRemarksOption1}
                            option2Value={visaRemarksOption2}
                            onOption1Change={(val) => handleVisaRemarksOptionChange('option1', val)}
                            onOption2Change={(val) => handleVisaRemarksOptionChange('option2', val)}
                            placeholder="Enter visa remarks for Option 1"
                            label="Visa Remarks"
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Tab>

                  {/* Subtab 5: Photo */}
                  <Tab eventKey="photo" title="Photo">
                    <Card className="mb-4">
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {editingType === 'photo' ? 'Edit Photo Description' : 'Add Photo Description'}
                            {editingType === 'photo' && (
                              <span className="badge bg-warning text-dark ms-2">
                                Editing item #{editIndex + 1}
                              </span>
                            )}
                          </Form.Label>
                          <div className="d-flex gap-2">
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="description"
                              value={photoForm.description}
                              onChange={handlePhotoChange}
                              placeholder="Type photo requirement description"
                            />
                          </div>
                        </Form.Group>
                      </Card.Body>
                    </Card>

                    {photoItems.length > 0 && (
                      <Card>
                        <Card.Body>
                          <Table striped bordered hover size="sm">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Description</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {photoItems.map((item, idx) => (
                                <tr key={idx} className={editingType === 'photo' && editIndex === idx ? 'table-warning' : ''}>
                                  <td>{idx + 1}</td>
                                  <td>{item.description || '-'}</td>
                                  <td>
                                    <div className="d-flex gap-1">
                                      <Button
                                        variant={editingType === 'photo' && editIndex === idx ? "warning" : "outline-warning"}
                                        size="sm"
                                        onClick={() => editPhoto(idx)}
                                        title="Edit"
                                      >
                                        <Pencil size={14} />
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removePhoto(idx)}
                                        title="Remove"
                                      >
                                        <Trash size={14} />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    )}
                  </Tab>

                  {/* Subtab 6: Visa Fees */}
                  <Tab eventKey="fees" title="Visa Fees">
                    <div className="mb-3">
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        onClick={addVisaFeesRow}
                      >
                        + Add Free Flow Entry
                      </Button>
                    </div>
                    
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Tourist Visa</th>
                          <th>Tourist Visa Charges</th>
                          <th>Transit Visa</th>
                          <th>Transit Visa Charges</th>
                          <th>Business Visa</th>
                          <th>Business Visa Charges</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visaFeesRows.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.tourist}
                                onChange={(e) => handleVisaFeesChange(row.id, 'tourist', e.target.value)}
                                placeholder="Free flow entry"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.tourist_charges}
                                onChange={(e) => handleVisaFeesChange(row.id, 'tourist_charges', e.target.value)}
                                placeholder="Charges for Tourist"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.transit}
                                onChange={(e) => handleVisaFeesChange(row.id, 'transit', e.target.value)}
                                placeholder="Free flow entry"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.transit_charges}
                                onChange={(e) => handleVisaFeesChange(row.id, 'transit_charges', e.target.value)}
                                placeholder="Charges for Transit"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.business}
                                onChange={(e) => handleVisaFeesChange(row.id, 'business', e.target.value)}
                                placeholder="Free flow entry"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.business_charges}
                                onChange={(e) => handleVisaFeesChange(row.id, 'business_charges', e.target.value)}
                                placeholder="Charges for Business"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeVisaFeesRow(row.id)}
                                title="Remove"
                                disabled={row.id <= 3}
                              >
                                <Trash size={14} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>

                  {/* Subtab 7: Submission & Pick Up */}
                  <Tab eventKey="submission" title="Submission & Pick Up">
                    <div className="mb-3">
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        onClick={addSubmissionRow}
                      >
                        + Add Free Flow Entry
                      </Button>
                    </div>
                    
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th width="25%">Item</th>
                          <th width="25%">Tourist Visa</th>
                          <th width="25%">Transit Visa</th>
                          <th width="25%">Business Visa</th>
                          <th width="5%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissionRows.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.label}
                                onChange={(e) => handleSubmissionLabelChange(row.id, e.target.value)}
                                placeholder="Enter item label"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.tourist}
                                onChange={(e) => handleSubmissionValueChange(row.id, 'tourist', e.target.value)}
                                placeholder="Free flow alphanumeric"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.transit}
                                onChange={(e) => handleSubmissionValueChange(row.id, 'transit', e.target.value)}
                                placeholder="Free flow alphanumeric"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                value={row.business}
                                onChange={(e) => handleSubmissionValueChange(row.id, 'business', e.target.value)}
                                placeholder="Free flow alphanumeric"
                                size="sm"
                              />
                            </td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeSubmissionRow(row.id)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>
                </Tabs>
              </Tab>

              {/* ====== BOOKING POI TAB ====== */}
              <Tab eventKey="bookingPoi" title="Booking POI">
                <Form.Group className="mb-3">
                  <Row>
                    <Col md={8}>
                      <Form.Label>Booking Policy</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={poiText}
                        onChange={(e) => setPoiText(e.target.value)}
                        placeholder="Type booking policy here"
                      />
                    </Col>

                    <Col md={4}>
                      <Form.Label>Amount Details</Form.Label>
                      <Form.Control
                        type="text"
                        value={poiAmount}
                        onChange={(e) => setPoiAmount(e.target.value)}
                        placeholder="Enter amount details"
                      />
                    </Col>
                  </Row>

                  <Form.Group className="mt-3">
                    <OptionTabs
                      activeOption={bookingPoiRemarksActiveOption}
                      onOptionChange={handleBookingPoiRemarksActiveChange}
                      option1Value={bookingPoiRemarksOption1}
                      option2Value={bookingPoiRemarksOption2}
                      onOption1Change={(val) => handleBookingPoiRemarksOptionChange('option1', val)}
                      onOption2Change={(val) => handleBookingPoiRemarksOptionChange('option2', val)}
                      placeholder="Enter booking policy remarks for Option 1"
                      label="Booking Policy Remarks"
                    />
                  </Form.Group>
                </Form.Group>

                {bookingPois.length > 0 && (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Amount Details</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingPois.map((p, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td style={{ whiteSpace: 'pre-line' }}>{p.item}</td>
                          <td>{p.amount_details}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editPoi(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removePoi(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== CANCELLATION POLICY TAB ====== */}
              <Tab eventKey="cancellation" title="Cancellation Policy">
                <Row>
                  <Col md={8}>
                    <Form.Label>Cancellation Policy</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="cancellation_policy"
                      value={cancelItem.cancellation_policy}
                      onChange={handleCancelChange}
                      placeholder="Type cancellation policy here"
                      style={{ whiteSpace: 'pre-line' }}
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label>Charges</Form.Label>
                    <Form.Control
                      type="text"
                      name="charges"
                      value={cancelItem.charges}
                      onChange={handleCancelChange}
                      placeholder="Example: No refund / 50% retained"
                    />
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <OptionTabs
                    activeOption={cancellationRemarksActiveOption}
                    onOptionChange={handleCancellationRemarksActiveChange}
                    option1Value={cancellationRemarksOption1}
                    option2Value={cancellationRemarksOption2}
                    onOption1Change={(val) => handleCancellationRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleCancellationRemarksOptionChange('option2', val)}
                    placeholder="Enter cancellation remarks for Option 1"
                    label="Cancellation Remarks"
                  />
                </Form.Group>

                {cancelPolicies.length > 0 && (
                  <Table striped bordered hover className="mt-3" size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cancellation Policy</th>
                        <th>Charges</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cancelPolicies.map((c, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td style={{ whiteSpace: 'pre-line', maxWidth: '400px' }}>
                            <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                              {c.cancellation_policy}
                            </div>
                           </td>
                          <td>{c.charges || "-"}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editCancelRow(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeCancelRow(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== INSTRUCTIONS TAB ====== */}
              <Tab eventKey="instructions" title="Instructions">
                <Form.Group className="mb-3">
                  <OptionTabs
                    activeOption={instructionActiveOption}
                    onOptionChange={setInstructionActiveOption}
                    option1Value={instructionOption1}
                    option2Value={instructionOption2}
                    onOption1Change={(val) => handleInstructionOptionChange('option1', val)}
                    onOption2Change={(val) => handleInstructionOptionChange('option2', val)}
                    placeholder="Enter instruction for Option 1"
                    label="Instruction"
                  />
                </Form.Group>

                {instructions.length > 0 && (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Instruction</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructions.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editInstruction(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeInstruction(idx)}
                                title="Remove"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== IMAGES TAB ====== */}
              <Tab eventKey="images" title="Images">
                <Card className="mb-4">
                  <Card.Header>Add New Images</Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Upload New Images</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                      />
                      <Form.Text className="text-muted">
                        You can select multiple images (JPEG, PNG, WebP). Max 5MB per image.
                      </Form.Text>
                    </Form.Group>
                    
                    {imagePreviews.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-2">
                          <strong>{imagePreviews.length} new image(s) ready to upload:</strong>
                        </p>
                        <Row>
                          {imageFiles.map((file, idx) => (
                            <Col md={3} key={idx} className="mb-3">
                              <div className="position-relative">
                                <img
                                  src={imagePreviews[idx]}
                                  alt={`new-${idx}`}
                                  style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                  }}
                                />
                                <div className="position-absolute top-0 end-0 bg-dark bg-opacity-50 text-white p-1 rounded">
                                  {file.name}
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>Existing Images</Card.Header>
                  <Card.Body>
                    {existingImages.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted">No images uploaded yet.</p>
                      </div>
                    ) : (
                      <Row>
                        {existingImages.map((image) => (
                          <Col md={4} lg={3} key={image.image_id} className="mb-4">
                            <Card className="h-100">
                              <Card.Body className="p-2">
                                <div className="position-relative">
                                  <img
                                    src={image.url}
                                    alt={`tour-image-${image.image_id}`}
                                    style={{
                                      width: '100%',
                                      height: '150px',
                                      objectFit: 'cover',
                                      borderRadius: '6px'
                                    }}
                                    className="mb-2"
                                  />
                                  
                                  {image.is_cover === 1 && (
                                    <div className="position-absolute top-0 start-0 bg-warning text-dark px-2 py-1 rounded-end">
                                      <strong>★ Cover</strong>
                                    </div>
                                  )}
                                  
                                  {editingImageId === image.image_id ? (
                                    <div className="mt-3 border p-3 rounded">
                                      <Form.Group>
                                        <Form.Label>Replace with new image:</Form.Label>
                                        <Form.Control
                                          id="replacementFileInput"
                                          type="file"
                                          onChange={handleReplacementFileChange}
                                          accept="image/jpeg,image/jpg,image/png,image/webp"
                                        />
                                      </Form.Group>
                                      
                                      {replacementPreview && (
                                        <div className="mt-2">
                                          <p><strong>New preview:</strong></p>
                                          <img
                                            src={replacementPreview}
                                            alt="replacement"
                                            style={{
                                              width: '100%',
                                              height: '100px',
                                              objectFit: 'cover',
                                              borderRadius: '4px'
                                            }}
                                          />
                                        </div>
                                      )}
                                      
                                      <div className="d-flex gap-2 mt-3">
                                        <Button
                                          variant="success"
                                          size="sm"
                                          onClick={() => updateImage(image.image_id)}
                                          disabled={!replacementFile || loading}
                                        >
                                          {loading ? 'Updating...' : 'Update'}
                                        </Button>
                                        <Button
                                          variant="outline-secondary"
                                          size="sm"
                                          onClick={cancelEditImage}
                                          disabled={loading}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mt-2">
                                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                                        {image.is_cover === 0 && (
                                          <Button
                                            variant="outline-warning"
                                            size="sm"
                                            onClick={() => setCoverImage(image.image_id)}
                                            title="Set as Cover"
                                            disabled={loading}
                                          >
                                            ★ Set Cover
                                          </Button>
                                        )}
                                        
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          onClick={() => startEditImage(image)}
                                          title="Replace Image"
                                          disabled={loading}
                                        >
                                          <Pencil size={14} /> Replace
                                        </Button>
                                        
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => deleteImage(image.image_id)}
                                          title="Delete Image"
                                          disabled={loading}
                                        >
                                          <Trash size={14} />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Card.Body>
                              <Card.Footer className="bg-transparent border-0 pt-0">
                                <small className="text-muted">
                                  {image.caption ? `Caption: ${image.caption}` : 'No caption'}
                                </small>
                              </Card.Footer>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                    
                    {existingImages.length > 0 && (
                      <div className="mt-3 text-center">
                        <p className="text-muted">
                          Total images: {existingImages.length} | 
                          Cover image: {existingImages.find(img => img.is_cover === 1) ? 'Set' : 'Not set'}
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default INTLAddTour;