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

const AddSportsTour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

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
    'bookingPoi',
    'cancellation',
    'instructions',
    'images'
  ];

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
  
  // For Departures Description
  const [departureActiveOption, setDepartureActiveOption] = useState('option1');
  const [departureOption1, setDepartureOption1] = useState('');
  const [departureOption2, setDepartureOption2] = useState('');
  
  // For Instructions (Add Instruction)
  const [instructionActiveOption, setInstructionActiveOption] = useState('option1');
  const [instructionOption1, setInstructionOption1] = useState('');
  const [instructionOption2, setInstructionOption2] = useState('');
  
  // For Cost Remarks (Tour Cost Tab)
  const [costRemarksActiveOption, setCostRemarksActiveOption] = useState('option1');
  const [costRemarksOption1, setCostRemarksOption1] = useState('');
  const [costRemarksOption2, setCostRemarksOption2] = useState('');
  
  // For Optional Tour Remarks (Optional Tour Tab)
  const [optionalTourRemarksActiveOption, setOptionalTourRemarksActiveOption] = useState('option1');
  const [optionalTourRemarksOption1, setOptionalTourRemarksOption1] = useState('');
  const [optionalTourRemarksOption2, setOptionalTourRemarksOption2] = useState('');
  
  // For EMI Remarks (EMI Options Tab)
  const [emiRemarksActiveOption, setEmiRemarksActiveOption] = useState('option1');
  const [emiRemarksOption1, setEmiRemarksOption1] = useState('');
  const [emiRemarksOption2, setEmiRemarksOption2] = useState('');
  
  // For Flight Remarks (Flights Tab)
  const [flightRemarksActiveOption, setFlightRemarksActiveOption] = useState('option1');
  const [flightRemarksOption1, setFlightRemarksOption1] = useState('');
  const [flightRemarksOption2, setFlightRemarksOption2] = useState('');
  
  // For Hotel Remarks (Hotels Tab)
  const [hotelRemarksActiveOption, setHotelRemarksActiveOption] = useState('option1');
  const [hotelRemarksOption1, setHotelRemarksOption1] = useState('');
  const [hotelRemarksOption2, setHotelRemarksOption2] = useState('');
  
  // For Booking Policy Remarks (Booking POI Tab)
  const [bookingPoiRemarksActiveOption, setBookingPoiRemarksActiveOption] = useState('option1');
  const [bookingPoiRemarksOption1, setBookingPoiRemarksOption1] = useState('');
  const [bookingPoiRemarksOption2, setBookingPoiRemarksOption2] = useState('');
  
  // For Cancellation Remarks (Cancellation Policy Tab)
  const [cancellationRemarksActiveOption, setCancellationRemarksActiveOption] = useState('option1');
  const [cancellationRemarksOption1, setCancellationRemarksOption1] = useState('');
  const [cancellationRemarksOption2, setCancellationRemarksOption2] = useState('');

  // Dropdowns
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // BASIC DETAILS
  const [formData, setFormData] = useState({
    tour_code: '',
    tour_type: "sports",
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
    departure_description: "",
    departure_description_option1: "",
    departure_description_option2: "",
    instruction_description: "",
    instruction_description_option1: "",
    instruction_description_option2: ""
  });

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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageCaption, setImageCaption] = useState('');

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

  useEffect(() => {
    if (!isEditMode) {
      // Prefill content for Option 1 and Option 2
      
      // Departures Description
      setDepartureOption1("Standard departure with regular transfers and shared sightseeing. Departure dates are fixed and subject to minimum group size of 6 persons. Check-in time 12 PM and check-out time 10 AM.");
      setDepartureOption2("Premium departure with private transfers and exclusive sightseeing. Flexible departure dates available for minimum 2 persons. Early check-in and late check-out available on request.");
      
      // Instructions
      setInstructionOption1("Please carry valid ID proof. Reporting time is 2 hours before departure. Carry comfortable clothing and walking shoes. Follow the itinerary timings strictly.");
      setInstructionOption2("Passport required for international travel. Visa assistance available. Travel insurance is mandatory. Medical fitness certificate required for adventure activities.");
      
      // Cost Remarks
      setCostRemarksOption1("Please note that while the tour price has been indicated, it may vary if you choose dates closer to departure or during periods when the season transitions from low to high. Child pricing is calculated based on the standard hotel category.");
      setCostRemarksOption2("Premium package includes all taxes and surcharges. Price guaranteed for next 30 days. Early bird discount available for bookings made 60 days in advance. Group discount applicable for 10+ persons.");
      
      // Optional Tour Remarks
      setOptionalTourRemarksOption1("Optional tours are subject to availability and weather conditions. Prices are per person. Minimum 4 persons required for each optional tour. Book at least 2 days in advance.");
      setOptionalTourRemarksOption2("Exclusive optional tours with private guide. Flexible timing available. Includes lunch and entry fees. Priority access to attractions. Cancel 24 hours before for full refund.");
      
      // EMI Remarks
      setEmiRemarksOption1("EMI options available with 18% interest rate. Processing fee of 2% applicable. Terms and conditions apply. Credit cards from all major banks accepted.");
      setEmiRemarksOption2("No cost EMI available on select credit cards. Zero processing fee for limited period. Flexible tenure up to 36 months. Contact bank for pre-approved offers.");
      
      // Flight Remarks
      setFlightRemarksOption1("Flight prices are indicative and subject to change at the time of booking. Airline and timing subject to availability. Baggage allowance as per airline policy.");
      setFlightRemarksOption2("Guaranteed lowest airfare. Flexible cancellation up to 24 hours. Priority boarding and extra baggage included. Seat selection available complimentary.");
      
      // Hotel Remarks
      setHotelRemarksOption1("Hotel categories are subject to availability. Standard, Deluxe, and Executive categories based on room types and amenities. Early check-in subject to availability.");
      setHotelRemarksOption2("Premium hotel collection with guaranteed upgrades. Welcome drinks and late checkout included. Complimentary breakfast and airport transfers. Best rate guarantee.");
      
      // Booking Policy Remarks
      setBookingPoiRemarksOption1("Booking amount is non-refundable. Balance payment to be made as per the payment schedule. 50% payment required 30 days before departure.");
      setBookingPoiRemarksOption2("Flexible booking policy with free cancellation up to 15 days. Pay only 10% to book. Zero cancellation charges for COVID-related issues.");
      
      // Cancellation Remarks
      setCancellationRemarksOption1("Cancellation charges apply as per the policy mentioned above. No refunds for no-shows. 50% refund for cancellations made 30 days before departure.");
      setCancellationRemarksOption2("Full refund for cancellations 45+ days before departure. 75% refund for 30-44 days. 50% refund for 15-29 days. Travel credit available instead of refund.");

      // Set default active options
      setDepartureActiveOption('option1');
      setInstructionActiveOption('option1');
      setCostRemarksActiveOption('option1');
      setOptionalTourRemarksActiveOption('option1');
      setEmiRemarksActiveOption('option1');
      setFlightRemarksActiveOption('option1');
      setHotelRemarksActiveOption('option1');
      setBookingPoiRemarksActiveOption('option1');
      setCancellationRemarksActiveOption('option1');

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
    description: ''
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

  // IMAGES
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);

  // ========================
  // EDIT FUNCTIONS - FIXED
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

  // ========================
  // ADD FUNCTIONS - FIXED
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

  const handleAddDeparture = () => {
    const currentDescription = departureActiveOption === 'option1' ? departureOption1 : departureOption2;
    
    if (!currentDescription.trim()) return;
    
    const newItem = { 
      ...departureForm, 
      description: currentDescription,
      description_option: departureActiveOption
    };
    
    if (editingType === 'departure' && editIndex !== -1) {
      const updated = [...departures];
      updated[editIndex] = newItem;
      setDepartures(updated);
    } else {
      setDepartures(prev => [...prev, newItem]);
    }

    setDepartureForm({
      departure_date: '',
      return_date: '',
      adult_price: '',
      child_price: '',
      infant_price: '',
      description: '',
      total_seats: ''
    });
    resetEditing();
  };

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
    if (!hotelItem.city.trim()) return;
    
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
      updated[editIndex] = { description: transportItem.description.trim() };
      setTransports(updated);
    } else {
      setTransports(prev => [...prev, { description: transportItem.description.trim() }]);
    }

    setTransportItem({ description: '' });
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

  const addInstruction = () => {
    const currentInstruction = instructionActiveOption === 'option1' ? instructionOption1 : instructionOption2;
    const txt = currentInstruction.trim();
    if (!txt) return;
    
    if (editingType === 'instruction' && editIndex !== -1) {
      const updated = [...instructions];
      updated[editIndex] = txt;
      setInstructions(updated);
    } else {
      setInstructions(prev => [...prev, txt]);
    }
    
    setInstructionText('');
    resetEditing();
  };

  const resetEditing = () => {
    setEditingItem(null);
    setEditingType('');
    setEditIndex(-1);
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

  // Handlers for Cost Remarks with option tabs
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

  // Handlers for Optional Tour Remarks with option tabs
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

  // Handlers for EMI Remarks with option tabs
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

  // Handlers for Flight Remarks with option tabs
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

  // Handlers for Hotel Remarks with option tabs
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

  // Handlers for Booking Policy Remarks with option tabs
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

  // Handlers for Cancellation Remarks with option tabs
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

  // Handlers for Departure Description with option tabs
  const handleDepartureDescriptionOptionChange = (option, value) => {
    if (option === 'option1') {
      setDepartureOption1(value);
    } else {
      setDepartureOption2(value);
    }
  };

  // Handlers for Instructions with option tabs
  const handleInstructionOptionChange = (option, value) => {
    if (option === 'option1') {
      setInstructionOption1(value);
    } else {
      setInstructionOption2(value);
    }
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

  // IMAGES
  const handleImageChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);
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
          const tourCodeRes = await fetch(`${baseurl}/api/tours/next-tour-code?tour_type=sports`);
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

  const loadTourData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/tours/tour/full/sports/${id}`);
      if (!response.ok) throw new Error('Failed to fetch tour data');
      
      const data = await response.json();
      
      if (data.success) {
        const basic = data.basic_details;
        
        // Load all remarks with both options from child tables
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
        
        let departureDescValue = '';
        let departureDescOpt1 = '';
        let departureDescOpt2 = '';
        let departureDescActive = 'option1';
        
        if (data.departures && data.departures.length > 0) {
          const firstDeparture = data.departures[0];
          departureDescValue = firstDeparture.description || '';
          departureDescOpt1 = firstDeparture.description_option1 || '';
          departureDescOpt2 = firstDeparture.description_option2 || '';
          departureDescActive = firstDeparture.description_active || 'option1';
        }
        
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
        
        setCostRemarksOption1(costRemarksOpt1 || costRemarksValue);
        setCostRemarksOption2(costRemarksOpt2 || costRemarksValue);
        setCostRemarksActiveOption(costRemarksActive);
        
        setHotelRemarksOption1(hotelRemarksOpt1 || hotelRemarksValue);
        setHotelRemarksOption2(hotelRemarksOpt2 || hotelRemarksValue);
        setHotelRemarksActiveOption(hotelRemarksActive);
        
        setFlightRemarksOption1(transportRemarksOpt1 || transportRemarksValue);
        setFlightRemarksOption2(transportRemarksOpt2 || transportRemarksValue);
        setFlightRemarksActiveOption(transportRemarksActive);
        
        setEmiRemarksOption1(emiRemarksOpt1 || emiRemarksValue);
        setEmiRemarksOption2(emiRemarksOpt2 || emiRemarksValue);
        setEmiRemarksActiveOption(emiRemarksActive);
        
        setBookingPoiRemarksOption1(bookingRemarksOpt1 || bookingRemarksValue);
        setBookingPoiRemarksOption2(bookingRemarksOpt2 || bookingRemarksValue);
        setBookingPoiRemarksActiveOption(bookingRemarksActive);
        
        setCancellationRemarksOption1(cancellationRemarksOpt1 || cancellationRemarksValue);
        setCancellationRemarksOption2(cancellationRemarksOpt2 || cancellationRemarksValue);
        setCancellationRemarksActiveOption(cancellationRemarksActive);
        
        setOptionalTourRemarksOption1(optionalRemarksOpt1 || optionalRemarksValue);
        setOptionalTourRemarksOption2(optionalRemarksOpt2 || optionalRemarksValue);
        setOptionalTourRemarksActiveOption(optionalRemarksActive);
        
        setDepartureOption1(departureDescOpt1 || departureDescValue);
        setDepartureOption2(departureDescOpt2 || departureDescValue);
        setDepartureActiveOption(departureDescActive);
        
        setInstructionOption1(instructionDescOpt1 || instructionDescValue);
        setInstructionOption2(instructionDescOpt2 || instructionDescValue);
        setInstructionActiveOption(instructionDescActive);
        
        setFormData({
          tour_code: basic.tour_code || '',
          tour_type: basic.tour_type || 'sports',
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
          departure_description: departureDescValue,
          departure_description_option1: departureDescOpt1 || departureDescValue,
          departure_description_option2: departureDescOpt2 || departureDescValue,
          instruction_description: instructionDescValue,
          instruction_description_option1: instructionDescOpt1 || instructionDescValue,
          instruction_description_option2: instructionDescOpt2 || instructionDescValue
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

        if (data.departures && Array.isArray(data.departures)) {
          const formattedDepartures = data.departures.map(dept => ({
            departure_date: dept.departure_date || '',
            return_date: dept.return_date || '',
            adult_price: dept.adult_price || '',
            child_price: dept.child_price || '',
            infant_price: dept.infant_price || '',
            description: dept.description || '',
            description_option1: dept.description_option1 || '',
            description_option2: dept.description_option2 || '',
            description_active: dept.description_active || 'option1',
            total_seats: dept.total_seats || ''
          }));
          setDepartures(formattedDepartures);
        }

        if (data.inclusions && Array.isArray(data.inclusions)) {
          const inclusionItems = data.inclusions.map(inc => inc.item);
          setInclusions(inclusionItems);
        }

        if (data.exclusions && Array.isArray(data.exclusions)) {
          const exclusionItems = data.exclusions.map(exc => exc.item);
          setExclusions(exclusionItems);
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
              emi: existingOption.emi || '',
              emi_remarks: existingOption.emi_remarks || '',
              emi_remarks_option1: existingOption.emi_remarks_option1 || '',
              emi_remarks_option2: existingOption.emi_remarks_option2 || '',
              emi_remarks_active: existingOption.emi_remarks_active || 'option1'
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
            executive_hotel_name: hotel.executive_hotel_name || '',
            hotel_remarks: hotel.hotel_remarks || '',
            hotel_remarks_option1: hotel.hotel_remarks_option1 || '',
            hotel_remarks_option2: hotel.hotel_remarks_option2 || '',
            hotel_remarks_active: hotel.hotel_remarks_active || 'option1'
          }));
          setHotelRows(formattedHotels);
        }

        if (data.transport && Array.isArray(data.transport)) {
          const formattedTransports = data.transport.map(t => ({
            description: t.description || '',
            flight_remarks: t.flight_remarks || '',
            flight_remarks_option1: t.flight_remarks_option1 || '',
            flight_remarks_option2: t.flight_remarks_option2 || '',
            flight_remarks_active: t.flight_remarks_active || 'option1'
          }));
          setTransports(formattedTransports);
        }

        if (data.booking_poi && Array.isArray(data.booking_poi)) {
          const formattedPois = data.booking_poi.map(poi => ({
            item: poi.item,
            amount_details: poi.amount_details || '',
            booking_remarks: poi.booking_remarks || '',
            booking_remarks_option1: poi.booking_remarks_option1 || '',
            booking_remarks_option2: poi.booking_remarks_option2 || '',
            booking_remarks_active: poi.booking_remarks_active || 'option1'
          }));
          setBookingPois(formattedPois);
        }

        if (data.cancellation_policies && Array.isArray(data.cancellation_policies)) {
          const formattedPolicies = data.cancellation_policies.map(policy => ({
            cancellation_policy: policy.cancellation_policy,
            charges: policy.charges || '',
            cancellation_remarks: policy.cancellation_remarks || '',
            cancellation_remarks_option1: policy.cancellation_remarks_option1 || '',
            cancellation_remarks_option2: policy.cancellation_remarks_option2 || '',
            cancellation_remarks_active: policy.cancellation_remarks_active || 'option1'
          }));
          setCancelPolicies(formattedPolicies);
        }

        if (data.instructions && Array.isArray(data.instructions)) {
          const formattedInstructions = data.instructions.map(inst => ({
            item: inst.item,
            item_option1: inst.item_option1 || '',
            item_option2: inst.item_option2 || '',
            item_active: inst.item_active || 'option1'
          }));
          setInstructions(formattedInstructions.map(inst => inst.item));
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
    navigate('/sports-tours');
  };

  const isLastTab = activeTab === TAB_LIST[TAB_LIST.length - 1];

  // ========================
  // SAVE FUNCTIONS
  // ========================

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
        tour_type: formData.tour_type || 'sports',
        primary_destination_id: formData.primary_destination_id,
        duration_days: Number(formData.duration_days) || 0,
        overview: formData.overview || '',
        base_price_adult: Number(formData.base_price_adult) || 0,
        emi_price: formData.emi_price ? Number(formData.emi_price) : null,
        is_international: Number(formData.is_international) || 0,
        status: 1,
        cost_remarks_active: costRemarksActiveOption,
        hotel_remarks_active: hotelRemarksActiveOption,
        transport_remarks_active: flightRemarksActiveOption,
        emi_remarks_active: emiRemarksActiveOption,
        booking_poi_remarks_active: bookingPoiRemarksActiveOption,
        cancellation_remarks_active: cancellationRemarksActiveOption,
        optional_tour_remarks_active: optionalTourRemarksActiveOption,
        departure_description_active: departureActiveOption,
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
        departure_description_option1: departureOption1,
        departure_description_option2: departureOption2,
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
          tour_type: 'Sports',
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
      setTimeout(() => navigate('/sports-tours'), 1500);
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
        tour_type: formData.tour_type || 'sports',
        primary_destination_id: formData.primary_destination_id,
        duration_days: Number(formData.duration_days) || 0,
        overview: formData.overview || '',
        base_price_adult: Number(formData.base_price_adult) || 0,
        emi_price: formData.emi_price ? Number(formData.emi_price) : null,
        is_international: Number(formData.is_international) || 0,
        cost_remarks_active: costRemarksActiveOption,
        hotel_remarks_active: hotelRemarksActiveOption,
        transport_remarks_active: flightRemarksActiveOption,
        emi_remarks_active: emiRemarksActiveOption,
        booking_poi_remarks_active: bookingPoiRemarksActiveOption,
        cancellation_remarks_active: cancellationRemarksActiveOption,
        optional_tour_remarks_active: optionalTourRemarksActiveOption,
        departure_description_active: departureActiveOption,
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
        departure_description_option1: departureOption1,
        departure_description_option2: departureOption2,
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
          tour_type: 'Sports',
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
      } else {
        const validEmiOptions = emiOptions.filter(opt =>
          opt.loan_amount && opt.loan_amount > 0 && opt.emi && opt.emi > 0
        );
        if (validEmiOptions.length > 0) {
          const emiWithBothOptions = validEmiOptions.map(opt => ({
            ...opt,
            emi_remarks: emiRemarksActiveOption === 'option1' ? emiRemarksOption1 : emiRemarksOption2,
            emi_remarks_option1: emiRemarksOption1,
            emi_remarks_option2: emiRemarksOption2,
            emi_remarks_active: emiRemarksActiveOption
          }));
          await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tour_id: id, emi_options: emiWithBothOptions })
          });
        }
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
      setTimeout(() => navigate('/sports-tours'), 1500);
    } catch (err) {
      console.error('Error updating tour:', err);
      setError(err.message || 'Failed to update tour');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (replacementPreview && replacementPreview.startsWith('blob:')) {
        URL.revokeObjectURL(replacementPreview);
      }
    };
  }, [replacementPreview]);

  const handleSaveClick = () => {
    if (isLastTab) {
      const confirmMessage = isEditMode 
        ? 'Are you sure you want to update this sports tour with all changes?' 
        : 'Are you sure you want to save this sports tour with all data?';
      
      const confirmed = window.confirm(confirmMessage);
      
      if (confirmed) {
        if (isEditMode) {
          updateTour();
        } else {
          createTour();
        }
      }
    } else {
      const tabNames = {
        'basic': 'Basic Details',
        'itineraries': 'Itineraries',
        'departures': 'Departures',
        'costs': 'Tour Cost',
        'optionalTours': 'Optional Tours',
        'emiOptions': 'EMI Options',
        'inclusions': 'Inclusions',
        'exclusions': 'Exclusions',
        'transport': 'Flights',
        'hotels': 'Hotels',
        'bookingPoi': 'Booking POI',
        'cancellation': 'Cancellation Policy',
        'instructions': 'Instructions',
        'images': 'Images'
      };
      
      const currentTabName = tabNames[activeTab] || activeTab;
      const nextTabIndex = TAB_LIST.indexOf(activeTab) + 1;
      const nextTabName = nextTabIndex < TAB_LIST.length ? tabNames[TAB_LIST[nextTabIndex]] : 'Next';
      
      const confirmed = window.confirm(
        `Do you want to save the ${currentTabName} data and continue to ${nextTabName}?`
      );
      
      if (confirmed) {
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
        return { 
          label: editingType === 'departure' ? 'Update Departure' : '+ Add Departure', 
          onClick: handleAddDeparture 
        };
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
        return { 
          label: editingType === 'instruction' ? 'Update Instruction' : '+ Add Instruction', 
          onClick: addInstruction 
        };
      default:
        return null;
    }
  };

  const addConfig = getAddConfigForTab(activeTab);

  const OptionTabs = ({ activeOption, onOptionChange, option1Value, option2Value, onOption1Change, onOption2Change, placeholder }) => (
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

  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">{isEditMode ? 'Edit Sports Tour' : 'Add Sports Tour'}</h2>

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
            {loading ? 'Saving...' : isLastTab ? (isEditMode ? 'Update All' : 'Save All') : 'Save & Continue'}
          </Button>
        </div>

        <Card className="content-card">
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

              <Tab eventKey="departures" title="Departures">
                <Form.Group className="mb-3">
                  <Form.Label>Departures Description</Form.Label>
                  <OptionTabs
                    activeOption={departureActiveOption}
                    onOptionChange={setDepartureActiveOption}
                    option1Value={departureOption1}
                    option2Value={departureOption2}
                    onOption1Change={(val) => handleDepartureDescriptionOptionChange('option1', val)}
                    onOption2Change={(val) => handleDepartureDescriptionOptionChange('option2', val)}
                    placeholder="Enter departure description for Option 1"
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
                    
                    {emiLoanAmount && emiLoanAmount > 0 && (
                      <Alert variant="info" className="mt-3">
                        <strong>Note:</strong> EMI values are automatically calculated based on the loan amount 
                        and interest rate. All EMI options will use the same loan amount of ₹{emiLoanAmount} 
                        with {emiInterestRate}% annual interest rate.
                      </Alert>
                    )}
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

              <Tab eventKey="transport" title="Flights">
                <Row className="mt-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Flight Details</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={transportItem.description}
                        onChange={handleTransportChange}
                        placeholder="Enter flight details here..."
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
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

              <Tab eventKey="instructions" title="Instructions">
                <Form.Group className="mb-3">
                  <Form.Label>Add Instruction</Form.Label>
                  <OptionTabs
                    activeOption={instructionActiveOption}
                    onOptionChange={setInstructionActiveOption}
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

export default AddSportsTour;