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

const AddTour = () => {
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
    duration_days: '',
    overview: '',
    base_price_adult: '',
    emi_price: '',
    is_international: 0,
    cost_remarks: "",
    hotel_remarks: "",
    transport_remarks: "",
    booking_poi_remarks: "",
    cancellation_remarks: "",
    emi_remarks: "",
    optional_tour_remarks: "" // Add this
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
  // const [imageFiles, setImageFiles] = useState([]);
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


  // Add this state for EMI
const [emiLoanAmount, setEmiLoanAmount] = useState('');
const [emiInterestRate, setEmiInterestRate] = useState(10);


// Add this function to calculate EMI
const calculateEMI = (loanAmount, months, interestRate = 10) => {
  const principal = parseFloat(loanAmount);
  const monthlyRate = (interestRate / 100) / 12;
  const n = parseInt(months, 10);
  
  if (isNaN(principal) || principal <= 0 || isNaN(n) || n <= 0) return 0;
  
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / 
              (Math.pow(1 + monthlyRate, n) - 1);
  
  return Math.round(emi * 100) / 100;
};

// Add this effect to update EMI values when loan amount changes
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
// Change to this:
const [transportItem, setTransportItem] = useState({
  description: ''  // Only this field is needed for individual tours
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


  // Add these after your other state declarations, before the useEffect hooks

// Static content for Booking Policy
const bookingPolicyTemplates = [
  {
    title: "Booking Policy",
    content: `Per Person Booking Amount`,
  },
  // {
  //   title: "New Booking Policy",
  //   content: `New Person Booking Amount`,
  // }
];

// Static content for Cancellation Policy
const cancellationPolicyTemplates = [
  {
    title: "Cancellation Policy",
    content: `45 Days to 30 Days Cost per person`,
    // charges: "No separate charges field needed",
  },
  //  {
  //   title: "New Cancellation Policy",
  //   content: `55 Days to 30 Days Cost per person`,
  //   charges: "No separate charges field needed",
  // }
];

// Add state for showing/hiding templates
const [showBookingTemplates, setShowBookingTemplates] = useState(false);
const [showCancellationTemplates, setShowCancellationTemplates] = useState(false);


// Add these functions after your other handler functions

const handleBookingTemplateSelect = (template) => {
  setPoiText(template.content);
  setShowBookingTemplates(false);
};

const handleCancellationTemplateSelect = (template) => {
  setCancelItem({
    ...cancelItem,
    cancellation_policy: `${template.content}\n\n`
  });
  setShowCancellationTemplates(false);
};

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
const [existingImages, setExistingImages] = useState([]); // For images already in DB
const [editingImageId, setEditingImageId] = useState(null); // For tracking which image is being edited
const [replacementFile, setReplacementFile] = useState(null); // For file replacement during edit
const [replacementPreview, setReplacementPreview] = useState(null);


  // ========================
  // EDIT FUNCTIONS - FIXED
  // ========================

  // Edit itinerary
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

// Edit departure
const editDeparture = (idx) => {
  const departure = departures[idx];
  setDepartureForm(departure);
  setEditingItem(departure);
  setEditingType('departure');
  setEditIndex(idx);
};

// Edit cost row
const editCostRow = (idx) => {
  const item = tourCosts[idx];
  setTourCostItem(item);
  setEditingItem(item);
  setEditingType('cost');
  setEditIndex(idx);
};

// Edit optional tour
const editOptionalTourRow = (idx) => {
  const item = optionalTours[idx];
  setOptionalTourItem(item);
  setEditingItem(item);
  setEditingType('optionalTour');
  setEditIndex(idx);
};

// Edit hotel row (already exists but needs context)
const editHotelRow = (idx) => {
  const item = hotelRows[idx];
  setHotelItem(item);
  setEditingItem(item);
  setEditingType('hotel');
  setEditIndex(idx);
};

// Edit transport row
const editTransportRow = (idx) => {
  const item = transports[idx];
  setTransportItem(item);
  setEditingItem(item);
  setEditingType('transport');
  setEditIndex(idx);
};

// Edit inclusion
const editInclusion = (idx) => {
  const inclusion = inclusions[idx];
  setInclusionText(inclusion);
  setEditingItem(inclusion);
  setEditingType('inclusion');
  setEditIndex(idx);
};

// Edit exclusion
const editExclusion = (idx) => {
  const exclusion = exclusions[idx];
  setExclusionText(exclusion);
  setEditingItem(exclusion);
  setEditingType('exclusion');
  setEditIndex(idx);
};

// Edit POI
const editPoi = (idx) => {
  const poi = bookingPois[idx];
  setPoiText(poi.item);
  setPoiAmount(poi.amount_details);
  setEditingItem(poi);
  setEditingType('poi');
  setEditIndex(idx);
};

// Edit cancellation policy
const editCancelRow = (idx) => {
  const policy = cancelPolicies[idx];
  setCancelItem(policy);
  setEditingItem(policy);
  setEditingType('cancellation');
  setEditIndex(idx);
};

// Edit instruction
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

// Update handleAddItinerary function
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
    // Update existing item
    const updated = [...itineraries];
    updated[editIndex] = newItem;
    setItineraries(updated);
  } else {
    // Add new item
    setItineraries(prev => [...prev, newItem]);
  }

  // Reset form
  setItineraryItem({
    day: '',
    title: '',
    description: '',
    meals: { breakfast: false, lunch: false, dinner: false }
  });
  resetEditing();
};

// Update handleAddDeparture function
const handleAddDeparture = () => {
  if (!departureForm.description.trim()) return;
  
  const newItem = { ...departureForm };
  
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

// Update addCostRow function
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

// Update addOptionalTourRow function
const addOptionalTourRow = () => {
  if (!optionalTourItem.tour_name.trim()) return;

  const processedItem = {
    ...optionalTourItem
  };

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

// Update addHotelRow function
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

// Update addTransportRow function
// In your individual tour transport handler
const addTransportRow = () => {
  if (!transportItem.description.trim()) return;
  
  if (editingType === 'transport' && editIndex !== -1) {
    const updated = [...transports];
    updated[editIndex] = { description: transportItem.description.trim() }; // Only store description
    setTransports(updated);
  } else {
    setTransports(prev => [...prev, { description: transportItem.description.trim() }]); // Only store description
  }

  setTransportItem({
    description: ''  // Reset only description
  });
  resetEditing();
};


// Update handleAddInclusion function
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

// Update handleAddExclusion function
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

// Update addPoi function
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

// Update addCancelRow function
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

// Update addInstruction function
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



  // Reset editing context
   // Reset editing context function
const resetEditing = () => {
  setEditingItem(null);
  setEditingType('');
  setEditIndex(-1);
};

  // ========================
  // REMOVE FUNCTIONS
  // ========================

 // ========================
// REMOVE FUNCTIONS (WITH ALERTS)
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
  setTransportItem(prev => ({ 
    ...prev, 
    [name]: value 
  }));
};


  // Save transport function
// const saveTransport = async () => {
//   try {
//     const response = await fetch('/api/tour/transports', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         ...transportItem,
//       })
//     });

//     if (response.ok) {
//       const data = await response.json();
//       setTransports(prev => [...prev, { ...transportItem, transport_id: data.transport_id }]);
//       setTransportItem({
//         description: '',
//         airline: '',
//         flight_no: '',
//         from_city: '',
//         from_date: '',
//         from_time: '',
//         to_city: '',
//         to_date: '',
//         to_time: '',
//         via: '',
//         sort_order: transports.length + 1
//       });
//     }
//   } catch (error) {
//     console.error('Error saving transport:', error);
//   }
// };


 // Update the handleLoanAmountChange function
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



  // const handleEMIChange = (index, value) => {
  //   const updatedOptions = [...emiOptions];
  //   updatedOptions[index].emi = value;
  //   setEmiOptions(updatedOptions);
  // };

  const handleCancelChange = (e) => {
    const { name, value } = e.target;
    setCancelItem(prev => ({ ...prev, [name]: value }));
  };

  // BASIC DETAILS CHANGE
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      'duration_days',
      'base_price_adult',
      'emi_price', // ← Add this
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

  // ITINERARY CHANGE
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
// Handle image upload/selection for new images
const handleImageChange = (e) => {
  const files = e.target.files ? Array.from(e.target.files) : [];
  setImageFiles(files);
};



// Handle file selection for replacement
const handleReplacementFileChange = (e) => {
  const file = e.target.files ? e.target.files[0] : null;
  setReplacementFile(file);
  if (file) {
    const preview = URL.createObjectURL(file);
    setReplacementPreview(preview);
  }
};

// Start editing an image
const startEditImage = (image) => {
  setEditingImageId(image.image_id);
  setReplacementFile(null);
  setReplacementPreview(null);
};

// Cancel editing
const cancelEditImage = () => {
  setEditingImageId(null);
  setReplacementFile(null);
  setReplacementPreview(null);
  // Clear the file input
  const fileInput = document.getElementById('replacementFileInput');
  if (fileInput) fileInput.value = '';
};


// Update existing image (replace with new file)
const updateImage = async (imageId) => {
  if (!replacementFile) {
    alert('Please select a new image file to replace the existing one');
    return;
  }

  try {
    setLoading(true);
    setError('');
    
    // First delete the old image
    const deleteResponse = await fetch(`${baseurl}/api/images/${imageId}`, {
      method: 'DELETE'
    });
    
    if (!deleteResponse.ok) {
      throw new Error('Failed to delete old image');
    }

    // Then upload the new image
    const formData = new FormData();
    formData.append('images', replacementFile);
    
    const uploadResponse = await fetch(`${baseurl}/api/images/upload/${id}`, {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload new image');
    }

    // Refresh the images list
    await loadTourData();
    
    setSuccess('Image updated successfully');
    cancelEditImage();
  } catch (err) {
    setError('Failed to update image: ' + err.message);
  } finally {
    setLoading(false);
  }
};

// Delete image
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

    // Update local state
    setExistingImages(prev => prev.filter(img => img.image_id !== imageId));
    
    setSuccess('Image deleted successfully');
  } catch (err) {
    setError('Failed to delete image: ' + err.message);
  } finally {
    setLoading(false);
  }
};

// Set cover image
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

    // Update local state
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

  // Find this section in your code and update it:
useEffect(() => {
  const loadDropdownsAndTourCode = async () => {
    try {
      // Load dropdowns
      const catRes = await fetch(`${baseurl}/api/categories/all-tours`);
      const categoryData = await catRes.json();
      setCategories(Array.isArray(categoryData) ? categoryData : []);

      const destRes = await fetch(`${baseurl}/api/destinations`);
      const destData = await destRes.json();

      // Filter for domestic destinations only (is_domestic == 1)
      const domesticDestinations = Array.isArray(destData) 
        ? destData.filter(destination => destination.is_domestic == 1)
        : [];
      
      // Sort destinations by name in ascending order (A to Z)
      const sortedDestinations = domesticDestinations.sort((a, b) => {
        const nameA = a.name ? a.name.toLowerCase() : '';
        const nameB = b.name ? b.name.toLowerCase() : '';
        
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      
      setDestinations(sortedDestinations); // Set the sorted array

      if (isEditMode) {
        await loadTourData();
      } else {
        const tourCodeRes = await fetch(`${baseurl}/api/tours/next-tour-code?tour_type=individual`);
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
      
      const response = await fetch(`${baseurl}/api/tours/tour/full/individual/${id}`);
      if (!response.ok) throw new Error('Failed to fetch tour data');
      
      const data = await response.json();
      
      if (data.success) {
        // Set basic form data
        const basic = data.basic_details;
        setFormData({
          tour_code: basic.tour_code || '',
          tour_type: basic.tour_type || 'individual',
          title: basic.title || '',
          category_id: basic.category_id || 1,
          primary_destination_id: basic.primary_destination_id || '',
          duration_days: basic.duration_days || '',
          overview: basic.overview || '',
          base_price_adult: basic.base_price_adult || '',
           emi_price: basic.emi_price || '', // ← Add this line
          is_international: basic.is_international || 0,
          cost_remarks: basic.cost_remarks || '',
          hotel_remarks: basic.hotel_remarks || '',
          transport_remarks: basic.transport_remarks || '',
          booking_poi_remarks: basic.booking_poi_remarks || '',
          cancellation_remarks: basic.cancellation_remarks || '',
          emi_remarks: basic.emi_remarks || '',
          optional_tour_remarks: basic.optional_tour_remarks || ''
        });

        // Set itineraries
        if (data.itinerary && Array.isArray(data.itinerary)) {
          const formattedItineraries = data.itinerary.map(item => ({
            day: item.day,
            title: item.title,
            description: item.description || '',
            meals: item.meals || ''
          }));
          setItineraries(formattedItineraries);
        }

        // Set departures
        if (data.departures && Array.isArray(data.departures)) {
          const formattedDepartures = data.departures.map(dept => ({
            departure_date: dept.departure_date || '',
            return_date: dept.return_date || '',
            adult_price: dept.adult_price || '',
            child_price: dept.child_price || '',
            infant_price: dept.infant_price || '',
            description: dept.description || '',
            total_seats: dept.total_seats || ''
          }));
          setDepartures(formattedDepartures);
        }

        // Set inclusions
        if (data.inclusions && Array.isArray(data.inclusions)) {
          const inclusionItems = data.inclusions.map(inc => inc.item);
          setInclusions(inclusionItems);
        }

        // Set exclusions
        if (data.exclusions && Array.isArray(data.exclusions)) {
          const exclusionItems = data.exclusions.map(exc => exc.item);
          setExclusions(exclusionItems);
        }

        // Set tour costs
        if (data.costs && Array.isArray(data.costs)) {
          setTourCosts(data.costs);
        }

        // Set optional tours
        if (data.optional_tours && Array.isArray(data.optional_tours)) {
          setOptionalTours(data.optional_tours);
        }

        // Set EMI options
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

        // Set hotels
       // Set hotels
        if (data.hotels && Array.isArray(data.hotels)) {
          const formattedHotels = data.hotels.map(hotel => ({
            ...hotel,
            standard_hotel_name: hotel.standard_hotel_name || '',
            deluxe_hotel_name: hotel.deluxe_hotel_name || '',
            executive_hotel_name: hotel.executive_hotel_name || ''
          }));
          setHotelRows(formattedHotels);
        }

        // Set transport
       // Set transport for Individual tours
if (data.transport && Array.isArray(data.transport)) {
  // For individual tours, only use the description field
  const formattedTransports = data.transport.map(t => ({
    description: t.description || ''
  }));
  setTransports(formattedTransports);
}

        // Set booking POI
        if (data.booking_poi && Array.isArray(data.booking_poi)) {
          const formattedPois = data.booking_poi.map(poi => ({
            item: poi.item,
            amount_details: poi.amount_details || ''
          }));
          setBookingPois(formattedPois);
        }

        // Set cancellation policies
        if (data.cancellation_policies && Array.isArray(data.cancellation_policies)) {
          const formattedPolicies = data.cancellation_policies.map(policy => ({
            cancellation_policy: policy.cancellation_policy,
            charges: policy.charges || ''
          }));
          setCancelPolicies(formattedPolicies);
        }

        // Set instructions
        if (data.instructions && Array.isArray(data.instructions)) {
          const instructionItems = data.instructions.map(inst => inst.item);
          setInstructions(instructionItems);
        }

        // Set images
        // Set images
          if (data.images && Array.isArray(data.images)) {
            const imageUrls = data.images.map(img => img.url);
            // Keep existing images separately
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
    navigate('/tours');
  };

  const isLastTab = activeTab === TAB_LIST[TAB_LIST.length - 1];

  // ========================
  // SAVE FUNCTIONS
  // ========================

  // CREATE NEW TOUR (POST)
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

      // 1) CREATE TOUR
      const tourRes = await fetch(`${baseurl}/api/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        ...formData,
        optional_tour_remarks: formData.optional_tour_remarks || '' // Ensure it's included
      })
      });

      if (!tourRes.ok) {
        const err = await tourRes.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create tour');
      }

      const tourData = await tourRes.json();
      const tourId = tourData.tour_id || tourData.id || tourData.insertId;

      // 2) ITINERARIES
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

      // 3) DEPARTURES
      if (departures.length > 0) {
        await fetch(`${baseurl}/api/departures/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, departures })
        });
      }

      // 4) TOUR COSTS
      if (tourCosts.length > 0) {
        await fetch(`${baseurl}/api/tour-costs/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, costs: tourCosts })
        });
      }

      // 5) OPTIONAL TOURS
      if (optionalTours.length > 0) {
        await fetch(`${baseurl}/api/optional-tours/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, optional_tours: optionalTours })
        });
      }

      // 6) EMI OPTIONS
     // 6) EMI OPTIONS - UPDATED
if (emiLoanAmount && !isNaN(emiLoanAmount) && emiLoanAmount > 0) {
  // Use the global loan amount
  await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      tour_id: tourId, 
      loan_amount: emiLoanAmount 
      // Remove the emi_options array from here
      // The backend will generate all options based on loan_amount
    })
  });
} else {
  // Fallback to existing behavior if no global loan amount
  const validEmiOptions = emiOptions.filter(opt =>
    opt.loan_amount && opt.loan_amount > 0 && opt.emi && opt.emi > 0
  );
  if (validEmiOptions.length > 0) {
    await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tour_id: tourId, 
        emi_options: validEmiOptions 
      })
    });
  }
}


      console.log('=== SENDING HOTELS DATA ===');
console.log('Tour ID:', tourId || id);
console.log('Hotel rows count:', hotelRows.length);
console.log('Sample hotel row:', hotelRows[0]);
console.log('All hotel rows:', JSON.stringify(hotelRows, null, 2));


      // 7) HOTELS
  // Add try-catch with logging for the hotels API call

  // 7) HOTELS - FIXED VERSION
if (hotelRows.length > 0) {
  console.log(`Calling ${baseurl}/api/tour-hotels/bulk`);
  console.log('Tour ID:', tourId);
  console.log('Hotel rows:', hotelRows);
  
  // Create the payload in the format expected by backend
  const hotelPayload = {
    tour_id: tourId,
    "hotels[]": hotelRows  // Change from 'hotels' to 'hotels[]'
  };
  
  console.log('Sending hotel payload:', hotelPayload);
  
  const hotelResponse = await fetch(`${baseurl}/api/tour-hotels/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hotelPayload)
  });

  console.log('Hotels API Response status:', hotelResponse.status);
  
  const hotelResult = await hotelResponse.json();
  console.log('Hotels API Response body:', hotelResult);

  if (!hotelResponse.ok) {
    throw new Error(`Hotels API failed: ${JSON.stringify(hotelResult)}`);
  }

  console.log('Hotels successfully saved:', hotelResult.message);
}

      // 8) TRANSPORT
      if (transports.length > 0) {
        await fetch(`${baseurl}/api/tour-transports/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: transports })
        });
      }

      // 9) INCLUSIONS
      if (inclusions.length > 0) {
        await fetch(`${baseurl}/api/inclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: inclusions })
        });
      }

      // 10) EXCLUSIONS
      if (exclusions.length > 0) {
        await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: exclusions })
        });
      }

      // 11) BOOKING POI
      if (bookingPois.length > 0) {
        await fetch(`${baseurl}/api/tour-booking-poi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: bookingPois })
        });
      }

      // 12) CANCELLATION
      if (cancelPolicies.length > 0) {
        await fetch(`${baseurl}/api/tour-cancellation/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, policies: cancelPolicies })
        });
      }

      // 13) INSTRUCTIONS
      if (instructions.length > 0) {
        await fetch(`${baseurl}/api/tour-instructions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: instructions })
        });
      }

      // 14) IMAGES
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
      setTimeout(() => navigate('/tours'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create tour');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE EXISTING TOUR (PUT)
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

      // 1) UPDATE TOUR BASIC DETAILS
      const tourUpdateData = {
        title: formData.title.trim(),
        tour_type: formData.tour_type || 'individual',
        primary_destination_id: formData.primary_destination_id,
        duration_days: Number(formData.duration_days) || 0,
        overview: formData.overview || '',
        base_price_adult: Number(formData.base_price_adult) || 0,
        emi_price: formData.emi_price ? Number(formData.emi_price) : null, // ← Allow null
        is_international: Number(formData.is_international) || 0,
        cost_remarks: formData.cost_remarks || '',
        hotel_remarks: formData.hotel_remarks || '',
        transport_remarks: formData.transport_remarks || '',
        emi_remarks: formData.emi_remarks || '',
        booking_poi_remarks: formData.booking_poi_remarks || '',
        cancellation_remarks: formData.cancellation_remarks || '',
        optional_tour_remarks: formData.optional_tour_remarks || '' // Add this
      };

        console.log('Sending update data:', tourUpdateData); // Add this for debugging

      const tourRes = await fetch(`${baseurl}/api/tours/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourUpdateData)
      });

      const tourResponse = await tourRes.json();
      if (!tourRes.ok) {
        throw new Error(tourResponse.error || tourResponse.message || 'Failed to update tour');
      }

      // 2) DELETE ALL EXISTING DATA
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

      // 3) RE-ADD ALL UPDATED DATA
      // Itineraries
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

      // Departures
      if (departures.length > 0) {
        await fetch(`${baseurl}/api/departures/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, departures })
        });
      }

      // Tour Costs
      if (tourCosts.length > 0) {
        await fetch(`${baseurl}/api/tour-costs/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, costs: tourCosts })
        });
      }

      // Optional Tours
      if (optionalTours.length > 0) {
        await fetch(`${baseurl}/api/optional-tours/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, optional_tours: optionalTours })
        });
      }

      // EMI Options
     // 6) EMI OPTIONS - UPDATED
if (emiLoanAmount && !isNaN(emiLoanAmount) && emiLoanAmount > 0) {
  // Use the global loan amount
  await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      tour_id: id, 
      loan_amount: emiLoanAmount 
      // Remove the emi_options array from here
      // The backend will generate all options based on loan_amount
    })
  });
} else {
  // Fallback to existing behavior if no global loan amount
  const validEmiOptions = emiOptions.filter(opt =>
    opt.loan_amount && opt.loan_amount > 0 && opt.emi && opt.emi > 0
  );
  if (validEmiOptions.length > 0) {
    await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tour_id: id, 
        emi_options: validEmiOptions 
      })
    });
  }
}

      // Hotels
     // Hotels - FIXED VERSION
if (hotelRows.length > 0) {
  console.log(`Calling ${baseurl}/api/tour-hotels/bulk for update`);
  console.log('Tour ID:', id);
  console.log('Hotel rows:', hotelRows);
  
  // Create the payload in the format expected by backend
  const hotelPayload = {
    tour_id: id,
    "hotels[]": hotelRows  // Change from 'hotels' to 'hotels[]'
  };
  
  console.log('Sending hotel payload:', hotelPayload);
  
  const hotelResponse = await fetch(`${baseurl}/api/tour-hotels/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hotelPayload)
  });

  console.log('Hotels API Response status:', hotelResponse.status);
  
  const hotelResult = await hotelResponse.json();
  console.log('Hotels API Response body:', hotelResult);

  if (!hotelResponse.ok) {
    throw new Error(`Hotels API failed: ${JSON.stringify(hotelResult)}`);
  }

  console.log('Hotels successfully saved:', hotelResult.message);
}

      // Transport
      if (transports.length > 0) {
        await fetch(`${baseurl}/api/tour-transports/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: transports })
        });
      }

      // Inclusions
      if (inclusions.length > 0) {
        await fetch(`${baseurl}/api/inclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: inclusions })
        });
      }

      // Exclusions
      if (exclusions.length > 0) {
        await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: exclusions })
        });
      }

      // Booking POI
      if (bookingPois.length > 0) {
        await fetch(`${baseurl}/api/tour-booking-poi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: bookingPois })
        });
      }

      // Cancellation
      if (cancelPolicies.length > 0) {
        await fetch(`${baseurl}/api/tour-cancellation/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, policies: cancelPolicies })
        });
      }

      // Instructions
      if (instructions.length > 0) {
        await fetch(`${baseurl}/api/tour-instructions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: instructions })
        });
      }

      // Images (only if new files added)
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
      setTimeout(() => navigate('/tours'), 1500);
    } catch (err) {
      console.error('Error updating tour:', err);
      setError(err.message || 'Failed to update tour');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup effect for blob URLs
useEffect(() => {
  return () => {
    if (replacementPreview && replacementPreview.startsWith('blob:')) {
      URL.revokeObjectURL(replacementPreview);
    }
  };
}, [replacementPreview]);


 const handleSaveClick = () => {
  if (isLastTab) {
    if (isEditMode) {
      updateTour();
    } else {
      createTour();
    }
  } else {
    goNext();
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
  

  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">{isEditMode ? 'Edit Tour' : 'Add Tour'}</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

                    {/* ======== BUTTONS ======== */}
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


        <Card classname="content-card">
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
                      {/* <Form.Text className="text-muted">
                        {isEditMode ? "Tour code cannot be changed" : "Auto-generated tour code"}
                      </Form.Text> */}
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

                    {/* <Form.Group className="mb-3">
                      <Form.Label>International Tour?</Form.Label>
                      <Form.Select
                        name="is_international"
                        value={formData.is_international}
                        onChange={handleBasicChange}
                      >
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                      </Form.Select>
                    </Form.Group> */}

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
                        {/* <Form.Text className="text-muted">
                          Showing domestic destinations only
                        </Form.Text> */}
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

                    {/* ADD THIS NEW FIELD */}
                      <Form.Group className="mb-3">
                        <Form.Label>EMI Price</Form.Label>
                        <Form.Control
                          type="number"
                          name="emi_price"
                          value={formData.emi_price}
                          onChange={handleBasicChange}
                          placeholder="Optional EMI price"
                        />
                        {/* <Form.Text className="text-muted">
                          This is the price used for EMI calculations (if different from tour price)
                        </Form.Text> */}
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

                 {/* Add this new form group for Optional Tour Remarks */}
                <Form.Group className="mt-3">
                  <Form.Label>Optional Tour Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="optional_tour_remarks"
                    value={formData.optional_tour_remarks || ''}
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
    <Card.Header>EMI Calculator</Card.Header>
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
            <Form.Text className="text-muted">
              This amount will be used for all EMI calculations
            </Form.Text>
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
            <Form.Text className="text-muted">
              Annual interest rate for EMI calculation
            </Form.Text>
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
                    // If you want to allow individual editing, keep this
                    // Otherwise, make it read-only
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
                  readOnly={!!emiLoanAmount} // Make read-only if global loan amount is set
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
            <small className="text-muted">
              Monthly payment for {option.months} months
            </small>
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
                           {/* <th>Remarks</th> */}
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
                          {/* <td>{h.remarks || '-'}</td> */}
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
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label>Booking Policy</Form.Label>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => setShowBookingTemplates(!showBookingTemplates)}
          >
            {showBookingTemplates ? 'Hide Templates' : 'Show Templates'}
          </Button>
        </div>
        
        {/* Template Selection Box */}
        {showBookingTemplates && (
          <Card className="mb-3 border-info">
            {/* <Card.Header className="bg-info text-white"> */}
              <strong>Booking Policy Templates</strong>
              {/* <small className="float-end">Click to select</small> */}
            {/* </Card.Header> */}
            <Card.Body className="p-0">
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {bookingPolicyTemplates.map((template, index) => (
                  <div
                    key={index}
                    className="p-3 border-bottom hover-cursor-pointer"
                    onClick={() => handleBookingTemplateSelect(template)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#f8f9fa'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  >
                    <strong className="text-primary">{template.title}</strong>
                    <div className="text-muted small mt-1" style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {template.content.substring(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
        
        <Form.Control
          as="textarea"
          rows={4}
          value={poiText}
          onChange={(e) => setPoiText(e.target.value)}
          placeholder="Type booking policy here or select from templates above"
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label>Cancellation Policy</Form.Label>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => setShowCancellationTemplates(!showCancellationTemplates)}
                    >
                      {showCancellationTemplates ? 'Hide Templates' : 'Show Templates'}
                    </Button>
                  </div>


                  {/* Template Selection Box */}
{showCancellationTemplates && (
  <Card className="mb-3 border-info">
    <Card.Body className="p-0">
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {cancellationPolicyTemplates.map((template, index) => (
          <div
            key={index}
            className="p-3 border-bottom hover-cursor-pointer"
            onClick={() => handleCancellationTemplateSelect(template)}
            style={{
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          >
            <strong className="text-primary">{template.title}</strong>
            <div className="text-muted small mt-1" style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {template.content.substring(0, 50)}...
              {template.charges && ` ${template.charges.substring(0, 50)}...`}
            </div>
          </div>
        ))}
      </div>
    </Card.Body>
  </Card>
)}

                  
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="cancellation_policy"
                    value={cancelItem.cancellation_policy}
                    onChange={handleCancelChange}
                    placeholder="Type cancellation policy here or select from templates above"
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
                {/* Section for adding NEW images */}
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

                {/* Section for EXISTING images with edit/delete */}
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
                                        {/* Set as Cover Button */}
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
                                        
                                        {/* Edit Button */}
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          onClick={() => startEditImage(image)}
                                          title="Replace Image"
                                          disabled={loading}
                                        >
                                          <Pencil size={14} /> Replace
                                        </Button>
                                        
                                        {/* Delete Button */}
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
                    
                    {/* Show existing image count */}
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

export default AddTour;