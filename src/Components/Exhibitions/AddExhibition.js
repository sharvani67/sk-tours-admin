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
  Spinner
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import { Pencil, Trash } from 'react-bootstrap-icons';

const AddExhibitionDetails = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const isEditMode = !!id && id !== 'new';
  const isInternational = type === 'international';

  // Build TAB_LIST based on exhibition type
  const TAB_LIST = isInternational ? [
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
    'visa', // Visa tab for international
    'bookingPoi',
    'cancellation',
    'instructions',
    'images'
  ] : [
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
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  // BASIC DETAILS
  const [formData, setFormData] = useState({
    exhibition_name: '',
    exhibition_type: type || 'domestic',
    overview: '',
    duration_days: '',
    base_price_adult: '',
    emi_price: '',
    cost_remarks: '',
    hotel_remarks: '',
    transport_remarks: '',
    booking_poi_remarks: '',
    cancellation_remarks: '',
    emi_remarks: '',
    optional_tour_remarks: ''
  });

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

  // DEPARTURES
  const [departureForm, setDepartureForm] = useState({
    description: ''
  });
  const [departures, setDepartures] = useState([]);

  // TOUR COSTS
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

  // INCLUSIONS & EXCLUSIONS
  const [inclusionText, setInclusionText] = useState('');
  const [inclusions, setInclusions] = useState([]);
  const [exclusionText, setExclusionText] = useState('');
  const [exclusions, setExclusions] = useState([]);

  // TRANSPORT
  const [transportItem, setTransportItem] = useState({
    description: ''
  });
  const [transports, setTransports] = useState([]);

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

  // VISA SECTION (Only for International)
  const [activeVisaSubTab, setActiveVisaSubTab] = useState('tourist');
  const visaSubTabs = ['tourist', 'transit', 'business', 'form', 'photo', 'fees', 'submission'];
  
  // Tourist Visa
  const [touristVisaItems, setTouristVisaItems] = useState([]);
  const [touristVisaForm, setTouristVisaForm] = useState({ description: '' });
  
  // Transit Visa
  const [transitVisaItems, setTransitVisaItems] = useState([]);
  const [transitVisaForm, setTransitVisaForm] = useState({ description: '' });
  
  // Business Visa
  const [businessVisaItems, setBusinessVisaItems] = useState([]);
  const [businessVisaForm, setBusinessVisaForm] = useState({ description: '' });
  
  // Visa Form
  const [visaFormItems, setVisaFormItems] = useState([]);
  const [touristVisaRemarks, setTouristVisaRemarks] = useState('');
  const [editingVisaFormIndex, setEditingVisaFormIndex] = useState(null);
  const [visaFormEditData, setVisaFormEditData] = useState({
    type: '',
    download_action: '',
    fill_action: '',
    action1_file: null,
    action2_file: null
  });
  
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
  
  const [extendableRow, setExtendableRow] = useState({
    type: 'Extendable as per requirement',
    tourist: '',
    transit: '',
    business: '',
    tourist_charges: '',
    transit_charges: '',
    business_charges: ''
  });
  
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

  // BOOKING POI
  const [poiText, setPoiText] = useState('');
  const [poiAmount, setPoiAmount] = useState('');
  const [bookingPois, setBookingPois] = useState([]);

  // CANCELLATION
  const [cancelItem, setCancelItem] = useState({
    cancellation_policy: '',
    charges: ''
  });
  const [cancelPolicies, setCancelPolicies] = useState([]);

  // INSTRUCTIONS
  const [instructionText, setInstructionText] = useState('');
  const [instructions, setInstructions] = useState([]);

  // IMAGES
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);

  // Calculate EMI
  const calculateEMI = (loanAmount, months, interestRate = 18) => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = (interestRate / 100) / 12;
    const n = parseInt(months, 10);
    
    if (isNaN(principal) || principal <= 0 || isNaN(n) || n <= 0) return 0;
    
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / 
                (Math.pow(1 + monthlyRate, n) - 1);
    
    return Math.round(emi * 100) / 100;
  };

  // ========================
  // VISA FUNCTIONS
  // ========================
  
  const getFileUrl = (fileName) => {
    if (!fileName || typeof fileName !== 'string') return null;
    if (fileName.startsWith('http')) return fileName;
    if (fileName.startsWith('/uploads/')) return `${baseurl}${fileName}`;
     if (fileName.startsWith('/uploads/exhibition/visa/')) return `${baseurl}${fileName}`;
  if (fileName.startsWith('/uploads/exhibition/')) return `${baseurl}${fileName}`;

    return `${baseurl}/uploads/exhibition/visa/${fileName}`;
  };
  
 const openFileInNewTab = (url) => {
  if (url) {
    console.log('Opening file URL:', url); // Add this for debugging
    window.open(url, '_blank');
  }
};


  const handleVisaFormFileChange = (index, action, file) => {
    if (!file) return;
    const updated = [...visaFormItems];
    if (action === 'action1') {
      updated[index].action1_file = file;
    } else {
      updated[index].action2_file = file;
    }
    setVisaFormItems(updated);
  };
  
  const addTouristVisa = () => {
    const trimmed = touristVisaForm.description.trim();
    if (!trimmed) return;
    
    if (editingType === 'touristVisa' && editIndex !== -1) {
      const updated = [...touristVisaItems];
      updated[editIndex] = { description: trimmed };
      setTouristVisaItems(updated);
    } else {
      setTouristVisaItems(prev => [...prev, { description: trimmed }]);
    }
    
    setTouristVisaForm({ description: '' });
    resetEditing();
  };
  
  const editTouristVisa = (idx) => {
    const item = touristVisaItems[idx];
    setTouristVisaForm({ description: item.description });
    setEditingItem(item);
    setEditingType('touristVisa');
    setEditIndex(idx);
  };
  
  const removeTouristVisa = (idx) => {
    if (window.confirm('Are you sure you want to remove this tourist visa item?')) {
      setTouristVisaItems(prev => prev.filter((_, i) => i !== idx));
    }
  };
  
  const addTransitVisa = () => {
    const trimmed = transitVisaForm.description.trim();
    if (!trimmed) return;
    
    if (editingType === 'transitVisa' && editIndex !== -1) {
      const updated = [...transitVisaItems];
      updated[editIndex] = { description: trimmed };
      setTransitVisaItems(updated);
    } else {
      setTransitVisaItems(prev => [...prev, { description: trimmed }]);
    }
    
    setTransitVisaForm({ description: '' });
    resetEditing();
  };
  
  const editTransitVisa = (idx) => {
    const item = transitVisaItems[idx];
    setTransitVisaForm({ description: item.description });
    setEditingItem(item);
    setEditingType('transitVisa');
    setEditIndex(idx);
  };
  
  const removeTransitVisa = (idx) => {
    if (window.confirm('Are you sure you want to remove this transit visa item?')) {
      setTransitVisaItems(prev => prev.filter((_, i) => i !== idx));
    }
  };
  
  const addBusinessVisa = () => {
    const trimmed = businessVisaForm.description.trim();
    if (!trimmed) return;
    
    if (editingType === 'businessVisa' && editIndex !== -1) {
      const updated = [...businessVisaItems];
      updated[editIndex] = { description: trimmed };
      setBusinessVisaItems(updated);
    } else {
      setBusinessVisaItems(prev => [...prev, { description: trimmed }]);
    }
    
    setBusinessVisaForm({ description: '' });
    resetEditing();
  };
  
  const editBusinessVisa = (idx) => {
    const item = businessVisaItems[idx];
    setBusinessVisaForm({ description: item.description });
    setEditingItem(item);
    setEditingType('businessVisa');
    setEditIndex(idx);
  };
  
  const removeBusinessVisa = (idx) => {
    if (window.confirm('Are you sure you want to remove this business visa item?')) {
      setBusinessVisaItems(prev => prev.filter((_, i) => i !== idx));
    }
  };
  
  const addPhoto = () => {
    const trimmed = photoForm.description.trim();
    if (!trimmed) return;
    
    if (editingType === 'photo' && editIndex !== -1) {
      const updated = [...photoItems];
      updated[editIndex] = { description: trimmed };
      setPhotoItems(updated);
    } else {
      setPhotoItems(prev => [...prev, { description: trimmed }]);
    }
    
    setPhotoForm({ description: '' });
    resetEditing();
  };
  
  const editPhoto = (idx) => {
    const item = photoItems[idx];
    setPhotoForm({ description: item.description });
    setEditingItem(item);
    setEditingType('photo');
    setEditIndex(idx);
  };
  
  const removePhoto = (idx) => {
    if (window.confirm('Are you sure you want to remove this photo item?')) {
      setPhotoItems(prev => prev.filter((_, i) => i !== idx));
    }
  };
  
  const addFreeFlowPhotoEntry = () => {
    const trimmed = freeFlowPhotoText.trim();
    if (!trimmed) return;
    
    if (editingType === 'freeFlowPhoto' && editIndex !== -1) {
      const updated = [...freeFlowPhotoEntries];
      updated[editIndex] = { description: trimmed };
      setFreeFlowPhotoEntries(updated);
    } else {
      setFreeFlowPhotoEntries(prev => [...prev, { description: trimmed }]);
    }
    
    setFreeFlowPhotoText('');
    resetEditing();
  };
  
  const editFreeFlowPhotoEntry = (idx) => {
    const item = freeFlowPhotoEntries[idx];
    setFreeFlowPhotoText(item.description);
    setEditingItem(item);
    setEditingType('freeFlowPhoto');
    setEditIndex(idx);
  };
  
  const removeFreeFlowPhotoEntry = (idx) => {
    if (window.confirm('Are you sure you want to remove this photo entry?')) {
      setFreeFlowPhotoEntries(prev => prev.filter((_, i) => i !== idx));
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
  
  const removeVisaFeesRow = (id) => {
    if (window.confirm('Are you sure you want to remove this visa fee row?')) {
      setVisaFeesRows(visaFeesRows.filter(row => row.id !== id));
    }
  };
  
  const handleVisaFeesChange = (id, field, value) => {
    const updated = visaFeesRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    );
    setVisaFeesRows(updated);
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
  
  const removeSubmissionRow = (id) => {
    if (window.confirm('Are you sure you want to remove this submission row?')) {
      setSubmissionRows(submissionRows.filter(row => row.id !== id));
    }
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
  
  const handleTouristVisaRemarksChange = (e) => {
    setTouristVisaRemarks(e.target.value);
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
  
  const handleFreeFlowPhotoChange = (e) => {
    setFreeFlowPhotoText(e.target.value);
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
  
  const handleVisaFormEditChange = (e) => {
    const { name, value } = e.target;
    setVisaFormEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetVisaEditing = () => {
    setEditingItem(null);
    setEditingType('');
    setEditIndex(-1);
    setTouristVisaForm({ description: '' });
    setTransitVisaForm({ description: '' });
    setBusinessVisaForm({ description: '' });
    setPhotoForm({ description: '' });
    setFreeFlowPhotoText('');
  };

  // ========================
  // HANDLER FUNCTIONS
  // ========================

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoanAmountChange = (value) => {
    setEmiLoanAmount(value);
  };

  // Itinerary Functions
  const addItineraryDay = () => {
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

  const handleRemoveItinerary = (idx) => {
    if (window.confirm('Are you sure you want to remove this itinerary?')) {
      setItineraries(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleItineraryChange = (e) => {
    const { name, value } = e.target;
    setItineraryItem(prev => ({
      ...prev,
      [name]: name === 'day' ? value.replace(/[^0-9]/g, '') : value
    }));
  };

  const handleMealsCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setItineraryItem(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [name]: checked
      }
    }));
  };

  // Departure Functions
  const addDeparture = () => {
    if (!departureForm.description.trim()) return;
    
    const newItem = { description: departureForm.description.trim() };
    
    if (editingType === 'departure' && editIndex !== -1) {
      const updated = [...departures];
      updated[editIndex] = newItem;
      setDepartures(updated);
    } else {
      setDepartures(prev => [...prev, newItem]);
    }

    setDepartureForm({ description: '' });
    resetEditing();
  };

  const editDeparture = (idx) => {
    const departure = departures[idx];
    setDepartureForm({ description: departure.description || '' });
    setEditingItem(departure);
    setEditingType('departure');
    setEditIndex(idx);
  };

  const handleRemoveDeparture = (idx) => {
    if (window.confirm('Are you sure you want to remove this departure?')) {
      setDepartures(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleDepartureChange = (e) => {
    const { name, value } = e.target;
    setDepartureForm(prev => ({ ...prev, [name]: value }));
  };

  // Tour Cost Functions
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

  const editCostRow = (idx) => {
    const item = tourCosts[idx];
    setTourCostItem(item);
    setEditingItem(item);
    setEditingType('cost');
    setEditIndex(idx);
  };

  const removeCostRow = (idx) => {
    if (window.confirm('Are you sure you want to remove this cost row?')) {
      setTourCosts(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleCostChange = (e) => {
    const { name, value } = e.target;
    setTourCostItem(prev => ({ ...prev, [name]: value }));
  };

  // Optional Tour Functions
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

  const editOptionalTourRow = (idx) => {
    const item = optionalTours[idx];
    setOptionalTourItem(item);
    setEditingItem(item);
    setEditingType('optionalTour');
    setEditIndex(idx);
  };

  const removeOptionalTourRow = (idx) => {
    if (window.confirm('Are you sure you want to remove this optional tour?')) {
      setOptionalTours(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleOptionalTourChange = (e) => {
    const { name, value } = e.target;
    setOptionalTourItem(prev => ({ ...prev, [name]: value }));
  };

  // Inclusion Functions
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

  const editInclusion = (idx) => {
    const inclusion = inclusions[idx];
    setInclusionText(inclusion);
    setEditingItem(inclusion);
    setEditingType('inclusion');
    setEditIndex(idx);
  };

  const handleRemoveInclusion = (idx) => {
    if (window.confirm('Are you sure you want to remove this inclusion?')) {
      setInclusions(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Exclusion Functions
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

  const editExclusion = (idx) => {
    const exclusion = exclusions[idx];
    setExclusionText(exclusion);
    setEditingItem(exclusion);
    setEditingType('exclusion');
    setEditIndex(idx);
  };

  const handleRemoveExclusion = (idx) => {
    if (window.confirm('Are you sure you want to remove this exclusion?')) {
      setExclusions(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Transport Functions
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

  const editTransportRow = (idx) => {
    const item = transports[idx];
    setTransportItem({ description: item.description || '' });
    setEditingItem(item);
    setEditingType('transport');
    setEditIndex(idx);
  };

  const removeTransportRow = (idx) => {
    if (window.confirm('Are you sure you want to remove this transport?')) {
      setTransports(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleTransportChange = (e) => {
    const { name, value } = e.target;
    setTransportItem(prev => ({ ...prev, [name]: value }));
  };

  // Hotel Functions
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

  const editHotelRow = (idx) => {
    const item = hotelRows[idx];
    setHotelItem(item);
    setEditingItem(item);
    setEditingType('hotel');
    setEditIndex(idx);
  };

  const removeHotelRow = (idx) => {
    if (window.confirm('Are you sure you want to remove this hotel?')) {
      setHotelRows(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelItem(prev => ({ ...prev, [name]: value }));
  };

  // Booking POI Functions
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
    setPoiAmount('');
    resetEditing();
  };

  const editPoi = (idx) => {
    const poi = bookingPois[idx];
    setPoiText(poi.item);
    setPoiAmount(poi.amount_details || '');
    setEditingItem(poi);
    setEditingType('poi');
    setEditIndex(idx);
  };

  const removePoi = (idx) => {
    if (window.confirm('Are you sure you want to remove this booking policy?')) {
      setBookingPois(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Cancellation Functions
  const addCancelRow = () => {
    if (!cancelItem.cancellation_policy.trim()) return;
    
    if (editingType === 'cancellation' && editIndex !== -1) {
      const updated = [...cancelPolicies];
      updated[editIndex] = { ...cancelItem };
      setCancelPolicies(updated);
    } else {
      setCancelPolicies(prev => [...prev, { ...cancelItem }]);
    }
    
    setCancelItem({ cancellation_policy: '', charges: '' });
    resetEditing();
  };

  const editCancelRow = (idx) => {
    const policy = cancelPolicies[idx];
    setCancelItem(policy);
    setEditingItem(policy);
    setEditingType('cancellation');
    setEditIndex(idx);
  };

  const removeCancelRow = (idx) => {
    if (window.confirm('Are you sure you want to remove this cancellation policy?')) {
      setCancelPolicies(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleCancelChange = (e) => {
    const { name, value } = e.target;
    setCancelItem(prev => ({ ...prev, [name]: value }));
  };

  // Instruction Functions
  const addInstruction = () => {
    const txt = instructionText.trim();
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

  const editInstruction = (idx) => {
    const instruction = instructions[idx];
    setInstructionText(instruction);
    setEditingItem(instruction);
    setEditingType('instruction');
    setEditIndex(idx);
  };

  const removeInstruction = (idx) => {
    if (window.confirm('Are you sure you want to remove this instruction?')) {
      setInstructions(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Image Functions
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
      
      const deleteResponse = await fetch(`${baseurl}/api/exhibitions/exhibition-images/${imageId}`, {
        method: 'DELETE'
      });
      
      if (!deleteResponse.ok) {
        throw new Error('Failed to delete old image');
      }

      const formData = new FormData();
      formData.append('images', replacementFile);
      
      const uploadResponse = await fetch(`${baseurl}/api/exhibitions/exhibition-images/upload/${id}`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload new image');
      }

      const imagesResponse = await fetch(`${baseurl}/api/exhibitions/exhibition-images/${id}`);
      const imagesData = await imagesResponse.json();
      setExistingImages(imagesData);
      
      setSuccess('Image updated successfully');
      cancelEditImage();
    } catch (err) {
      setError('Failed to update image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/exhibitions/exhibition-images/${imageId}`, {
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
      
      const response = await fetch(`${baseurl}/api/exhibitions/exhibition-images/cover/${imageId}`, {
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

  // Reset editing context
  const resetEditing = () => {
    setEditingItem(null);
    setEditingType('');
    setEditIndex(-1);
    resetVisaEditing();
  };

  // Navigation
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
    navigate('/exhibition');
  };

  const isLastTab = activeTab === TAB_LIST[TAB_LIST.length - 1];

  // ========================
  // EFFECTS HOOKS (MOVED HERE)
  // ========================
  
  // Update EMI when loan amount changes
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

  // Set default remarks for new exhibitions
  useEffect(() => {
    if (!isEditMode) {
      setFormData(prev => ({
        ...prev,
        cost_remarks: "Please note that while the exhibition price has been indicated, it may vary based on the season. We therefore kindly request you to confirm the final price before proceeding with your booking.",
        hotel_remarks: "Hotel categories are subject to availability. Standard, Deluxe, and Executive categories based on room types and amenities.",
        transport_remarks: "Transport arrangements are subject to availability and may change based on the final itinerary.",
        booking_poi_remarks: "Booking amount is non-refundable. Balance payment to be made as per the payment schedule.",
        cancellation_remarks: "Cancellation charges apply as per the policy mentioned above. No refunds for no-shows.",
        emi_remarks: "EMI options available with 18% interest rate. Terms and conditions apply.",
        optional_tour_remarks: "Optional tours are subject to availability and weather conditions. Prices are per person."
      }));

      if (bookingPois.length === 0) {
        setBookingPois([
          { item: "Per Person Booking Amount", amount_details: "" },
          { item: "30 Days Prior Per person cost", amount_details: "50% of the exhibition cost" },
          { item: "21 Days Prior Per person cost", amount_details: "Balance amount to pay" }
        ]);
      }

      if (cancelPolicies.length === 0) {
        setCancelPolicies([
          { cancellation_policy: "45 Days to 30 Days Cost per person", charges: "" },
          { cancellation_policy: "30 Days to 21 Days Cost per person", charges: "50% of exhibition cost" },
          { cancellation_policy: "21 Days till Departure date Cost per person", charges: "100% Cancellation applies" }
        ]);
      }

      // Set default visa remarks for international
      if (isInternational) {
        setTouristVisaRemarks(
          "Visa requirements are subject to change based on embassy regulations. " +
          "Processing time may vary. It is recommended to apply at least 3-4 weeks before departure. " +
          "All documents must be original and valid for at least 6 months from the date of return."
        );
      }
    }
  }, [isEditMode, isInternational]); // Dependencies added

  // Load exhibition data for editing
 // Load exhibition data for editing
const loadExhibitionData = async () => {
  try {
    setLoading(true);
    setError('');
    
    const endpoint = type === 'domestic' 
      ? `${baseurl}/api/exhibitions/domestic/${id}/details`
      : `${baseurl}/api/exhibitions/international/${id}/details`;
    
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch exhibition data');
    
    const result = await response.json();
    
    if (result.success && result.data) {
      const data = result.data;
      
      // Set basic form data from the first tour in the tours array
      if (data.tours && data.tours.length > 0) {
        const tour = data.tours[0];
        setFormData({
          exhibition_name: data.exhibition?.domestic_category_name || data.exhibition?.international_category_name || '',
          exhibition_type: type,
          overview: tour.overview || '',
          duration_days: tour.duration_days || '',
          base_price_adult: tour.base_price_adult || '',
          emi_price: tour.emi_price || '',
          cost_remarks: tour.cost_remarks || '',
          hotel_remarks: tour.hotel_remarks || '',
          transport_remarks: tour.transport_remarks || '',
          booking_poi_remarks: tour.booking_poi_remarks || '',
          cancellation_remarks: tour.cancellation_remarks || '',
          emi_remarks: tour.emi_remarks || '',
          optional_tour_remarks: tour.optional_tour_remarks || ''
        });
      }

      // Set itineraries
      if (data.itineraries && Array.isArray(data.itineraries)) {
        setItineraries(data.itineraries);
      }

      // Set departures
      if (data.departures && Array.isArray(data.departures)) {
        setDepartures(data.departures);
      }

      // Set tour costs
      if (data.costs && Array.isArray(data.costs)) {
        setTourCosts(data.costs);
      }

      // Set optional tours - FIXED: Use 'optionaltours' from API response
      if (data.optionaltours && Array.isArray(data.optionaltours)) {
        setOptionalTours(data.optionaltours);
      }

      // Set inclusions
      if (data.inclusions && Array.isArray(data.inclusions)) {
        setInclusions(data.inclusions.map(inc => inc.item || inc));
      }

      // Set exclusions
      if (data.exclusions && Array.isArray(data.exclusions)) {
        setExclusions(data.exclusions.map(exc => exc.item || exc));
      }

      // Set transports
      if (data.transports && Array.isArray(data.transports)) {
        setTransports(data.transports);
      }

      // Set hotels
      if (data.hotels && Array.isArray(data.hotels)) {
        setHotelRows(data.hotels);
      }

      // Set booking POIs - FIXED: Use 'bookingpoi' from API response
      if (data.bookingpoi && Array.isArray(data.bookingpoi)) {
        setBookingPois(data.bookingpoi);
      }

      // Set cancellation policies - FIXED: Use 'cancellationpolicies' from API response
      if (data.cancellationpolicies && Array.isArray(data.cancellationpolicies)) {
        setCancelPolicies(data.cancellationpolicies);
      }

      // Set instructions
      if (data.instructions && Array.isArray(data.instructions)) {
        setInstructions(data.instructions.map(inst => inst.item || inst));
      }

      // Set EMI options - FIXED: Use 'emioptions' from API response
      if (data.emioptions && Array.isArray(data.emioptions) && data.emioptions.length > 0) {
        setEmiOptions(data.emioptions);
        if (data.emioptions[0].loan_amount) {
          setEmiLoanAmount(data.emioptions[0].loan_amount);
        }
      }

      // Load Visa Data for International
      if (isInternational) {
        // Visa Details
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
        
        // Visa Forms
        if (data.visa_forms && Array.isArray(data.visa_forms)) {
          const formattedForms = data.visa_forms.map(form => ({
            type: form.visa_type,
            download_action: form.download_action,
            fill_action: form.fill_action,
            action1_file: form.action1_file,
            action2_file: form.action2_file,
                action1_file_url: form.action1_file ? `${baseurl}/uploads/exhibition/visa/${form.action1_file}` : null,
    action2_file_url: form.action2_file ? `${baseurl}/uploads/exhibition/visa/${form.action2_file}` : null
          }));
          setVisaFormItems(formattedForms);
          
          if (data.visa_forms.length > 0 && data.visa_forms[0].remarks) {
            setTouristVisaRemarks(data.visa_forms[0].remarks);
          }
        }
        
        // Visa Fees
        if (data.visa_fees && Array.isArray(data.visa_fees)) {
          const visaFeeRows = data.visa_fees.map((fee, index) => ({
            id: fee.fee_id || index + 1,
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
        
        // Submission Data
        if (data.visa_submission && Array.isArray(data.visa_submission)) {
          const submissionRowsData = data.visa_submission.map((item, index) => ({
            id: item.submission_id || index + 1,
            label: item.label || '',
            tourist: item.tourist || '',
            transit: item.transit || '',
            business: item.business || ''
          }));
          setSubmissionRows(submissionRowsData);
        }
      }

      // Set existing images
      try {
        const imagesResponse = await fetch(`${baseurl}/api/exhibitions/exhibition-images/${id}`);
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          const processedImages = imagesData.map(img => ({
            ...img,
            url: img.url.startsWith('http') ? img.url : `${baseurl}${img.url}`
          }));
          setExistingImages(processedImages);
        } else {
          setExistingImages([]);
        }
      } catch (imgErr) {
        console.error('Error loading images:', imgErr);
        setExistingImages([]);
      }

      setSuccess('Exhibition data loaded successfully');
    } else {
      throw new Error('Invalid data structure received from API');
    }
  } catch (err) {
    console.error('Error loading exhibition data:', err);
    setError('Failed to load exhibition data: ' + err.message);
  } finally {
    setLoading(false);
  }
};


// Add this function to upload visa files before saving
const uploadVisaFiles = async (visaFormItem, index, action) => {
  const file = visaFormItem[action === 'action1' ? 'action1_file' : 'action2_file'];
  if (!file || typeof file === 'string') return file; // Already a string (filename)
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${baseurl}/api/exhibitions/upload-visa-file`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    if (result.success) {
      return result.fileName;
    }
    throw new Error('Upload failed');
  } catch (err) {
    console.error('Error uploading file:', err);
    return null;
  }
};



  useEffect(() => {
    if (id && id !== 'new') {
      loadExhibitionData();
    }
  }, [id, type, isInternational]); // Added dependencies

  // Save Functions
 const saveExhibitionDetails = async () => {
  if (!formData.exhibition_name.trim()) {
    setError('Exhibition name is required');
    setActiveTab('basic');
    return;
  }

  try {
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      exhibition_name: formData.exhibition_name,
      duration_days: formData.duration_days,
      overview: formData.overview,
      base_price_adult: formData.base_price_adult,
      emi_price: formData.emi_price,
      cost_remarks: formData.cost_remarks,
      hotel_remarks: formData.hotel_remarks,
      transport_remarks: formData.transport_remarks,
      booking_poi_remarks: formData.booking_poi_remarks,
      cancellation_remarks: formData.cancellation_remarks,
      emi_remarks: formData.emi_remarks,
      optional_tour_remarks: formData.optional_tour_remarks,
      itineraries,
      departures,
      tour_costs: tourCosts,
      optional_tours: optionalTours,
      emi_options: emiOptions,
      emi_loan_amount: emiLoanAmount,
      emi_interest_rate: emiInterestRate,
      inclusions,
      exclusions,
      transports,
      hotels: hotelRows,
      booking_pois: bookingPois,
      cancellation_policies: cancelPolicies,
      instructions
    };

    // Add visa data for international
    if (isInternational) {
      // Upload visa files first
      const processedVisaForms = [];
      
      for (const form of visaFormItems) {
        const processedForm = { ...form };
        
        // Upload action1_file if it's a File object
        if (form.action1_file && typeof form.action1_file !== 'string' && form.action1_file instanceof File) {
          try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', form.action1_file);
            
            const uploadResponse = await fetch(`${baseurl}/api/exhibitions/upload-visa-file`, {
              method: 'POST',
              body: uploadFormData
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
              processedForm.action1_file = uploadResult.fileName;
            } else {
              console.error('Failed to upload action1 file');
              processedForm.action1_file = null;
            }
          } catch (err) {
            console.error('Error uploading action1 file:', err);
            processedForm.action1_file = null;
          }
        }
        
        // Upload action2_file if it's a File object
        if (form.action2_file && typeof form.action2_file !== 'string' && form.action2_file instanceof File) {
          try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', form.action2_file);
            
            const uploadResponse = await fetch(`${baseurl}/api/exhibitions/upload-visa-file`, {
              method: 'POST',
              body: uploadFormData
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
              processedForm.action2_file = uploadResult.fileName;
            } else {
              console.error('Failed to upload action2 file');
              processedForm.action2_file = null;
            }
          } catch (err) {
            console.error('Error uploading action2 file:', err);
            processedForm.action2_file = null;
          }
        }
        
        processedVisaForms.push(processedForm);
      }
      
      payload.visa_data = {
        tourist_visa: touristVisaItems,
        transit_visa: transitVisaItems,
        business_visa: businessVisaItems,
        visa_forms: processedVisaForms,
        photo: [...photoItems, ...freeFlowPhotoEntries],
        visa_fees: visaFeesRows,
        submission: submissionRows,
        tourist_visa_remarks: touristVisaRemarks
      };
    }

    const endpoint = type === 'domestic'
      ? `${baseurl}/api/exhibitions/domestic/${id}/details`
      : `${baseurl}/api/exhibitions/international/${id}/details`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Error saving details');
    }

    if (imageFiles.length > 0) {
      const formDataImages = new FormData();
      imageFiles.forEach((file) => {
        formDataImages.append('images', file);
      });
      
      const uploadResponse = await fetch(`${baseurl}/api/exhibitions/exhibition-images/upload/${id}`, {
        method: 'POST',
        body: formDataImages
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        setError('Details saved but images upload failed: ' + (uploadResult.error || 'Unknown error'));
      } else {
        setSuccess('Exhibition details and images saved successfully!');
      }
    } else {
      setSuccess('Exhibition details saved successfully!');
    }
    
    setTimeout(() => {
      navigate('/exhibition');
    }, 2000);
    
  } catch (err) {
    console.error('Error submitting form:', err);
    setError('Error submitting form: ' + err.message);
  } finally {
    setLoading(false);
  }
};

  const handleSaveClick = () => {
    if (isLastTab) {
      saveExhibitionDetails();
    } else {
      goNext();
    }
  };

  // Get Add Button Config
  const getAddConfigForTab = (tabKey) => {
    switch (tabKey) {
      case 'itineraries':
        return { 
          label: editingType === 'itinerary' ? 'Update Day' : '+ Add Day', 
          onClick: addItineraryDay 
        };
      case 'departures':
        return { 
          label: editingType === 'departure' ? 'Update Departure' : '+ Add Departure', 
          onClick: addDeparture 
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
          label: editingType === 'transport' ? 'Update Transport' : '+ Add Transport', 
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
        return { 
          label: editingType === 'instruction' ? 'Update Instruction' : '+ Add Instruction', 
          onClick: addInstruction 
        };
      default:
        return null;
    }
  };

  const addConfig = getAddConfigForTab(activeTab);

  // Check if we have an exhibition ID - MOVE THIS AFTER ALL HOOKS
  if (!id || id === 'new') {
    return (
      <Navbar>
        <Container>
          <Alert variant="warning" className="mt-4">
            <Alert.Heading>No Exhibition Selected</Alert.Heading>
            <p>Please go back and select an exhibition first.</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button onClick={() => navigate('/exhibition')} variant="primary">
                Go Back to Exhibitions
              </Button>
            </div>
          </Alert>
        </Container>
      </Navbar>
    );
  }

  if (loading && !success) {
    return (
      <Navbar>
        <Container className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading exhibition details...</p>
        </Container>
      </Navbar>
    );
  }


  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">{isEditMode ? 'Edit Exhibition Details' : 'Add Exhibition Details'}</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4 mb-4">
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={goBack} disabled={activeTab === 'basic' || loading}>
            Back
          </Button>
          {addConfig && (
            <Button variant="success" onClick={addConfig.onClick} disabled={loading}>
              {addConfig.label}
            </Button>
          )}
          <Button variant="primary" onClick={handleSaveClick} disabled={loading}>
            {loading ? 'Saving...' : isLastTab ? (isEditMode ? 'Update All' : 'Save All') : 'Save & Continue'}
          </Button>
        </div>

        <Card className="content-card">
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
              {/* Tab 1: Basic Details */}
              <Tab eventKey="basic" title="Basic Details">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Exhibition Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="exhibition_name"
                        value={formData.exhibition_name}
                        onChange={handleBasicChange}
                      />
                    </Form.Group>

                    {/* Aligned fields in a single row for admin itinerary tab */}
                    <Row className="g-3 mb-3">
                      <Col md={4}>
                        <Form.Label>Duration Days *</Form.Label>
                        <Form.Control
                          type="text"
                          name="duration_days"
                          value={formData.duration_days}
                          onChange={handleBasicChange}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Label>Tour Price *</Form.Label>
                        <Form.Control
                          type="text"
                          name="base_price_adult"
                          value={formData.base_price_adult}
                          onChange={handleBasicChange}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Label>EMI Price</Form.Label>
                        <Form.Control
                          type="text"
                          name="emi_price"
                          value={formData.emi_price}
                          onChange={handleBasicChange}
                          placeholder="Optional EMI price"
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Exhibition Overview</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="overview"
                        value={formData.overview}
                        onChange={handleBasicChange}
                        placeholder="Enter exhibition overview..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              {/* Tab 2: Itineraries */}
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
                      {itineraries.sort((a, b) => a.day - b.day).map((item, idx) => (
                        <tr key={idx}>
                           <td>{idx + 1}</td>
                           <td>{item.day}</td>
                           <td>{item.title}</td>
                           <td>{item.meals || '-'}</td>
                           <td>{item.description || '-'}</td>
                           <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-warning" size="sm" onClick={() => editItinerary(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleRemoveItinerary(idx)} title="Remove">
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

              {/* Tab 3: Departures */}
              <Tab eventKey="departures" title="Departures">
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Departures Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={departureForm.description}
                        onChange={handleDepartureChange}
                        placeholder="Enter departure details..."
                      />
                    </Form.Group>
                  </Col>
                </Row>

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
                              <Button variant="outline-warning" size="sm" onClick={() => editDeparture(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleRemoveDeparture(idx)} title="Remove">
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

              {/* Tab 4: Tour Costs */}
              <Tab eventKey="costs" title="Tour Costs">
                <Row className="align-items-end">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Pax *</Form.Label>
                      <Form.Control
                        type="text"
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
                        type="text"
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
                        type="text"
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
                        type="text"
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
                        type="text"
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
                        type="text"
                        name="child_no_bed"
                        value={tourCostItem.child_no_bed}
                        onChange={handleCostChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <Form.Label>Cost Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="cost_remarks"
                    value={formData.cost_remarks}
                    onChange={handleBasicChange}
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
                              <Button variant="outline-warning" size="sm" onClick={() => editCostRow(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => removeCostRow(idx)} title="Remove">
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

              {/* Tab 5: Optional Tours */}
              <Tab eventKey="optionalTours" title="Optional Tours">
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
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="optional_tour_remarks"
                    value={formData.optional_tour_remarks}
                    onChange={handleBasicChange}
                    placeholder="Enter any remarks for optional tours..."
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
                              <Button variant="outline-warning" size="sm" onClick={() => editOptionalTourRow(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => removeOptionalTourRow(idx)} title="Remove">
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

              {/* Tab 6: EMI Options */}
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
                              type="text"
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
                              type="text"
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
                          <InputGroup>
                            <InputGroup.Text>₹</InputGroup.Text>
                            <Form.Control
                              type="text"
                              min="0"
                              step="1000"
                              value={option.loan_amount || ''}
                              readOnly={!!emiLoanAmount}
                              placeholder="Enter amount"
                            />
                          </InputGroup>
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
                          <InputGroup>
                            <InputGroup.Text>₹</InputGroup.Text>
                            <Form.Control
                              type="text"
                              min="0"
                              step="100"
                              value={option.emi || ''}
                              readOnly
                              className="bg-light"
                              style={{ fontWeight: 'bold' }}
                            />
                          </InputGroup>
                        </td>
                       </tr>
                    ))}
                  </tbody>
                </Table>

                <Form.Group className="mt-4">
                  <Form.Label>EMI Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="emi_remarks"
                    value={formData.emi_remarks}
                    onChange={handleBasicChange}
                    placeholder="Enter any EMI-related remarks or notes..."
                  />
                </Form.Group>
              </Tab>

              {/* Tab 7: Inclusions */}
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
                              <Button variant="outline-warning" size="sm" onClick={() => editInclusion(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleRemoveInclusion(idx)} title="Remove">
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

              {/* Tab 8: Exclusions */}
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
                              <Button variant="outline-warning" size="sm" onClick={() => editExclusion(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleRemoveExclusion(idx)} title="Remove">
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

              {/* Tab 9: Transport */}
              <Tab eventKey="transport" title="Transport">
                <Row className="mt-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Transport Details</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={transportItem.description}
                        onChange={handleTransportChange}
                        placeholder="Enter transport details here..."
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <Form.Label>Transport Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="transport_remarks"
                    value={formData.transport_remarks}
                    onChange={handleBasicChange}
                    placeholder="Enter any remarks about transport..."
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
                              <Button variant="outline-warning" size="sm" onClick={() => editTransportRow(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => removeTransportRow(idx)} title="Remove">
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

              {/* Tab 10: Hotels */}
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
                        type="text"
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
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="hotel_remarks"
                    value={formData.hotel_remarks}
                    onChange={handleBasicChange}
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
                              <Button variant="outline-warning" size="sm" onClick={() => editHotelRow(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => removeHotelRow(idx)} title="Remove">
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

              {/* Tab 11: Visa (Only for International) */}
              {isInternational && (
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
                                              {typeof pdfFile === 'string' ? pdfFile : pdfFile.name}
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
                                              {typeof wordFile === 'string' ? wordFile : wordFile.name}
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
                            <Form.Label>Tourist Visa Remarks</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              value={touristVisaRemarks}
                              onChange={handleTouristVisaRemarksChange}
                              placeholder="Enter remarks about visa forms..."
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
                                  <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{item.description || '-'}</td>
                                    <td>
                                      <div className="d-flex gap-1">
                                        <Button
                                          variant="outline-warning"
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
              )}

              {/* Tab 12: Booking POI */}
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
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="booking_poi_remarks"
                      value={formData.booking_poi_remarks}
                      onChange={handleBasicChange}
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
                              <Button variant="outline-warning" size="sm" onClick={() => editPoi(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => removePoi(idx)} title="Remove">
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

              {/* Tab 13: Cancellation Policy */}
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
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="cancellation_remarks"
                    value={formData.cancellation_remarks}
                    onChange={handleBasicChange}
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
                              <Button variant="outline-warning" size="sm" onClick={() => editCancelRow(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => removeCancelRow(idx)} title="Remove">
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

              {/* Tab 14: Instructions */}
              <Tab eventKey="instructions" title="Instructions">
                <Form.Group className="mb-3">
                  <Form.Label>Add Instruction</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={instructionText}
                    onChange={(e) => setInstructionText(e.target.value)}
                    placeholder="Type instruction"
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
                              <Button variant="outline-warning" size="sm" onClick={() => editInstruction(idx)} title="Edit">
                                <Pencil size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => removeInstruction(idx)} title="Remove">
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

              {/* Tab 15: Images */}
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
                                    alt={`exhibition-image-${image.image_id}`}
                                    style={{
                                      width: '100%',
                                      height: '150px',
                                      objectFit: 'cover',
                                      borderRadius: '6px'
                                    }}
                                    className="mb-2"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `${baseurl}/uploads/exhibition/default-image.jpg`;
                                    }}
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

export default AddExhibitionDetails;