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
  InputGroup
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import { Pencil, Trash } from 'react-bootstrap-icons';

// ======================
// OPTIONTABS – moved outside component to avoid losing input focus
// ======================
const OptionTabs = ({
  activeOption,
  onOptionChange,
  option1Value,
  option2Value,
  onOption1Change,
  onOption2Change,
  placeholder
}) => (
  <div>
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
          placeholder={placeholder || "Enter content for Option 1"}
        />
      </Tab>
      <Tab eventKey="option2" title="Option 2">
        <Form.Control
          as="textarea"
          rows={3}
          value={option2Value}
          onChange={(e) => onOption2Change(e.target.value)}
          placeholder={placeholder || "Enter content for Option 2"}
        />
      </Tab>
    </Tabs>
  </div>
);

const AddSeniorTour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // TAB ORDER MUST MATCH JSX ORDER
  const TAB_LIST = [
    'basic',
    'itineraries',
    'departures',
    'optionalTours',
    'emiOptions',
    'inclusions',
    'exclusions',
    'flights',
    'hotels',
    'bookingPoi',
    'cancellation',
    'instructions',
    'images'
  ];

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ========================
  // STATE FOR OPTION TABS (Option 1 / Option 2) - SENIOR TOUR
  // ========================
  
  // For Cost Remarks
  const [costRemarksActiveOption, setCostRemarksActiveOption] = useState('option1');
  const [costRemarksOption1, setCostRemarksOption1] = useState('');
  const [costRemarksOption2, setCostRemarksOption2] = useState('');
  
  // For Hotel Remarks
  const [hotelRemarksActiveOption, setHotelRemarksActiveOption] = useState('option1');
  const [hotelRemarksOption1, setHotelRemarksOption1] = useState('');
  const [hotelRemarksOption2, setHotelRemarksOption2] = useState('');
  
  // For Flight Remarks
  const [flightRemarksActiveOption, setFlightRemarksActiveOption] = useState('option1');
  const [flightRemarksOption1, setFlightRemarksOption1] = useState('');
  const [flightRemarksOption2, setFlightRemarksOption2] = useState('');
  
  // For Booking Policy Remarks
  const [bookingPoiRemarksActiveOption, setBookingPoiRemarksActiveOption] = useState('option1');
  const [bookingPoiRemarksOption1, setBookingPoiRemarksOption1] = useState('');
  const [bookingPoiRemarksOption2, setBookingPoiRemarksOption2] = useState('');
  
  // For Cancellation Remarks
  const [cancellationRemarksActiveOption, setCancellationRemarksActiveOption] = useState('option1');
  const [cancellationRemarksOption1, setCancellationRemarksOption1] = useState('');
  const [cancellationRemarksOption2, setCancellationRemarksOption2] = useState('');
  
  // For EMI Remarks
  const [emiRemarksActiveOption, setEmiRemarksActiveOption] = useState('option1');
  const [emiRemarksOption1, setEmiRemarksOption1] = useState('');
  const [emiRemarksOption2, setEmiRemarksOption2] = useState('');
  
  // For Optional Tour Remarks
  const [optionalTourRemarksActiveOption, setOptionalTourRemarksActiveOption] = useState('option1');
  const [optionalTourRemarksOption1, setOptionalTourRemarksOption1] = useState('');
  const [optionalTourRemarksOption2, setOptionalTourRemarksOption2] = useState('');
  
  // For Instructions
  const [instructionActiveOption, setInstructionActiveOption] = useState('option1');
  const [instructionOption1, setInstructionOption1] = useState('');
  const [instructionOption2, setInstructionOption2] = useState('');

  // Dropdowns
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  // Add these state variables near your other state declarations
  const [editingItineraryIndex, setEditingItineraryIndex] = useState(-1);
  const [editingDepartureIndex, setEditingDepartureIndex] = useState(-1);
  const [editingOptionalTourIndex, setEditingOptionalTourIndex] = useState(-1);
  const [editingInclusionIndex, setEditingInclusionIndex] = useState(-1);
  const [editingExclusionIndex, setEditingExclusionIndex] = useState(-1);
  const [editingTransportIndex, setEditingTransportIndex] = useState(-1);
  const [editingBookingPoiIndex, setEditingBookingPoiIndex] = useState(-1);
  const [editingCancellationIndex, setEditingCancellationIndex] = useState(-1);
  const [editingInstructionIndex, setEditingInstructionIndex] = useState(-1);

  // BASIC DETAILS
  const [formData, setFormData] = useState({
    tour_code: '',
    tour_type: "seniorcitizen",
    title: '',
    category_id: 1,
    primary_destination_id: '',
    duration_days: '',
    overview: '',
    base_price_adult: '',
    emi_price: '',
    is_international: 0,
    cost_remarks: "",
    cost_remarks_option1: "",
    cost_remarks_option2: "",
    hotel_remarks: "",
    hotel_remarks_option1: "",
    hotel_remarks_option2: "",
    transport_remarks: "",
    transport_remarks_option1: "",
    transport_remarks_option2: "",
    booking_poi_remarks: "",
    booking_poi_remarks_option1: "",
    booking_poi_remarks_option2: "",
    cancellation_remarks: "",
    cancellation_remarks_option1: "",
    cancellation_remarks_option2: "",
    emi_remarks: "",
    emi_remarks_option1: "",
    emi_remarks_option2: "",
    optional_tour_remarks: "",
    optional_tour_remarks_option1: "",
    optional_tour_remarks_option2: "",
    instruction_description: "",
    instruction_description_option1: "",
    instruction_description_option2: ""
  });

  // =======================
  // DEPARTURES FOR SENIOR CITIZEN TOURS
  // =======================
  const [seniorDepartureForm, setSeniorDepartureForm] = useState({
    start_date: '',
    end_date: '',
    status: 'Available',
    total_seats: 40,
    booked_seats: 0,
    description: '',
    three_star_twin: '',
    three_star_triple: '',
    three_star_child_with_bed: '',
    three_star_child_without_bed: '',
    three_star_infant: '',
    three_star_single: '',
    four_star_twin: '',
    four_star_triple: '',
    four_star_child_with_bed: '',
    four_star_child_without_bed: '',
    four_star_infant: '',
    four_star_single: '',
    five_star_twin: '',
    five_star_triple: '',
    five_star_child_with_bed: '',
    five_star_child_without_bed: '',
    five_star_infant: '',
    five_star_single: ''
  });

  const [departures, setDepartures] = useState([]);

  // EXCLUSIONS
  const [exclusionText, setExclusionText] = useState('');
  const [exclusions, setExclusions] = useState([]);

  // INCLUSIONS
  const [inclusionText, setInclusionText] = useState('');
  const [inclusions, setInclusions] = useState([]);

  // IMAGES
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageCaption, setImageCaption] = useState('');

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);

  // =======================
  // OPTIONAL TOURS
  // =======================
  const [optionalTourItem, setOptionalTourItem] = useState({
    tour_name: '',
    adult_price: '',
    child_price: ''
  });
  const [optionalTours, setOptionalTours] = useState([]);

  const handleOptionalTourChange = (e) => {
    const { name, value } = e.target;
    setOptionalTourItem(prev => ({ ...prev, [name]: value }));
  };

  const addOptionalTourRow = () => {
    if (!optionalTourItem.tour_name.trim()) return;

    const processedItem = {
      ...optionalTourItem,
      optional_remarks: optionalTourRemarksActiveOption === 'option1' ? optionalTourRemarksOption1 : optionalTourRemarksOption2,
      optional_remarks_option1: optionalTourRemarksOption1,
      optional_remarks_option2: optionalTourRemarksOption2,
      optional_remarks_active: optionalTourRemarksActiveOption
    };

    if (editingOptionalTourIndex !== -1) {
      const updated = [...optionalTours];
      updated[editingOptionalTourIndex] = processedItem;
      setOptionalTours(updated);
      setEditingOptionalTourIndex(-1);
    } else {
      setOptionalTours(prev => [...prev, processedItem]);
    }

    setOptionalTourItem({
      tour_name: '',
      adult_price: '',
      child_price: ''
    });
  };

  const editOptionalTourRow = (idx) => {
    const item = optionalTours[idx];
    setOptionalTourItem({
      tour_name: item.tour_name,
      adult_price: item.adult_price,
      child_price: item.child_price
    });
    setEditingOptionalTourIndex(idx);
  };

  const removeOptionalTourRow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this optional tour?');
    if (confirmDelete) {
      setOptionalTours(prev => prev.filter((_, i) => i !== idx));
      if (editingOptionalTourIndex === idx) {
        setEditingOptionalTourIndex(-1);
        setOptionalTourItem({
          tour_name: '',
          adult_price: '',
          child_price: ''
        });
      }
    }
  };

  // =======================
  // EMI OPTIONS
  // =======================
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

  // ========================
  // STATIC CONTENT PREFILL FOR NEW TOUR
  // ========================
  useEffect(() => {
    if (!isEditMode) {
      // Cost Remarks
      setCostRemarksOption1("Please note that while the tour price has been indicated, it may vary if you choose dates closer to departure or during periods when the season transitions from low to high. We therefore kindly request you to confirm the final tour price before proceeding with your booking and to mention the tour code when inquiring to receive the exact cost. Child pricing is calculated based on the standard hotel category, and if you choose Deluxe or Executive accommodations, child rates may be adjusted accordingly.");
      setCostRemarksOption2("Premium package includes all taxes and surcharges. Price guaranteed for next 30 days. Early bird discount available for bookings made 60 days in advance. Group discount applicable for 10+ persons. Customized itineraries available on request.");
      
      // Hotel Remarks
      setHotelRemarksOption1("Hotel categories are subject to availability. Standard, Deluxe, and Executive categories based on room types and amenities. Early check-in subject to availability. Check-out time 10 AM.");
      setHotelRemarksOption2("Premium hotel collection with guaranteed upgrades. Welcome drinks and late checkout included. Complimentary breakfast and airport transfers. Best rate guarantee. 24/7 concierge service available.");
      
      // Flight Remarks
      setFlightRemarksOption1("Flight prices are indicative and subject to change at the time of booking. Airline and timing subject to availability. Baggage allowance as per airline policy. Meals included as per airline standards.");
      setFlightRemarksOption2("Guaranteed lowest airfare. Flexible cancellation up to 24 hours. Priority boarding and extra baggage included. Seat selection available complimentary. Lounge access at major airports.");
      
      // Booking Policy Remarks
      setBookingPoiRemarksOption1("Booking amount is non-refundable. Balance payment to be made as per the payment schedule. 50% payment required 30 days before departure. 100% payment required 15 days before departure.");
      setBookingPoiRemarksOption2("Flexible booking policy with free cancellation up to 15 days. Pay only 10% to book. Zero cancellation charges for COVID-related issues. Easy payment plans available.");
      
      // Cancellation Remarks
      setCancellationRemarksOption1("Cancellation charges apply as per the policy mentioned above. No refunds for no-shows. 50% refund for cancellations made 30 days before departure. 25% refund for cancellations made 15 days before departure.");
      setCancellationRemarksOption2("Full refund for cancellations 45+ days before departure. 75% refund for 30-44 days. 50% refund for 15-29 days. Travel credit available instead of refund. Free date change once allowed.");
      
      // EMI Remarks
      setEmiRemarksOption1("EMI options available with 18% interest rate. Processing fee of 2% applicable. Terms and conditions apply. Credit cards from all major banks accepted. Minimum loan amount ₹10,000.");
      setEmiRemarksOption2("No cost EMI available on select credit cards. Zero processing fee for limited period. Flexible tenure up to 36 months. Contact bank for pre-approved offers. Instant approval available.");
      
      // Optional Tour Remarks
      setOptionalTourRemarksOption1("Optional tours are subject to availability and weather conditions. Prices are per person. Minimum 4 persons required for each optional tour. Book at least 2 days in advance. Cancellation 24 hours before for 50% refund.");
      setOptionalTourRemarksOption2("Exclusive optional tours with private guide. Flexible timing available. Includes lunch and entry fees. Priority access to attractions. Cancel 24 hours before for full refund. Customized private tours available.");
      
      // Instructions
      setInstructionOption1("Please carry valid ID proof. Reporting time is 2 hours before departure. Carry comfortable clothing and walking shoes. Follow the itinerary timings strictly. Carry necessary medications.");
      setInstructionOption2("Passport required for international travel. Visa assistance available. Travel insurance is mandatory. Medical fitness certificate required for adventure activities. Emergency contact numbers provided.");
      
      // Set active options to option1 by default
      setCostRemarksActiveOption('option1');
      setHotelRemarksActiveOption('option1');
      setFlightRemarksActiveOption('option1');
      setBookingPoiRemarksActiveOption('option1');
      setCancellationRemarksActiveOption('option1');
      setEmiRemarksActiveOption('option1');
      setOptionalTourRemarksActiveOption('option1');
      setInstructionActiveOption('option1');
      
      setFormData(prev => ({
        ...prev,
        cost_remarks: "Please note that while the tour price has been indicated, it may vary if you choose dates closer to departure or during periods when the season transitions from low to high. We therefore kindly request you to confirm the final tour price before proceeding with your booking and to mention the tour code when inquiring to receive the exact cost. Child pricing is calculated based on the standard hotel category, and if you choose Deluxe or Executive accommodations, child rates may be adjusted accordingly.",
        cost_remarks_option1: "Please note that while the tour price has been indicated, it may vary if you choose dates closer to departure or during periods when the season transitions from low to high. We therefore kindly request you to confirm the final tour price before proceeding with your booking and to mention the tour code when inquiring to receive the exact cost. Child pricing is calculated based on the standard hotel category, and if you choose Deluxe or Executive accommodations, child rates may be adjusted accordingly.",
        cost_remarks_option2: "Premium package includes all taxes and surcharges. Price guaranteed for next 30 days. Early bird discount available for bookings made 60 days in advance. Group discount applicable for 10+ persons. Customized itineraries available on request.",
        hotel_remarks: "Hotel categories are subject to availability. Standard, Deluxe, and Executive categories based on room types and amenities. Early check-in subject to availability. Check-out time 10 AM.",
        hotel_remarks_option1: "Hotel categories are subject to availability. Standard, Deluxe, and Executive categories based on room types and amenities. Early check-in subject to availability. Check-out time 10 AM.",
        hotel_remarks_option2: "Premium hotel collection with guaranteed upgrades. Welcome drinks and late checkout included. Complimentary breakfast and airport transfers. Best rate guarantee. 24/7 concierge service available.",
        transport_remarks: "Flight prices are indicative and subject to change at the time of booking. Airline and timing subject to availability. Baggage allowance as per airline policy. Meals included as per airline standards.",
        transport_remarks_option1: "Flight prices are indicative and subject to change at the time of booking. Airline and timing subject to availability. Baggage allowance as per airline policy. Meals included as per airline standards.",
        transport_remarks_option2: "Guaranteed lowest airfare. Flexible cancellation up to 24 hours. Priority boarding and extra baggage included. Seat selection available complimentary. Lounge access at major airports.",
        booking_poi_remarks: "Booking amount is non-refundable. Balance payment to be made as per the payment schedule. 50% payment required 30 days before departure. 100% payment required 15 days before departure.",
        booking_poi_remarks_option1: "Booking amount is non-refundable. Balance payment to be made as per the payment schedule. 50% payment required 30 days before departure. 100% payment required 15 days before departure.",
        booking_poi_remarks_option2: "Flexible booking policy with free cancellation up to 15 days. Pay only 10% to book. Zero cancellation charges for COVID-related issues. Easy payment plans available.",
        cancellation_remarks: "Cancellation charges apply as per the policy mentioned above. No refunds for no-shows. 50% refund for cancellations made 30 days before departure. 25% refund for cancellations made 15 days before departure.",
        cancellation_remarks_option1: "Cancellation charges apply as per the policy mentioned above. No refunds for no-shows. 50% refund for cancellations made 30 days before departure. 25% refund for cancellations made 15 days before departure.",
        cancellation_remarks_option2: "Full refund for cancellations 45+ days before departure. 75% refund for 30-44 days. 50% refund for 15-29 days. Travel credit available instead of refund. Free date change once allowed.",
        emi_remarks: "EMI options available with 18% interest rate. Processing fee of 2% applicable. Terms and conditions apply. Credit cards from all major banks accepted. Minimum loan amount ₹10,000.",
        emi_remarks_option1: "EMI options available with 18% interest rate. Processing fee of 2% applicable. Terms and conditions apply. Credit cards from all major banks accepted. Minimum loan amount ₹10,000.",
        emi_remarks_option2: "No cost EMI available on select credit cards. Zero processing fee for limited period. Flexible tenure up to 36 months. Contact bank for pre-approved offers. Instant approval available.",
        optional_tour_remarks: "Optional tours are subject to availability and weather conditions. Prices are per person. Minimum 4 persons required for each optional tour. Book at least 2 days in advance. Cancellation 24 hours before for 50% refund.",
        optional_tour_remarks_option1: "Optional tours are subject to availability and weather conditions. Prices are per person. Minimum 4 persons required for each optional tour. Book at least 2 days in advance. Cancellation 24 hours before for 50% refund.",
        optional_tour_remarks_option2: "Exclusive optional tours with private guide. Flexible timing available. Includes lunch and entry fees. Priority access to attractions. Cancel 24 hours before for full refund. Customized private tours available.",
        instruction_description: "Please carry valid ID proof. Reporting time is 2 hours before departure. Carry comfortable clothing and walking shoes. Follow the itinerary timings strictly. Carry necessary medications.",
        instruction_description_option1: "Please carry valid ID proof. Reporting time is 2 hours before departure. Carry comfortable clothing and walking shoes. Follow the itinerary timings strictly. Carry necessary medications.",
        instruction_description_option2: "Passport required for international travel. Visa assistance available. Travel insurance is mandatory. Medical fitness certificate required for adventure activities. Emergency contact numbers provided."
      }));

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

  // =======================
  // HOTELS
  // =======================
  const [hotelItem, setHotelItem] = useState({
    city: '',
    nights: '',
    standard_hotel_name: '', 
    deluxe_hotel_name: '',   
    executive_hotel_name: '',
    remarks: ''
  });
  const [hotelRows, setHotelRows] = useState([]);

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelItem(prev => ({ ...prev, [name]: value }));
  };

  const addHotelRow = () => {
    if (!hotelItem.city.trim() || 
        (!hotelItem.standard_hotel_name.trim() && 
         !hotelItem.deluxe_hotel_name.trim() && 
         !hotelItem.executive_hotel_name.trim())) {
      setError('Please enter city and at least one hotel name');
      return;
    }
    
    const newItem = {
      ...hotelItem,
      hotel_remarks: hotelRemarksActiveOption === 'option1' ? hotelRemarksOption1 : hotelRemarksOption2,
      hotel_remarks_option1: hotelRemarksOption1,
      hotel_remarks_option2: hotelRemarksOption2,
      hotel_remarks_active: hotelRemarksActiveOption
    };
    
    if (editingType === 'hotel' && editIndex !== -1) {
      const updated = [...hotelRows];
      updated[editIndex] = newItem;
      setHotelRows(updated);
    } else {
      setHotelRows(prev => [...prev, newItem]);
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

  const editHotelRow = (idx) => {
    const item = hotelRows[idx];
    setHotelItem({
      city: item.city || '',
      nights: item.nights || '',
      standard_hotel_name: item.standard_hotel_name || '',
      deluxe_hotel_name: item.deluxe_hotel_name || '',
      executive_hotel_name: item.executive_hotel_name || '',
      remarks: item.remarks || ''
    });
    setEditingItem(item);
    setEditingType('hotel');
    setEditIndex(idx);
  };

  const removeHotelRow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this hotel?');
    if (confirmDelete) {
      setHotelRows(prev => prev.filter((_, i) => i !== idx));
      if (editIndex === idx) {
        resetEditing();
      }
    }
  };

  const resetEditing = () => {
    setEditingItem(null);
    setEditingType('');
    setEditIndex(-1);
  };

  // =======================
  // TRANSPORT FOR SENIOR TOURS
  // =======================
  const [transports, setTransports] = useState([]);
  const [transportItem, setTransportItem] = useState({
    description: '',
    airline: '',
    flight_no: '',
    from_city: '',
    from_date: '',
    from_time: '',
    to_city: '',
    to_date: '',
    to_time: '',
    via: '',
    sort_order: 1
  });

  const handleTransportChange = (e) => {
    const { name, value } = e.target;
    setTransportItem(prev => ({ ...prev, [name]: value }));
  };

  const addTransportRow = () => {
    if (!transportItem.airline || !transportItem.flight_no || !transportItem.from_city || !transportItem.to_city) {
      setError('Please fill in airline, flight number, from city, and to city');
      return;
    }

    const newItem = {
      ...transportItem,
      flight_remarks: flightRemarksActiveOption === 'option1' ? flightRemarksOption1 : flightRemarksOption2,
      flight_remarks_option1: flightRemarksOption1,
      flight_remarks_option2: flightRemarksOption2,
      flight_remarks_active: flightRemarksActiveOption
    };

    if (editingTransportIndex !== -1) {
      const updated = [...transports];
      updated[editingTransportIndex] = { ...newItem, sort_order: transports[editingTransportIndex].sort_order };
      setTransports(updated);
      setEditingTransportIndex(-1);
    } else {
      setTransports(prev => [...prev, { ...newItem, sort_order: prev.length + 1 }]);
    }

    setTransportItem({
      description: '',
      airline: '',
      flight_no: '',
      from_city: '',
      from_date: '',
      from_time: '',
      to_city: '',
      to_date: '',
      to_time: '',
      via: '',
      sort_order: transports.length + 2
    });
  };

  const editTransportRow = (idx) => {
    const item = transports[idx];
    setTransportItem({
      description: item.description || '',
      airline: item.airline || '',
      flight_no: item.flight_no || '',
      from_city: item.from_city || '',
      from_date: item.from_date || '',
      from_time: item.from_time || '',
      to_city: item.to_city || '',
      to_date: item.to_date || '',
      to_time: item.to_time || '',
      via: item.via || '',
      sort_order: item.sort_order || idx + 1
    });
    setEditingTransportIndex(idx);
  };

  const removeTransportRow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this transport?');
    if (confirmDelete) {
      setTransports(prev => prev.filter((_, i) => i !== idx));
      if (editingTransportIndex === idx) {
        setEditingTransportIndex(-1);
        setTransportItem({
          description: '',
          airline: '',
          flight_no: '',
          from_city: '',
          from_date: '',
          from_time: '',
          to_city: '',
          to_date: '',
          to_time: '',
          via: '',
          sort_order: transports.length + 1
        });
      }
    }
  };

  // =======================
  // BOOKING POI
  // =======================
  const [poiText, setPoiText] = useState('');
  const [poiAmount, setPoiAmount] = useState("");
  const [bookingPois, setBookingPois] = useState([]);

  const addPoi = () => {
    const txt = poiText.trim();
    if (!txt) return;
    
    const newPoi = { 
      item: poiText, 
      amount_details: poiAmount,
      booking_remarks: bookingPoiRemarksActiveOption === 'option1' ? bookingPoiRemarksOption1 : bookingPoiRemarksOption2,
      booking_remarks_option1: bookingPoiRemarksOption1,
      booking_remarks_option2: bookingPoiRemarksOption2,
      booking_remarks_active: bookingPoiRemarksActiveOption,
      sort_order: bookingPois.length + 1 
    };
    
    if (editingBookingPoiIndex !== -1) {
      const updated = [...bookingPois];
      updated[editingBookingPoiIndex] = { ...newPoi, sort_order: bookingPois[editingBookingPoiIndex].sort_order };
      setBookingPois(updated);
      setEditingBookingPoiIndex(-1);
    } else {
      setBookingPois([...bookingPois, newPoi]);
    }
    
    setPoiText('');
    setPoiAmount("");
  };

  const editPoi = (idx) => {
    const poi = bookingPois[idx];
    setPoiText(poi.item);
    setPoiAmount(poi.amount_details || "");
    setEditingBookingPoiIndex(idx);
  };

  const removePoi = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this booking POI?');
    if (confirmDelete) {
      setBookingPois(prev => prev.filter((_, i) => i !== idx));
      if (editingBookingPoiIndex === idx) {
        setEditingBookingPoiIndex(-1);
        setPoiText('');
        setPoiAmount("");
      }
    }
  };

  // =======================
  // CANCELLATION
  // =======================
  const [cancelItem, setCancelItem] = useState({
    cancellation_policy: "",
    charges: "",
    sort_order: 1
  });

  const [cancelPolicies, setCancelPolicies] = useState([]);

  const handleCancelChange = (e) => {
    const { name, value } = e.target;
    setCancelItem(prev => ({ ...prev, [name]: value }));
  };

  const addCancelRow = () => {
    if (!cancelItem.cancellation_policy.trim()) return;
    
    const newCancel = { 
      ...cancelItem,
      cancellation_remarks: cancellationRemarksActiveOption === 'option1' ? cancellationRemarksOption1 : cancellationRemarksOption2,
      cancellation_remarks_option1: cancellationRemarksOption1,
      cancellation_remarks_option2: cancellationRemarksOption2,
      cancellation_remarks_active: cancellationRemarksActiveOption,
      sort_order: cancelPolicies.length + 1 
    };
    
    if (editingCancellationIndex !== -1) {
      const updated = [...cancelPolicies];
      updated[editingCancellationIndex] = { ...newCancel, sort_order: cancelPolicies[editingCancellationIndex].sort_order };
      setCancelPolicies(updated);
      setEditingCancellationIndex(-1);
    } else {
      setCancelPolicies(prev => [...prev, newCancel]);
    }
    
    setCancelItem({ cancellation_policy: "", charges: "", sort_order: cancelPolicies.length + 2 });
  };

  const editCancelRow = (idx) => {
    const policy = cancelPolicies[idx];
    setCancelItem({
      cancellation_policy: policy.cancellation_policy,
      charges: policy.charges || "",
      sort_order: policy.sort_order || idx + 1
    });
    setEditingCancellationIndex(idx);
  };

  const removeCancelRow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this cancellation policy?');
    if (confirmDelete) {
      setCancelPolicies(prev => prev.filter((_, i) => i !== idx));
      if (editingCancellationIndex === idx) {
        setEditingCancellationIndex(-1);
        setCancelItem({ cancellation_policy: "", charges: "", sort_order: 1 });
      }
    }
  };

  // =======================
  // INSTRUCTIONS
  // =======================
  const [instructionText, setInstructionText] = useState('');
  const [instructions, setInstructions] = useState([]);

  const addInstruction = () => {
    const currentInstruction = instructionActiveOption === 'option1' ? instructionOption1 : instructionOption2;
    const txt = currentInstruction.trim();
    if (!txt) return;
    
    const instructionItem = {
      item: txt,
      item_option1: instructionOption1,
      item_option2: instructionOption2,
      item_active: instructionActiveOption
    };
    
    if (editingInstructionIndex !== -1) {
      const updated = [...instructions];
      updated[editingInstructionIndex] = instructionItem;
      setInstructions(updated);
      setEditingInstructionIndex(-1);
    } else {
      setInstructions(prev => [...prev, instructionItem]);
    }
    
    setInstructionText('');
  };

  const editInstruction = (idx) => {
    const instruction = instructions[idx];
    const instructionTextValue = typeof instruction === 'string' ? instruction : instruction.item;
    setInstructionText(instructionTextValue);
    setEditingInstructionIndex(idx);
  };

  const removeInstruction = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this instruction?');
    if (confirmDelete) {
      setInstructions(prev => prev.filter((_, i) => i !== idx));
      if (editingInstructionIndex === idx) {
        setEditingInstructionIndex(-1);
        setInstructionText('');
      }
    }
  };

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

  const editItinerary = (idx) => {
    const item = itineraries[idx];
    const mealsArray = item.meals ? item.meals.split(', ') : [];
    const meals = {
      breakfast: mealsArray.includes('Breakfast'),
      lunch: mealsArray.includes('Lunch'),
      dinner: mealsArray.includes('Dinner')
    };
    
    setItineraryItem({
      day: item.day,
      title: item.title,
      description: item.description || '',
      meals: meals
    });
    
    setEditingItineraryIndex(idx);
  };

  // Handlers for Option Tabs
  const handleCostRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setCostRemarksOption1(value);
      if (costRemarksActiveOption === 'option1') {
        setFormData(prev => ({ ...prev, cost_remarks: value }));
      }
    } else {
      setCostRemarksOption2(value);
      if (costRemarksActiveOption === 'option2') {
        setFormData(prev => ({ ...prev, cost_remarks: value }));
      }
    }
  };

  const handleCostRemarksActiveChange = (option) => {
    setCostRemarksActiveOption(option);
    const value = option === 'option1' ? costRemarksOption1 : costRemarksOption2;
    setFormData(prev => ({ ...prev, cost_remarks: value }));
  };

  const handleHotelRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setHotelRemarksOption1(value);
      if (hotelRemarksActiveOption === 'option1') {
        setFormData(prev => ({ ...prev, hotel_remarks: value }));
      }
    } else {
      setHotelRemarksOption2(value);
      if (hotelRemarksActiveOption === 'option2') {
        setFormData(prev => ({ ...prev, hotel_remarks: value }));
      }
    }
  };

  const handleHotelRemarksActiveChange = (option) => {
    setHotelRemarksActiveOption(option);
    const value = option === 'option1' ? hotelRemarksOption1 : hotelRemarksOption2;
    setFormData(prev => ({ ...prev, hotel_remarks: value }));
  };

  const handleFlightRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setFlightRemarksOption1(value);
      if (flightRemarksActiveOption === 'option1') {
        setFormData(prev => ({ ...prev, transport_remarks: value }));
      }
    } else {
      setFlightRemarksOption2(value);
      if (flightRemarksActiveOption === 'option2') {
        setFormData(prev => ({ ...prev, transport_remarks: value }));
      }
    }
  };

  const handleFlightRemarksActiveChange = (option) => {
    setFlightRemarksActiveOption(option);
    const value = option === 'option1' ? flightRemarksOption1 : flightRemarksOption2;
    setFormData(prev => ({ ...prev, transport_remarks: value }));
  };

  const handleBookingPoiRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setBookingPoiRemarksOption1(value);
      if (bookingPoiRemarksActiveOption === 'option1') {
        setFormData(prev => ({ ...prev, booking_poi_remarks: value }));
      }
    } else {
      setBookingPoiRemarksOption2(value);
      if (bookingPoiRemarksActiveOption === 'option2') {
        setFormData(prev => ({ ...prev, booking_poi_remarks: value }));
      }
    }
  };

  const handleBookingPoiRemarksActiveChange = (option) => {
    setBookingPoiRemarksActiveOption(option);
    const value = option === 'option1' ? bookingPoiRemarksOption1 : bookingPoiRemarksOption2;
    setFormData(prev => ({ ...prev, booking_poi_remarks: value }));
  };

  const handleCancellationRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setCancellationRemarksOption1(value);
      if (cancellationRemarksActiveOption === 'option1') {
        setFormData(prev => ({ ...prev, cancellation_remarks: value }));
      }
    } else {
      setCancellationRemarksOption2(value);
      if (cancellationRemarksActiveOption === 'option2') {
        setFormData(prev => ({ ...prev, cancellation_remarks: value }));
      }
    }
  };

  const handleCancellationRemarksActiveChange = (option) => {
    setCancellationRemarksActiveOption(option);
    const value = option === 'option1' ? cancellationRemarksOption1 : cancellationRemarksOption2;
    setFormData(prev => ({ ...prev, cancellation_remarks: value }));
  };

  const handleEmiRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setEmiRemarksOption1(value);
      if (emiRemarksActiveOption === 'option1') {
        setFormData(prev => ({ ...prev, emi_remarks: value }));
      }
    } else {
      setEmiRemarksOption2(value);
      if (emiRemarksActiveOption === 'option2') {
        setFormData(prev => ({ ...prev, emi_remarks: value }));
      }
    }
  };

  const handleEmiRemarksActiveChange = (option) => {
    setEmiRemarksActiveOption(option);
    const value = option === 'option1' ? emiRemarksOption1 : emiRemarksOption2;
    setFormData(prev => ({ ...prev, emi_remarks: value }));
  };

  const handleOptionalTourRemarksOptionChange = (option, value) => {
    if (option === 'option1') {
      setOptionalTourRemarksOption1(value);
      if (optionalTourRemarksActiveOption === 'option1') {
        setFormData(prev => ({ ...prev, optional_tour_remarks: value }));
      }
    } else {
      setOptionalTourRemarksOption2(value);
      if (optionalTourRemarksActiveOption === 'option2') {
        setFormData(prev => ({ ...prev, optional_tour_remarks: value }));
      }
    }
  };

  const handleOptionalTourRemarksActiveChange = (option) => {
    setOptionalTourRemarksActiveOption(option);
    const value = option === 'option1' ? optionalTourRemarksOption1 : optionalTourRemarksOption2;
    setFormData(prev => ({ ...prev, optional_tour_remarks: value }));
  };

  const handleInstructionOptionChange = (option, value) => {
    if (option === 'option1') {
      setInstructionOption1(value);
      if (instructionActiveOption === 'option1') {
        setFormData(prev => ({ ...prev, instruction_description: value }));
      }
    } else {
      setInstructionOption2(value);
      if (instructionActiveOption === 'option2') {
        setFormData(prev => ({ ...prev, instruction_description: value }));
      }
    }
  };

  const handleInstructionActiveChange = (option) => {
    setInstructionActiveOption(option);
    const value = option === 'option1' ? instructionOption1 : instructionOption2;
    setFormData(prev => ({ ...prev, instruction_description: value }));
  };

  // Fetch dropdowns and tour data
  useEffect(() => {
    const loadDropdownsAndTourCode = async () => {
      try {
        const catRes = await fetch(`${baseurl}/api/categories/all-tours`);
        const categoryData = await catRes.json();
        setCategories(Array.isArray(categoryData) ? categoryData : []);

        const destRes = await fetch(`${baseurl}/api/destinations`);
        const destData = await destRes.json();

        const domesticDestinations = Array.isArray(destData) 
          ? destData.filter(destination => destination.is_domestic == 1)
          : [];
        
        const sortedDestinations = domesticDestinations.sort((a, b) => {
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
          const tourCodeRes = await fetch(`${baseurl}/api/tours/next-tour-code?tour_type=senior`);
          if (tourCodeRes.ok) {
            const tourCodeData = await tourCodeRes.json();
            setFormData(prev => ({
              ...prev,
              tour_code: tourCodeData.next_tour_code
            }));
          }
        }
      } catch (err) {
        setError('Failed to load dropdown data');
      }
    };

    loadDropdownsAndTourCode();
  }, [id]);

  // Load tour data for editing
  const loadTourData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/tours/tour/full/seniorcitizen/${id}`);
      if (!response.ok) throw new Error('Failed to fetch tour data');
      
      const data = await response.json();
      
      if (data.success) {
        const basic = data.basic_details;
        
        // Load remarks with both options from child tables
        // 1. Cost Remarks
        let costRemarksValue = '';
        let costRemarksOpt1 = '';
        let costRemarksOpt2 = '';
        let costRemarksActive = 'option1';
        if (data.costs && data.costs.length > 0) {
          const firstCost = data.costs[0];
          costRemarksValue = firstCost.cost_remarks || '';
          costRemarksOpt1 = firstCost.cost_remarks_option1 || '';
          costRemarksOpt2 = firstCost.cost_remarks_option2 || '';
          costRemarksActive = firstCost.cost_remarks_active || 'option1';
        }
        
        // 2. Hotel Remarks
        let hotelRemarksValue = '';
        let hotelRemarksOpt1 = '';
        let hotelRemarksOpt2 = '';
        let hotelRemarksActive = 'option1';
        if (data.hotels && data.hotels.length > 0) {
          const firstHotel = data.hotels[0];
          hotelRemarksValue = firstHotel.hotel_remarks || '';
          hotelRemarksOpt1 = firstHotel.hotel_remarks_option1 || '';
          hotelRemarksOpt2 = firstHotel.hotel_remarks_option2 || '';
          hotelRemarksActive = firstHotel.hotel_remarks_active || 'option1';
        }
        
        // 3. Transport/Flight Remarks
        let transportRemarksValue = '';
        let transportRemarksOpt1 = '';
        let transportRemarksOpt2 = '';
        let transportRemarksActive = 'option1';
        if (data.transport && data.transport.length > 0) {
          const firstTransport = data.transport[0];
          transportRemarksValue = firstTransport.flight_remarks || '';
          transportRemarksOpt1 = firstTransport.flight_remarks_option1 || '';
          transportRemarksOpt2 = firstTransport.flight_remarks_option2 || '';
          transportRemarksActive = firstTransport.flight_remarks_active || 'option1';
        }
        
        // 4. Booking POI Remarks
        let bookingRemarksValue = '';
        let bookingRemarksOpt1 = '';
        let bookingRemarksOpt2 = '';
        let bookingRemarksActive = 'option1';
        if (data.booking_poi && data.booking_poi.length > 0) {
          const firstPoi = data.booking_poi[0];
          bookingRemarksValue = firstPoi.booking_remarks || '';
          bookingRemarksOpt1 = firstPoi.booking_remarks_option1 || '';
          bookingRemarksOpt2 = firstPoi.booking_remarks_option2 || '';
          bookingRemarksActive = firstPoi.booking_remarks_active || 'option1';
        }
        
        // 5. Cancellation Remarks
        let cancellationRemarksValue = '';
        let cancellationRemarksOpt1 = '';
        let cancellationRemarksOpt2 = '';
        let cancellationRemarksActive = 'option1';
        if (data.cancellation_policies && data.cancellation_policies.length > 0) {
          const firstPolicy = data.cancellation_policies[0];
          cancellationRemarksValue = firstPolicy.cancellation_remarks || '';
          cancellationRemarksOpt1 = firstPolicy.cancellation_remarks_option1 || '';
          cancellationRemarksOpt2 = firstPolicy.cancellation_remarks_option2 || '';
          cancellationRemarksActive = firstPolicy.cancellation_remarks_active || 'option1';
        }
        
        // 6. Optional Tour Remarks
        let optionalRemarksValue = '';
        let optionalRemarksOpt1 = '';
        let optionalRemarksOpt2 = '';
        let optionalRemarksActive = 'option1';
        if (data.optional_tours && data.optional_tours.length > 0) {
          const firstOptional = data.optional_tours[0];
          optionalRemarksValue = firstOptional.optional_remarks || '';
          optionalRemarksOpt1 = firstOptional.optional_remarks_option1 || '';
          optionalRemarksOpt2 = firstOptional.optional_remarks_option2 || '';
          optionalRemarksActive = firstOptional.optional_remarks_active || 'option1';
        }
        
        // 7. EMI Remarks
        let emiRemarksValue = '';
        let emiRemarksOpt1 = '';
        let emiRemarksOpt2 = '';
        let emiRemarksActive = 'option1';
        if (data.emi_options && data.emi_options.length > 0) {
          const firstEmi = data.emi_options[0];
          emiRemarksValue = firstEmi.emi_remarks || '';
          emiRemarksOpt1 = firstEmi.emi_remarks_option1 || '';
          emiRemarksOpt2 = firstEmi.emi_remarks_option2 || '';
          emiRemarksActive = firstEmi.emi_remarks_active || 'option1';
        }
        
        // 8. Instructions
        let instructionDescValue = '';
        let instructionDescOpt1 = '';
        let instructionDescOpt2 = '';
        let instructionDescActive = 'option1';
        if (data.instructions && data.instructions.length > 0) {
          const firstInstruction = data.instructions[0];
          instructionDescValue = firstInstruction.item || '';
          instructionDescOpt1 = firstInstruction.item_option1 || '';
          instructionDescOpt2 = firstInstruction.item_option2 || '';
          instructionDescActive = firstInstruction.item_active || 'option1';
        }
        
        // Set state with both options
        setCostRemarksOption1(costRemarksOpt1 || costRemarksValue);
        setCostRemarksOption2(costRemarksOpt2 || costRemarksValue);
        setCostRemarksActiveOption(costRemarksActive);
        
        setHotelRemarksOption1(hotelRemarksOpt1 || hotelRemarksValue);
        setHotelRemarksOption2(hotelRemarksOpt2 || hotelRemarksValue);
        setHotelRemarksActiveOption(hotelRemarksActive);
        
        setFlightRemarksOption1(transportRemarksOpt1 || transportRemarksValue);
        setFlightRemarksOption2(transportRemarksOpt2 || transportRemarksValue);
        setFlightRemarksActiveOption(transportRemarksActive);
        
        setBookingPoiRemarksOption1(bookingRemarksOpt1 || bookingRemarksValue);
        setBookingPoiRemarksOption2(bookingRemarksOpt2 || bookingRemarksValue);
        setBookingPoiRemarksActiveOption(bookingRemarksActive);
        
        setCancellationRemarksOption1(cancellationRemarksOpt1 || cancellationRemarksValue);
        setCancellationRemarksOption2(cancellationRemarksOpt2 || cancellationRemarksValue);
        setCancellationRemarksActiveOption(cancellationRemarksActive);
        
        setEmiRemarksOption1(emiRemarksOpt1 || emiRemarksValue);
        setEmiRemarksOption2(emiRemarksOpt2 || emiRemarksValue);
        setEmiRemarksActiveOption(emiRemarksActive);
        
        setOptionalTourRemarksOption1(optionalRemarksOpt1 || optionalRemarksValue);
        setOptionalTourRemarksOption2(optionalRemarksOpt2 || optionalRemarksValue);
        setOptionalTourRemarksActiveOption(optionalRemarksActive);
        
        setInstructionOption1(instructionDescOpt1 || instructionDescValue);
        setInstructionOption2(instructionDescOpt2 || instructionDescValue);
        setInstructionActiveOption(instructionDescActive);
        
        setFormData({
          tour_code: basic.tour_code || '',
          tour_type: basic.tour_type || 'seniorcitizen',
          title: basic.title || '',
          category_id: basic.category_id || 1,
          primary_destination_id: basic.primary_destination_id || '',
          duration_days: basic.duration_days || '',
          overview: basic.overview || '',
          base_price_adult: basic.base_price_adult || '',
          emi_price: basic.emi_price || '',
          is_international: basic.is_international || 0,
          cost_remarks: costRemarksValue,
          cost_remarks_option1: costRemarksOpt1 || costRemarksValue,
          cost_remarks_option2: costRemarksOpt2 || costRemarksValue,
          hotel_remarks: hotelRemarksValue,
          hotel_remarks_option1: hotelRemarksOpt1 || hotelRemarksValue,
          hotel_remarks_option2: hotelRemarksOpt2 || hotelRemarksValue,
          transport_remarks: transportRemarksValue,
          transport_remarks_option1: transportRemarksOpt1 || transportRemarksValue,
          transport_remarks_option2: transportRemarksOpt2 || transportRemarksValue,
          booking_poi_remarks: bookingRemarksValue,
          booking_poi_remarks_option1: bookingRemarksOpt1 || bookingRemarksValue,
          booking_poi_remarks_option2: bookingRemarksOpt2 || bookingRemarksValue,
          cancellation_remarks: cancellationRemarksValue,
          cancellation_remarks_option1: cancellationRemarksOpt1 || cancellationRemarksValue,
          cancellation_remarks_option2: cancellationRemarksOpt2 || cancellationRemarksValue,
          emi_remarks: emiRemarksValue,
          emi_remarks_option1: emiRemarksOpt1 || emiRemarksValue,
          emi_remarks_option2: emiRemarksOpt2 || emiRemarksValue,
          optional_tour_remarks: optionalRemarksValue,
          optional_tour_remarks_option1: optionalRemarksOpt1 || optionalRemarksValue,
          optional_tour_remarks_option2: optionalRemarksOpt2 || optionalRemarksValue,
          instruction_description: instructionDescValue,
          instruction_description_option1: instructionDescOpt1 || instructionDescValue,
          instruction_description_option2: instructionDescOpt2 || instructionDescValue
        });

        // Load itineraries
        if (data.itinerary && Array.isArray(data.itinerary)) {
          const formattedItineraries = data.itinerary.map(item => ({
            day: item.day,
            title: item.title,
            description: item.description || '',
            meals: item.meals || ''
          }));
          setItineraries(formattedItineraries);
        }

        // Load departures
        if (data.departures && Array.isArray(data.departures)) {
          const formattedDepartures = data.departures.map(dept => ({
            start_date: dept.start_date ? dept.start_date.split('T')[0] : '',
            end_date: dept.end_date ? dept.end_date.split('T')[0] : '',
            status: dept.status || 'Available',
            total_seats: dept.total_seats || 40,
            booked_seats: dept.booked_seats || 0,
            description: dept.description || '',
            three_star_twin: dept.three_star_twin || '',
            three_star_triple: dept.three_star_triple || '',
            three_star_child_with_bed: dept.three_star_child_with_bed || '',
            three_star_child_without_bed: dept.three_star_child_without_bed || '',
            three_star_infant: dept.three_star_infant || '',
            three_star_single: dept.three_star_single || '',
            four_star_twin: dept.four_star_twin || '',
            four_star_triple: dept.four_star_triple || '',
            four_star_child_with_bed: dept.four_star_child_with_bed || '',
            four_star_child_without_bed: dept.four_star_child_without_bed || '',
            four_star_infant: dept.four_star_infant || '',
            four_star_single: dept.four_star_single || '',
            five_star_twin: dept.five_star_twin || '',
            five_star_triple: dept.five_star_triple || '',
            five_star_child_with_bed: dept.five_star_child_with_bed || '',
            five_star_child_without_bed: dept.five_star_child_without_bed || '',
            five_star_infant: dept.five_star_infant || '',
            five_star_single: dept.five_star_single || ''
          }));
          setDepartures(formattedDepartures);
        }

        // Load inclusions
        if (data.inclusions && Array.isArray(data.inclusions)) {
          const inclusionItems = data.inclusions.map(inc => inc.item);
          setInclusions(inclusionItems);
        }

        // Load exclusions
        if (data.exclusions && Array.isArray(data.exclusions)) {
          const exclusionItems = data.exclusions.map(exc => exc.item);
          setExclusions(exclusionItems);
        }

        // Load optional tours
        if (data.optional_tours && Array.isArray(data.optional_tours)) {
          setOptionalTours(data.optional_tours);
        }

        // Load EMI options
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
        }

        // Load hotels
        if (data.hotels && Array.isArray(data.hotels)) {
          const formattedHotels = data.hotels.map(hotel => ({
            ...hotel,
            standard_hotel_name: hotel.standard_hotel_name || '',
            deluxe_hotel_name: hotel.deluxe_hotel_name || '',
            executive_hotel_name: hotel.executive_hotel_name || ''
          }));
          setHotelRows(formattedHotels);
        }

        // Load transport
        if (data.transport && Array.isArray(data.transport)) {
          const formattedTransports = data.transport.map(transport => ({
            ...transport,
            from_date: transport.from_date ? transport.from_date.split('T')[0] : '',
            to_date: transport.to_date ? transport.to_date.split('T')[0] : '',
            from_time: transport.from_time || '',
            to_time: transport.to_time || ''
          }));
          setTransports(formattedTransports);
        }

        // Load booking POI
        if (data.booking_poi && Array.isArray(data.booking_poi)) {
          const formattedPois = data.booking_poi.map(poi => ({
            item: poi.item,
            amount_details: poi.amount_details || ''
          }));
          setBookingPois(formattedPois);
        }

        // Load cancellation policies
        if (data.cancellation_policies && Array.isArray(data.cancellation_policies)) {
          const formattedPolicies = data.cancellation_policies.map(policy => ({
            cancellation_policy: policy.cancellation_policy,
            charges: policy.charges || ''
          }));
          setCancelPolicies(formattedPolicies);
        }

        // Load instructions - with both options
        if (data.instructions && Array.isArray(data.instructions)) {
          const formattedInstructions = data.instructions.map(inst => ({
            item: inst.item,
            item_option1: inst.item_option1 || '',
            item_option2: inst.item_option2 || '',
            item_active: inst.item_active || 'option1'
          }));
          setInstructions(formattedInstructions);
        }

        // Load images
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

  // BASIC DETAILS CHANGE
  const handleBasicChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      'duration_days',
      'base_price_adult',
      'emi_price', 
      'category_id',
      'primary_destination_id',
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

  // DEPARTURE FORM CHANGE
  const handleSeniorDepartureChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      'total_seats', 'booked_seats',
      'three_star_twin', 'three_star_triple', 'three_star_child_with_bed',
      'three_star_child_without_bed', 'three_star_infant', 'three_star_single',
      'four_star_twin', 'four_star_triple', 'four_star_child_with_bed',
      'four_star_child_without_bed', 'four_star_infant', 'four_star_single',
      'five_star_twin', 'five_star_triple', 'five_star_child_with_bed',
      'five_star_child_without_bed', 'five_star_infant', 'five_star_single'
    ];

    setSeniorDepartureForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  const handleAddDeparture = () => {
    if (!seniorDepartureForm.start_date || !seniorDepartureForm.end_date) {
      setError('Please enter both start and end dates');
      return;
    }

    const departureData = {
      ...seniorDepartureForm,
      start_date: seniorDepartureForm.start_date,
      end_date: seniorDepartureForm.end_date,
      status: seniorDepartureForm.status || 'Available',
      total_seats: seniorDepartureForm.total_seats || 40,
      booked_seats: seniorDepartureForm.booked_seats || 0,
      description: seniorDepartureForm.description || '',
      three_star_twin: seniorDepartureForm.three_star_twin ? Number(seniorDepartureForm.three_star_twin) : null,
      three_star_triple: seniorDepartureForm.three_star_triple ? Number(seniorDepartureForm.three_star_triple) : null,
      three_star_child_with_bed: seniorDepartureForm.three_star_child_with_bed ? Number(seniorDepartureForm.three_star_child_with_bed) : null,
      three_star_child_without_bed: seniorDepartureForm.three_star_child_without_bed ? Number(seniorDepartureForm.three_star_child_without_bed) : null,
      three_star_infant: seniorDepartureForm.three_star_infant ? Number(seniorDepartureForm.three_star_infant) : null,
      three_star_single: seniorDepartureForm.three_star_single ? Number(seniorDepartureForm.three_star_single) : null,
      four_star_twin: seniorDepartureForm.four_star_twin ? Number(seniorDepartureForm.four_star_twin) : null,
      four_star_triple: seniorDepartureForm.four_star_triple ? Number(seniorDepartureForm.four_star_triple) : null,
      four_star_child_with_bed: seniorDepartureForm.four_star_child_with_bed ? Number(seniorDepartureForm.four_star_child_with_bed) : null,
      four_star_child_without_bed: seniorDepartureForm.four_star_child_without_bed ? Number(seniorDepartureForm.four_star_child_without_bed) : null,
      four_star_infant: seniorDepartureForm.four_star_infant ? Number(seniorDepartureForm.four_star_infant) : null,
      four_star_single: seniorDepartureForm.four_star_single ? Number(seniorDepartureForm.four_star_single) : null,
      five_star_twin: seniorDepartureForm.five_star_twin ? Number(seniorDepartureForm.five_star_twin) : null,
      five_star_triple: seniorDepartureForm.five_star_triple ? Number(seniorDepartureForm.five_star_triple) : null,
      five_star_child_with_bed: seniorDepartureForm.five_star_child_with_bed ? Number(seniorDepartureForm.five_star_child_with_bed) : null,
      five_star_child_without_bed: seniorDepartureForm.five_star_child_without_bed ? Number(seniorDepartureForm.five_star_child_without_bed) : null,
      five_star_infant: seniorDepartureForm.five_star_infant ? Number(seniorDepartureForm.five_star_infant) : null,
      five_star_single: seniorDepartureForm.five_star_single ? Number(seniorDepartureForm.five_star_single) : null
    };

    if (editingDepartureIndex !== -1) {
      const updatedDepartures = [...departures];
      updatedDepartures[editingDepartureIndex] = departureData;
      setDepartures(updatedDepartures);
      setEditingDepartureIndex(-1);
      setSuccess('Departure updated successfully');
    } else {
      setDepartures((prev) => [...prev, departureData]);
      setSuccess('Departure added successfully');
    }

    setSeniorDepartureForm({
      start_date: '',
      end_date: '',
      status: 'Available',
      total_seats: 40,
      booked_seats: 0,
      description: '',
      three_star_twin: '',
      three_star_triple: '',
      three_star_child_with_bed: '',
      three_star_child_without_bed: '',
      three_star_infant: '',
      three_star_single: '',
      four_star_twin: '',
      four_star_triple: '',
      four_star_child_with_bed: '',
      four_star_child_without_bed: '',
      four_star_infant: '',
      four_star_single: '',
      five_star_twin: '',
      five_star_triple: '',
      five_star_child_with_bed: '',
      five_star_child_without_bed: '',
      five_star_infant: '',
      five_star_single: ''
    });
  };

  const editDeparture = (idx) => {
    const departure = departures[idx];
    setSeniorDepartureForm({
      start_date: departure.start_date || '',
      end_date: departure.end_date || '',
      status: departure.status || 'Available',
      total_seats: departure.total_seats || 40,
      booked_seats: departure.booked_seats || 0,
      description: departure.description || '',
      three_star_twin: departure.three_star_twin || '',
      three_star_triple: departure.three_star_triple || '',
      three_star_child_with_bed: departure.three_star_child_with_bed || '',
      three_star_child_without_bed: departure.three_star_child_without_bed || '',
      three_star_infant: departure.three_star_infant || '',
      three_star_single: departure.three_star_single || '',
      four_star_twin: departure.four_star_twin || '',
      four_star_triple: departure.four_star_triple || '',
      four_star_child_with_bed: departure.four_star_child_with_bed || '',
      four_star_child_without_bed: departure.four_star_child_without_bed || '',
      four_star_infant: departure.four_star_infant || '',
      four_star_single: departure.four_star_single || '',
      five_star_twin: departure.five_star_twin || '',
      five_star_triple: departure.five_star_triple || '',
      five_star_child_with_bed: departure.five_star_child_with_bed || '',
      five_star_child_without_bed: departure.five_star_child_without_bed || '',
      five_star_infant: departure.five_star_infant || '',
      five_star_single: departure.five_star_single || ''
    });
    
    setEditingDepartureIndex(idx);
  };

  const handleRemoveDeparture = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this departure?');
    if (confirmDelete) {
      setDepartures((prev) => prev.filter((_, i) => i !== idx));
      if (editingDepartureIndex === idx) {
        setEditingDepartureIndex(-1);
        setSeniorDepartureForm({
          start_date: '',
          end_date: '',
          status: 'Available',
          total_seats: 40,
          booked_seats: 0,
          description: '',
          three_star_twin: '',
          three_star_triple: '',
          three_star_child_with_bed: '',
          three_star_child_without_bed: '',
          three_star_infant: '',
          three_star_single: '',
          four_star_twin: '',
          four_star_triple: '',
          four_star_child_with_bed: '',
          four_star_child_without_bed: '',
          four_star_infant: '',
          four_star_single: '',
          five_star_twin: '',
          five_star_triple: '',
          five_star_child_with_bed: '',
          five_star_child_without_bed: '',
          five_star_infant: '',
          five_star_single: ''
        });
      }
    }
  };

  // EXCLUSIONS
  const handleAddExclusion = () => {
    const trimmed = exclusionText.trim();
    if (!trimmed) return;
    
    if (editingExclusionIndex !== -1) {
      const updated = [...exclusions];
      updated[editingExclusionIndex] = trimmed;
      setExclusions(updated);
      setEditingExclusionIndex(-1);
    } else {
      setExclusions((prev) => [...prev, trimmed]);
    }
    
    setExclusionText('');
  };

  const editExclusion = (idx) => {
    const exclusion = exclusions[idx];
    setExclusionText(exclusion);
    setEditingExclusionIndex(idx);
  };

  const handleRemoveExclusion = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this exclusion?');
    if (confirmDelete) {
      setExclusions(prev => prev.filter((_, i) => i !== idx));
      if (editingExclusionIndex === idx) {
        setEditingExclusionIndex(-1);
        setExclusionText('');
      }
    }
  };

  // INCLUSIONS
  const handleAddInclusion = () => {
    const trimmed = inclusionText.trim();
    if (!trimmed) return;
    
    if (editingInclusionIndex !== -1) {
      const updated = [...inclusions];
      updated[editingInclusionIndex] = trimmed;
      setInclusions(updated);
      setEditingInclusionIndex(-1);
    } else {
      setInclusions((prev) => [...prev, trimmed]);
    }
    
    setInclusionText('');
  };

  const editInclusion = (idx) => {
    const inclusion = inclusions[idx];
    setInclusionText(inclusion);
    setEditingInclusionIndex(idx);
  };

  const handleRemoveInclusion = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this inclusion?');
    if (confirmDelete) {
      setInclusions(prev => prev.filter((_, i) => i !== idx));
      if (editingInclusionIndex === idx) {
        setEditingInclusionIndex(-1);
        setInclusionText('');
      }
    }
  };

  // IMAGES
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

  useEffect(() => {
    return () => {
      if (replacementPreview && replacementPreview.startsWith('blob:')) {
        URL.revokeObjectURL(replacementPreview);
      }
    };
  }, [replacementPreview]);

  // ITINERARY
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

  const handleAddItinerary = () => {
    const { day, title, description, meals } = itineraryItem;
    if (!day || !title.trim()) return;

    const selectedMeals = [];
    if (meals.breakfast) selectedMeals.push('Breakfast');
    if (meals.lunch) selectedMeals.push('Lunch');
    if (meals.dinner) selectedMeals.push('Dinner');

    const mealsString = selectedMeals.join(', ');

    const newItinerary = {
      day: Number(day),
      title: title.trim(),
      description: description.trim(),
      meals: mealsString
    };

    if (editingItineraryIndex !== -1) {
      const updatedItineraries = [...itineraries];
      updatedItineraries[editingItineraryIndex] = newItinerary;
      setItineraries(updatedItineraries);
      setEditingItineraryIndex(-1);
    } else {
      setItineraries((prev) => [...prev, newItinerary]);
    }

    setItineraryItem({
      day: '',
      title: '',
      description: '',
      meals: {
        breakfast: false,
        lunch: false,
        dinner: false
      }
    });
  };

  const handleRemoveItinerary = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this itinerary?');
    if (confirmDelete) {
      setItineraries(prev => prev.filter((_, i) => i !== idx));
      if (editingItineraryIndex === idx) {
        setEditingItineraryIndex(-1);
        setItineraryItem({
          day: '',
          title: '',
          description: '',
          meals: { breakfast: false, lunch: false, dinner: false }
        });
      }
    }
  };

  // NAVIGATION
  const goNext = () => {
    const currentIndex = TAB_LIST.indexOf(activeTab);
    if (currentIndex < TAB_LIST.length - 1) {
      setActiveTab(TAB_LIST[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const currentIndex = TAB_LIST.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(TAB_LIST[currentIndex - 1]);
    }
  };

  const handleCancel = () => {
    navigate('/senior-citizen-tours');
  };

  const isLastTab = activeTab === TAB_LIST[TAB_LIST.length - 1];

  // AUTO-ADD WHEN USER CLICKS SAVE & CONTINUE
  const autoAddBeforeNext = () => {
    switch (activeTab) {
      case 'itineraries':
        if (itineraryItem.day && itineraryItem.title.trim() && editingItineraryIndex === -1) {
          handleAddItinerary();
        }
        break;
      case 'departures':
        if (seniorDepartureForm.start_date && seniorDepartureForm.end_date && editingDepartureIndex === -1) {
          handleAddDeparture();
        }
        break;
      case 'optionalTours':
        if (optionalTourItem.tour_name && optionalTourItem.tour_name.trim() && editingOptionalTourIndex === -1) {
          addOptionalTourRow();
        }
        break;
      case 'hotels':
        if (hotelItem.city.trim() && (hotelItem.standard_hotel_name.trim() || hotelItem.deluxe_hotel_name.trim() || hotelItem.executive_hotel_name.trim()) && editingType !== 'hotel') {
          addHotelRow();
        }
        break;
      case 'flights':
        if (transportItem.airline && transportItem.flight_no && editingTransportIndex === -1) {
          addTransportRow();
        }
        break;
      case 'bookingPoi':
        if (poiText && poiText.trim() && editingBookingPoiIndex === -1) {
          addPoi();
        }
        break;
      case 'cancellation':
        if (cancelItem.cancellation_policy && cancelItem.cancellation_policy.trim() && editingCancellationIndex === -1) {
          addCancelRow();
        }
        break;
      case 'instructions':
        // Instructions are saved directly on main save - no auto-add needed
        break;
      case 'inclusions':
        if (inclusionText && inclusionText.trim() && editingInclusionIndex === -1) {
          handleAddInclusion();
        }
        break;
      case 'exclusions':
        if (exclusionText && exclusionText.trim() && editingExclusionIndex === -1) {
          handleAddExclusion();
        }
        break;
      default:
        break;
    }
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

  // UPDATE EXISTING TOUR
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
        tour_type: formData.tour_type || 'seniorcitizen',
        primary_destination_id: formData.primary_destination_id,
        duration_days: Number(formData.duration_days) || 0,
        overview: formData.overview || '',
        base_price_adult: Number(formData.base_price_adult) || 0,
        emi_price: Number(formData.emi_price) || 0,
        is_international: Number(formData.is_international) || 0,
        cost_remarks_active: costRemarksActiveOption,
        hotel_remarks_active: hotelRemarksActiveOption,
        transport_remarks_active: flightRemarksActiveOption,
        emi_remarks_active: emiRemarksActiveOption,
        booking_poi_remarks_active: bookingPoiRemarksActiveOption,
        cancellation_remarks_active: cancellationRemarksActiveOption,
        optional_tour_remarks_active: optionalTourRemarksActiveOption,
        instruction_description_active: instructionActiveOption,
        cost_remarks_option1: costRemarksOption1,
        cost_remarks_option2: costRemarksOption2,
        hotel_remarks_option1: hotelRemarksOption1,
        hotel_remarks_option2: hotelRemarksOption2,
        transport_remarks_option1: flightRemarksOption1,
        transport_remarks_option2: flightRemarksOption2,
        emi_remarks_option1: emiRemarksOption1,
        emi_remarks_option2: emiRemarksOption2,
        booking_poi_remarks_option1: bookingPoiRemarksOption1,
        booking_poi_remarks_option2: bookingPoiRemarksOption2,
        cancellation_remarks_option1: cancellationRemarksOption1,
        cancellation_remarks_option2: cancellationRemarksOption2,
        optional_tour_remarks_option1: optionalTourRemarksOption1,
        optional_tour_remarks_option2: optionalTourRemarksOption2,
        instruction_description_option1: instructionOption1,
        instruction_description_option2: instructionOption2
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

      // Delete existing data
      const deleteEndpoints = [
        `${baseurl}/api/departures/bulk/${id}`,
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

      // Save itineraries
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

      // Save departures
      if (departures.length > 0) {
        const formattedDepartures = departures.map(dept => ({
          tour_type: 'seniorcitizen',
          start_date: dept.start_date,
          end_date: dept.end_date,
          status: dept.status,
          total_seats: dept.total_seats || 40,
          booked_seats: dept.booked_seats || 0,
          description: dept.description || null,
          adult_price: dept.three_star_twin || 0,
          three_star_twin: dept.three_star_twin || null,
          three_star_triple: dept.three_star_triple || null,
          three_star_child_with_bed: dept.three_star_child_with_bed || null,
          three_star_child_without_bed: dept.three_star_child_without_bed || null,
          three_star_infant: dept.three_star_infant || null,
          three_star_single: dept.three_star_single || null,
          four_star_twin: dept.four_star_twin || null,
          four_star_triple: dept.four_star_triple || null,
          four_star_child_with_bed: dept.four_star_child_with_bed || null,
          four_star_child_without_bed: dept.four_star_child_without_bed || null,
          four_star_infant: dept.four_star_infant || null,
          four_star_single: dept.four_star_single || null,
          five_star_twin: dept.five_star_twin || null,
          five_star_triple: dept.five_star_triple || null,
          five_star_child_with_bed: dept.five_star_child_with_bed || null,
          five_star_child_without_bed: dept.five_star_child_without_bed || null,
          five_star_infant: dept.five_star_infant || null,
          five_star_single: dept.five_star_single || null
        }));

        await fetch(`${baseurl}/api/departures/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, departures: formattedDepartures })
        });
      }

      // Save optional tours with both remark options
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

      // Save EMI options with both remark options
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

      // Save hotels with both remark options
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

      // Save transports with both remark options
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

      // Save booking POI with both remark options
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

      // Save cancellation policies with both remark options
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

      // Save instructions with both options
      if (instructions.length > 0) {
        const instructionsWithBothOptions = instructions.map(inst => ({
          item: inst.item,
          item_option1: inst.item_option1 || instructionOption1,
          item_option2: inst.item_option2 || instructionOption2,
          item_active: inst.item_active || instructionActiveOption
        }));
        await fetch(`${baseurl}/api/tour-instructions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: instructionsWithBothOptions })
        });
      }

      // Save inclusions
      if (inclusions.length > 0) {
        await fetch(`${baseurl}/api/inclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: inclusions })
        });
      }

      // Save exclusions
      if (exclusions.length > 0) {
        await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: exclusions })
        });
      }

      // Save images
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
      setTimeout(() => navigate('/senior-citizen-tours'), 1500);
    } catch (err) {
      console.error('Error updating tour:', err);
      setError(err.message || 'Failed to update tour');
    } finally {
      setLoading(false);
    }
  };

  // CREATE NEW TOUR
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
        tour_type: formData.tour_type || 'seniorcitizen',
        primary_destination_id: formData.primary_destination_id,
        duration_days: Number(formData.duration_days) || 0,
        overview: formData.overview || '',
        base_price_adult: Number(formData.base_price_adult) || 0,
        emi_price: Number(formData.emi_price) || 0,
        is_international: Number(formData.is_international) || 0,
        status: 1,
        cost_remarks_active: costRemarksActiveOption,
        hotel_remarks_active: hotelRemarksActiveOption,
        transport_remarks_active: flightRemarksActiveOption,
        emi_remarks_active: emiRemarksActiveOption,
        booking_poi_remarks_active: bookingPoiRemarksActiveOption,
        cancellation_remarks_active: cancellationRemarksActiveOption,
        optional_tour_remarks_active: optionalTourRemarksActiveOption,
        instruction_description_active: instructionActiveOption,
        cost_remarks_option1: costRemarksOption1,
        cost_remarks_option2: costRemarksOption2,
        hotel_remarks_option1: hotelRemarksOption1,
        hotel_remarks_option2: hotelRemarksOption2,
        transport_remarks_option1: flightRemarksOption1,
        transport_remarks_option2: flightRemarksOption2,
        emi_remarks_option1: emiRemarksOption1,
        emi_remarks_option2: emiRemarksOption2,
        booking_poi_remarks_option1: bookingPoiRemarksOption1,
        booking_poi_remarks_option2: bookingPoiRemarksOption2,
        cancellation_remarks_option1: cancellationRemarksOption1,
        cancellation_remarks_option2: cancellationRemarksOption2,
        optional_tour_remarks_option1: optionalTourRemarksOption1,
        optional_tour_remarks_option2: optionalTourRemarksOption2,
        instruction_description_option1: instructionOption1,
        instruction_description_option2: instructionOption2
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

      // Save itineraries
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

      // Save departures
      if (departures.length > 0) {
        const formattedDepartures = departures.map(dept => ({
          tour_type: 'seniorcitizen',
          start_date: dept.start_date,
          end_date: dept.end_date,
          status: dept.status,
          total_seats: dept.total_seats || 40,
          booked_seats: dept.booked_seats || 0,
          description: dept.description || null,
          adult_price: dept.three_star_twin || 0,
          three_star_twin: dept.three_star_twin || null,
          three_star_triple: dept.three_star_triple || null,
          three_star_child_with_bed: dept.three_star_child_with_bed || null,
          three_star_child_without_bed: dept.three_star_child_without_bed || null,
          three_star_infant: dept.three_star_infant || null,
          three_star_single: dept.three_star_single || null,
          four_star_twin: dept.four_star_twin || null,
          four_star_triple: dept.four_star_triple || null,
          four_star_child_with_bed: dept.four_star_child_with_bed || null,
          four_star_child_without_bed: dept.four_star_child_without_bed || null,
          four_star_infant: dept.four_star_infant || null,
          four_star_single: dept.four_star_single || null,
          five_star_twin: dept.five_star_twin || null,
          five_star_triple: dept.five_star_triple || null,
          five_star_child_with_bed: dept.five_star_child_with_bed || null,
          five_star_child_without_bed: dept.five_star_child_without_bed || null,
          five_star_infant: dept.five_star_infant || null,
          five_star_single: dept.five_star_single || null
        }));

        await fetch(`${baseurl}/api/departures/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, departures: formattedDepartures })
        });
      }

      // Save optional tours with both remark options
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

      // Save EMI options with both remark options
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

      // Save hotels with both remark options
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

      // Save transports with both remark options
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

      // Save booking POI with both remark options
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

      // Save cancellation policies with both remark options
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

      // Save instructions with both options
      if (instructions.length > 0) {
        const instructionsWithBothOptions = instructions.map(inst => ({
          item: inst.item,
          item_option1: inst.item_option1 || instructionOption1,
          item_option2: inst.item_option2 || instructionOption2,
          item_active: inst.item_active || instructionActiveOption
        }));
        await fetch(`${baseurl}/api/tour-instructions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: instructionsWithBothOptions })
        });
      }

      // Save inclusions
      if (inclusions.length > 0) {
        await fetch(`${baseurl}/api/inclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: inclusions })
        });
      }

      // Save exclusions
      if (exclusions.length > 0) {
        await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: exclusions })
        });
      }

      // Save images
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
      setTimeout(() => navigate('/senior-citizen-tours'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create tour');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    autoAddBeforeNext();

    if (isLastTab) {
      const message = isEditMode 
        ? 'Are you sure you want to update this senior citizen tour with all changes?'
        : 'Are you sure you want to save this senior citizen tour and all its details?';
      
      if (window.confirm(message)) {
        if (isEditMode) {
          updateTour();
        } else {
          createTour();
        }
      }
    } else {
      const message = isEditMode
        ? 'Save current tab changes and continue to next tab?'
        : 'Save current tab and continue to next tab?';
      
      if (window.confirm(message)) {
        goNext();
        setSuccess(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} saved successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  // Dynamic "+ Add ..." button for bottom bar
  const getAddConfigForTab = (tabKey) => {
    switch (tabKey) {
      case 'itineraries':
        return { 
          label: editingItineraryIndex !== -1 ? '✓ Update Itinerary' : '+ Add Day', 
          onClick: handleAddItinerary 
        };
      case 'departures':
        return { 
          label: editingDepartureIndex !== -1 ? '✓ Update Departure' : '+ Add Departure', 
          onClick: handleAddDeparture 
        };
      case 'optionalTours':
        return { 
          label: editingOptionalTourIndex !== -1 ? '✓ Update Optional Tour' : '+ Add Optional Tour', 
          onClick: addOptionalTourRow 
        };
      case 'inclusions':
        return { 
          label: editingInclusionIndex !== -1 ? '✓ Update Inclusion' : '+ Add Inclusion', 
          onClick: handleAddInclusion 
        };
      case 'exclusions':
        return { 
          label: editingExclusionIndex !== -1 ? '✓ Update Exclusion' : '+ Add Exclusion', 
          onClick: handleAddExclusion 
        };
      case 'flights':
        return { 
          label: editingTransportIndex !== -1 ? '✓ Update Transport' : '+ Add Transport', 
          onClick: addTransportRow 
        };
      case 'hotels':
        return { 
          label: editingType === 'hotel' ? '✓ Update Hotel' : '+ Add Hotel', 
          onClick: addHotelRow 
        };
      case 'bookingPoi':
        return { 
          label: editingBookingPoiIndex !== -1 ? '✓ Update Booking Policy' : '+ Add Booking Policy', 
          onClick: addPoi 
        };
      case 'cancellation':
        return { 
          label: editingCancellationIndex !== -1 ? '✓ Update Cancellation Policy' : '+ Add Cancellation Policy', 
          onClick: addCancelRow 
        };
      case 'instructions':
        // No add button for Instructions - saved directly on main save
        return null;
      default:
        return null;
    }
  };

  const addConfig = getAddConfigForTab(activeTab);

  // Get label for add button
  const getAddButtonLabel = () => {
    if (!addConfig) return null;
    return addConfig.label;
  };

  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">{isEditMode ? 'Edit Senior Citizen Tour' : 'Add Senior Citizen Tour'}</h2>

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
              {getAddButtonLabel()}
            </Button>
          )}

          <Button
            variant="primary"
            onClick={handleSaveClick}
            disabled={loading}
          >
            {loading ? 'Saving...' : isLastTab ? (isEditMode ? 'Update All' : 'Save All') : 'Save & Continue'}
          </Button>
        </div>

        {/* ====== BASIC DETAILS TAB ====== */}
        <Card>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
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
                      <Form.Label>Indian States *</Form.Label>
                      <Form.Select
                        name="primary_destination_id"
                        value={formData.primary_destination_id}
                        onChange={handleBasicChange}
                      >
                        <option value="">Select Domestic Destination</option>
                        {destinations.map((d) => (
                          <option
                            key={d.destination_id}
                            value={d.destination_id}
                          >
                            {d.name}
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

                {editingItineraryIndex !== -1 && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setEditingItineraryIndex(-1);
                      setItineraryItem({
                        day: '',
                        title: '',
                        description: '',
                        meals: { breakfast: false, lunch: false, dinner: false }
                      });
                    }}
                    className="ms-2"
                  >
                    Cancel Edit
                  </Button>
                )}
              </Tab>

              {/* ====== DEPARTURES & COSTS TAB ====== */}
              <Tab eventKey="departures" title="Departures & Costs">
                <div>
                  <Row className="mb-4">
                    <h5>Add Departure with Costs</h5>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="start_date"
                          value={seniorDepartureForm.start_date}
                          onChange={handleSeniorDepartureChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="end_date"
                          value={seniorDepartureForm.end_date}
                          onChange={handleSeniorDepartureChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status *</Form.Label>
                        <Form.Select
                          name="status"
                          value={seniorDepartureForm.status}
                          onChange={handleSeniorDepartureChange}
                        >
                          <option value="Available">Available</option>
                          <option value="Few Seats">Few Seats</option>
                          <option value="Sold Out">Sold Out</option>
                          <option value="Fast Filling">Fast Filling</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Total Seats</Form.Label>
                        <Form.Control
                          type="number"
                          name="total_seats"
                          value={seniorDepartureForm.total_seats}
                          onChange={handleSeniorDepartureChange}
                          placeholder="Total seats"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Booked Seats</Form.Label>
                        <Form.Control
                          type="number"
                          name="booked_seats"
                          value={seniorDepartureForm.booked_seats}
                          onChange={handleSeniorDepartureChange}
                          placeholder="Booked seats"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* 3-Star Hotel Prices */}
                  <Row className="mb-4">
                    <h6>Standard Hotel Prices</h6>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Twin Sharing</Form.Label>
                        <Form.Control
                          type="number"
                          name="three_star_twin"
                          value={seniorDepartureForm.three_star_twin || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Triple Sharing</Form.Label>
                        <Form.Control
                          type="number"
                          name="three_star_triple"
                          value={seniorDepartureForm.three_star_triple || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Child With Bed</Form.Label>
                        <Form.Control
                          type="number"
                          name="three_star_child_with_bed"
                          value={seniorDepartureForm.three_star_child_with_bed || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Child No Bed</Form.Label>
                        <Form.Control
                          type="number"
                          name="three_star_child_without_bed"
                          value={seniorDepartureForm.three_star_child_without_bed || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Infant</Form.Label>
                        <Form.Control
                          type="number"
                          name="three_star_infant"
                          value={seniorDepartureForm.three_star_infant || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Single</Form.Label>
                        <Form.Control
                          type="number"
                          name="three_star_single"
                          value={seniorDepartureForm.three_star_single || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* 4-Star Hotel Prices */}
                  <Row className="mb-4">
                    <h6>Deluxe Hotel Prices</h6>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Twin Sharing</Form.Label>
                        <Form.Control
                          type="number"
                          name="four_star_twin"
                          value={seniorDepartureForm.four_star_twin || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Triple Sharing</Form.Label>
                        <Form.Control
                          type="number"
                          name="four_star_triple"
                          value={seniorDepartureForm.four_star_triple || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Child With Bed</Form.Label>
                        <Form.Control
                          type="number"
                          name="four_star_child_with_bed"
                          value={seniorDepartureForm.four_star_child_with_bed || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Child No Bed</Form.Label>
                        <Form.Control
                          type="number"
                          name="four_star_child_without_bed"
                          value={seniorDepartureForm.four_star_child_without_bed || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Infant</Form.Label>
                        <Form.Control
                          type="number"
                          name="four_star_infant"
                          value={seniorDepartureForm.four_star_infant || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Single</Form.Label>
                        <Form.Control
                          type="number"
                          name="four_star_single"
                          value={seniorDepartureForm.four_star_single || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* 5-Star Hotel Prices */}
                  <Row className="mb-4">
                    <h6>Luxury Hotel Prices</h6>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Twin Sharing</Form.Label>
                        <Form.Control
                          type="number"
                          name="five_star_twin"
                          value={seniorDepartureForm.five_star_twin || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Triple Sharing</Form.Label>
                        <Form.Control
                          type="number"
                          name="five_star_triple"
                          value={seniorDepartureForm.five_star_triple || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Child With Bed</Form.Label>
                        <Form.Control
                          type="number"
                          name="five_star_child_with_bed"
                          value={seniorDepartureForm.five_star_child_with_bed || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Child No Bed</Form.Label>
                        <Form.Control
                          type="number"
                          name="five_star_child_without_bed"
                          value={seniorDepartureForm.five_star_child_without_bed || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Infant</Form.Label>
                        <Form.Control
                          type="number"
                          name="five_star_infant"
                          value={seniorDepartureForm.five_star_infant || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Single</Form.Label>
                        <Form.Control
                          type="number"
                          name="five_star_single"
                          value={seniorDepartureForm.five_star_single || ''}
                          onChange={handleSeniorDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Cost Remarks with Option Tabs */}
                <Form.Group className="mt-4">
                  <Form.Label>Cost Remarks</Form.Label>
                  <OptionTabs
                    activeOption={costRemarksActiveOption}
                    onOptionChange={handleCostRemarksActiveChange}
                    option1Value={costRemarksOption1}
                    option2Value={costRemarksOption2}
                    onOption1Change={(val) => handleCostRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleCostRemarksOptionChange('option2', val)}
                    placeholder="Enter cost remarks for Option 1"
                  />
                </Form.Group>

                {/* Display Added Departures with Costs */}
                {departures.length > 0 && (
                  <div className="mt-4">
                    <h5>Added Departures</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                          <th>Seats</th>
                          <th>Standard Twin</th>
                          <th>Deluxe Twin</th>
                          <th>Luxury Twin</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departures.map((dep, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{dep.start_date || '-'}</td>
                            <td>{dep.end_date || '-'}</td>
                            <td>{dep.status || '-'}</td>
                            <td>{dep.total_seats || '-'}</td>
                            <td>{dep.three_star_twin ? `₹${dep.three_star_twin.toLocaleString()}` : '-'}</td>
                            <td>{dep.four_star_twin ? `₹${dep.four_star_twin.toLocaleString()}` : '-'}</td>
                            <td>{dep.five_star_twin ? `₹${dep.five_star_twin.toLocaleString()}` : '-'}</td>
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
                  </div>
                )}

                {editingDepartureIndex !== -1 && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setEditingDepartureIndex(-1);
                      setSeniorDepartureForm({
                        start_date: '',
                        end_date: '',
                        status: 'Available',
                        total_seats: 40,
                        booked_seats: 0,
                        description: '',
                        three_star_twin: '',
                        three_star_triple: '',
                        three_star_child_with_bed: '',
                        three_star_child_without_bed: '',
                        three_star_infant: '',
                        three_star_single: '',
                        four_star_twin: '',
                        four_star_triple: '',
                        four_star_child_with_bed: '',
                        four_star_child_without_bed: '',
                        four_star_infant: '',
                        four_star_single: '',
                        five_star_twin: '',
                        five_star_triple: '',
                        five_star_child_with_bed: '',
                        five_star_child_without_bed: '',
                        five_star_infant: '',
                        five_star_single: ''
                      });
                    }}
                    className="ms-2"
                  >
                    Cancel Edit
                  </Button>
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

                {/* Optional Tour Remarks with Option Tabs */}
                <Form.Group className="mt-3">
                  <Form.Label>Optional Tour Remarks</Form.Label>
                  <OptionTabs
                    activeOption={optionalTourRemarksActiveOption}
                    onOptionChange={handleOptionalTourRemarksActiveChange}
                    option1Value={optionalTourRemarksOption1}
                    option2Value={optionalTourRemarksOption2}
                    onOption1Change={(val) => handleOptionalTourRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleOptionalTourRemarksOptionChange('option2', val)}
                    placeholder="Enter optional tour remarks for Option 1"
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
              
                {/* EMI Remarks with Option Tabs */}
                <Form.Group className="mt-4">
                  <Form.Label>EMI Remarks</Form.Label>
                  <OptionTabs
                    activeOption={emiRemarksActiveOption}
                    onOptionChange={handleEmiRemarksActiveChange}
                    option1Value={emiRemarksOption1}
                    option2Value={emiRemarksOption2}
                    onOption1Change={(val) => handleEmiRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleEmiRemarksOptionChange('option2', val)}
                    placeholder="Enter EMI remarks for Option 1"
                  />
                </Form.Group>
              </Tab>

              {/* ====== INCLUSIONS TAB ====== */}
              <Tab eventKey="inclusions" title="Inclusions">
                <Form.Group className="mb-3">
                  <Form.Label>Inclusion</Form.Label>
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
                  <Form.Label>Exclusion</Form.Label>
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

              {/* ====== FLIGHTS TAB ====== */}
              <Tab eventKey="flights" title="Flights">
                <Row className="mt-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Airline</Form.Label>
                      <Form.Control
                        name="airline"
                        value={transportItem.airline}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Flight No</Form.Label>
                      <Form.Control
                        name="flight_no"
                        value={transportItem.flight_no}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Via</Form.Label>
                      <Form.Control
                        name="via"
                        value={transportItem.via}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mt-3">
                    <Form.Label className="fw-bold">From</Form.Label>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        name="from_city"
                        value={transportItem.from_city}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="from_date"
                        value={transportItem.from_date}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="from_time"
                        value={transportItem.from_time}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mt-3">
                    <Form.Label className="fw-bold">To</Form.Label>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        name="to_city"
                        value={transportItem.to_city}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="to_date"
                        value={transportItem.to_date}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="to_time"
                        value={transportItem.to_time}
                        onChange={handleTransportChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Flight Remarks with Option Tabs */}
                <Form.Group className="mt-4">
                  <Form.Label>Flight Remarks</Form.Label>
                  <OptionTabs
                    activeOption={flightRemarksActiveOption}
                    onOptionChange={handleFlightRemarksActiveChange}
                    option1Value={flightRemarksOption1}
                    option2Value={flightRemarksOption2}
                    onOption1Change={(val) => handleFlightRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleFlightRemarksOptionChange('option2', val)}
                    placeholder="Enter flight remarks for Option 1"
                  />
                </Form.Group>

                {transports.length > 0 && (
                  <Table bordered hover size="sm" className="mt-3">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Airline</th>
                        <th>Flight</th>
                        <th>Route</th>
                        <th>Schedule</th>
                        <th>Via</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transports.map((t, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{t.airline}</td>
                          <td>{t.flight_no}</td>
                          <td>{t.from_city} → {t.to_city}</td>
                          <td>
                            {t.from_date} {t.from_time}
                            <br />
                            {t.to_date} {t.to_time}
                          </td>
                          <td>{t.via || 'Direct'}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => editTransportRow(i)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeTransportRow(i)}
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

                {/* Hotel Remarks with Option Tabs */}
                <Form.Group className="mt-3">
                  <Form.Label>Hotel Remarks</Form.Label>
                  <OptionTabs
                    activeOption={hotelRemarksActiveOption}
                    onOptionChange={handleHotelRemarksActiveChange}
                    option1Value={hotelRemarksOption1}
                    option2Value={hotelRemarksOption2}
                    onOption1Change={(val) => handleHotelRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleHotelRemarksOptionChange('option2', val)}
                    placeholder="Enter hotel remarks for Option 1"
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

                  {/* Booking Policy Remarks with Option Tabs */}
                  <Form.Group className="mt-3">
                    <Form.Label>Booking Policy Remarks</Form.Label>
                    <OptionTabs
                      activeOption={bookingPoiRemarksActiveOption}
                      onOptionChange={handleBookingPoiRemarksActiveChange}
                      option1Value={bookingPoiRemarksOption1}
                      option2Value={bookingPoiRemarksOption2}
                      onOption1Change={(val) => handleBookingPoiRemarksOptionChange('option1', val)}
                      onOption2Change={(val) => handleBookingPoiRemarksOptionChange('option2', val)}
                      placeholder="Enter booking policy remarks for Option 1"
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

                {/* Cancellation Remarks with Option Tabs */}
                <Form.Group className="mt-3">
                  <Form.Label>Cancellation Remarks</Form.Label>
                  <OptionTabs
                    activeOption={cancellationRemarksActiveOption}
                    onOptionChange={handleCancellationRemarksActiveChange}
                    option1Value={cancellationRemarksOption1}
                    option2Value={cancellationRemarksOption2}
                    onOption1Change={(val) => handleCancellationRemarksOptionChange('option1', val)}
                    onOption2Change={(val) => handleCancellationRemarksOptionChange('option2', val)}
                    placeholder="Enter cancellation remarks for Option 1"
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
                  <Form.Label>Instructions</Form.Label>
                  <OptionTabs
                    activeOption={instructionActiveOption}
                    onOptionChange={handleInstructionActiveChange}
                    option1Value={instructionOption1}
                    option2Value={instructionOption2}
                    onOption1Change={(val) => handleInstructionOptionChange('option1', val)}
                    onOption2Change={(val) => handleInstructionOptionChange('option2', val)}
                    placeholder="Enter instruction for Option 1"
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
                      {instructions.map((item, idx) => {
                        const instructionTextValue = typeof item === 'string' ? item : item.item;
                        return (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{instructionTextValue}</td>
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
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ====== IMAGES TAB ====== */}
              <Tab eventKey="images" title="Images">
                <Card className="mb-4">
                  <Card.Header>New Images</Card.Header>
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
                    
                    {imageFiles.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-2">
                          <strong>{imageFiles.length} new image(s) ready to upload:</strong>
                        </p>
                        <Row>
                          {imageFiles.map((file, idx) => (
                            <Col md={3} key={idx} className="mb-3">
                              <div className="position-relative">
                                <img
                                  src={URL.createObjectURL(file)}
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

export default AddSeniorTour;