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

const AddLadiesTour = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get tour ID from URL for edit mode
  const isEditMode = !!id;

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdowns
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // BASIC DETAILS
  const [formData, setFormData] = useState({
    tour_code: '',
    tour_type: "ladiesspecial",
    title: '',
    category_id: 1,
    primary_destination_id: '',
    duration_days: '',
    overview: '',
    base_price_adult: '',
    emi_price: '', // ← Add this line
    is_international: 1,
    cost_remarks: "",
    hotel_remarks: "",
    transport_remarks: "",
    booking_poi_remarks: "",
    cancellation_remarks: "",
    emi_remarks: ""
  });


   // TAB ORDER MUST MATCH JSX ORDER
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
     ...(formData.is_international === 1 ? ['visa'] : []), // Conditionally add visa tab
    'bookingPoi',
    'cancellation',
    'instructions',
    'images'
  ];

  
  // =======================
  // DEPARTURES FOR LADIES SPECIAL TOURS - SIMILAR TO GROUP TOURS
  // =======================
  const [ladiesDepartureForm, setLadiesDepartureForm] = useState({
    start_date: '',
    end_date: '',
    status: 'Available',
    total_seats: 40,
    booked_seats: 0,
    description: '',
    // 3-Star Hotel Prices
    three_star_twin: '',
    three_star_triple: '',
    three_star_child_with_bed: '',
    three_star_child_without_bed: '',
    three_star_infant: '',
    three_star_single: '',
    // 4-Star Hotel Prices
    four_star_twin: '',
    four_star_triple: '',
    four_star_child_with_bed: '',
    four_star_child_without_bed: '',
    four_star_infant: '',
    four_star_single: '',
    // 5-Star Hotel Prices
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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageCaption, setImageCaption] = useState('');

  // Add these near your other state declarations
const [editingItem, setEditingItem] = useState(null);
const [editingType, setEditingType] = useState('');
const [editIndex, setEditIndex] = useState(-1);
const [existingImages, setExistingImages] = useState([]);
const [editingImageId, setEditingImageId] = useState(null);
const [replacementFile, setReplacementFile] = useState(null);
const [replacementPreview, setReplacementPreview] = useState(null);

// Add this function for resetting editing state
const resetEditing = () => {
  setEditingItem(null);
  setEditingType('');
  setEditIndex(-1);
};

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
      adult_price: optionalTourItem.adult_price
        ? Number(optionalTourItem.adult_price)
        : '',
      child_price: optionalTourItem.child_price
        ? Number(optionalTourItem.child_price)
        : ''
    };

    setOptionalTours(prev => [...prev, processedItem]);
    setOptionalTourItem({
      tour_name: '',
      adult_price: '',
      child_price: ''
    });
  };

  const editOptionalTourRow = (idx) => {
    const item = optionalTours[idx];
    setOptionalTourItem(item);
    setOptionalTours(prev => prev.filter((_, i) => i !== idx));
  };

  const removeOptionalTourRow = (idx) => {
    setOptionalTours(prev => prev.filter((_, i) => i !== idx));
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

  const handleLoanAmountChange = (index, value) => {
    const updatedOptions = [...emiOptions];
    updatedOptions[index].loan_amount = value;
    setEmiOptions(updatedOptions);
  };

  const handleEMIChange = (index, value) => {
    const updatedOptions = [...emiOptions];
    updatedOptions[index].emi = value;
    setEmiOptions(updatedOptions);
  };

  // =======================
  // HOTELS
  // =======================
  const [hotelItem, setHotelItem] = useState({
    city: '',
    hotel_name: '',
    room_type: '',
    nights: '',
    remarks: '',
    hotel_standard: '',
    hotel_deluxe: '',
    hotel_executive: ''
  });
  const [hotelRows, setHotelRows] = useState([]);

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelItem(prev => ({ ...prev, [name]: value }));
  };

  const addHotelRow = () => {
    if (!hotelItem.city.trim() || !hotelItem.hotel_name.trim()) return;
    setHotelRows(prev => [...prev, { ...hotelItem }]);
    setHotelItem({
      city: '',
      hotel_name: '',
      room_type: '',
      nights: '',
      remarks: '',
      hotel_standard: '',
      hotel_deluxe: '',
      hotel_executive: ''
    });
  };

  const editHotelRow = (idx) => {
    const item = hotelRows[idx];
    setHotelItem(item);
    setHotelRows(prev => prev.filter((_, i) => i !== idx));
  };

  const removeHotelRow = (idx) => {
    setHotelRows(prev => prev.filter((_, i) => i !== idx));
  };


  // ========================
// VISA STATE FOR LADIES SPECIAL TOURS
// ========================
const [activeVisaSubTab, setActiveVisaSubTab] = useState('tourist');

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
const [visaFormItems, setVisaFormItems] = useState([
  {
    type: 'Tourist Visa',
    download_text: 'Tourist Visa Form Download',
    download_action: 'Download',
    fill_action: 'Fill Manually',
    action1_file: null, // PDF upload
    action2_file: null  // Word document upload
  },
  {
    type: 'Transit Visa',
    download_text: 'Transit Visa Form Download',
    download_action: 'Download',
    fill_action: 'Fill Manually',
    action1_file: null,
    action2_file: null
  },
  {
    type: 'Business Visa',
    download_text: 'Business Visa Form Download',
    download_action: 'Download',
    fill_action: 'Fill Manually',
    action1_file: null,
    action2_file: null
  }
]);

// Add tourist visa remarks state
const [touristVisaRemarks, setTouristVisaRemarks] = useState('');

// Add this function for visa form file upload
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
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

// Update handleVisaFormFileChange function
const handleVisaFormFileChange = async (index, action, file) => {
  if (!file) return;
  
  const updated = [...visaFormItems];
  if (action === 'action1') {
    updated[index].action1_file = file; // Store file object
  } else {
    updated[index].action2_file = file; // Store file object
  }
  setVisaFormItems(updated);
  
  // If editing mode, upload immediately and get filename
  if (isEditMode && id) {
    const uploadedFileName = await handleVisaFormFileUpload(id, visaFormItems[index].type, action, file);
    if (uploadedFileName) {
      const updatedWithFilename = [...visaFormItems];
      if (action === 'action1') {
        updatedWithFilename[index].action1_file = uploadedFileName;
      } else {
        updatedWithFilename[index].action2_file = uploadedFileName;
      }
      setVisaFormItems(updatedWithFilename);
    }
  }
};

// Add this handler for tourist visa remarks
const handleTouristVisaRemarksChange = (e) => {
  setTouristVisaRemarks(e.target.value);
};


// Photo
const [photoItems, setPhotoItems] = useState([]);
const [photoForm, setPhotoForm] = useState({ description: '' });

// Add this near your other state declarations
const [freeFlowPhotoEntries, setFreeFlowPhotoEntries] = useState([]);
const [freeFlowPhotoText, setFreeFlowPhotoText] = useState('');


// Add these functions near your other handler functions

// Add Free Flow Photo Entry - FIXED
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
// Edit Free Flow Photo Entry - FIXED
const editFreeFlowPhotoEntry = (idx) => {
  const item = freeFlowPhotoEntries[idx];
  setFreeFlowPhotoText(item.description);
  setEditingItem(item);
  setEditingType('freeFlowPhoto');
  setEditIndex(idx);
};

// Remove Free Flow Photo Entry
const removeFreeFlowPhotoEntry = (idx) => {
  setFreeFlowPhotoEntries(prev => prev.filter((_, i) => i !== idx));
};

// Handle Free Flow Photo Text Change
const handleFreeFlowPhotoChange = (e) => {
  setFreeFlowPhotoText(e.target.value);
};

// Visa Fees
// Update visaFeesRows state
const [visaFeesRows, setVisaFeesRows] = useState([
  { 
    id: 1,
    type: 'Visa Fee', 
    tourist: '', 
    transit: '', 
    business: '', 
    tourist_charges: '', // Separate for Tourist
    transit_charges: '', // Separate for Transit
    business_charges: '' // Separate for Business
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

// Add visa fees management functions
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
  setVisaFeesRows(visaFeesRows.filter(row => row.id !== id));
};


// Submission & Pick Up
// Update the submissionRows state initialization (remove the fixed heading row):
const [submissionRows, setSubmissionRows] = useState([
  { label: 'Passport Submission Day', tourist: '', transit: '', business: '' },
  { label: 'Passport Submission Time', tourist: '', transit: '', business: '' },
  { label: 'Passport pick up Days', tourist: '', transit: '', business: '' },
  { label: 'Passport Pick Up Time', tourist: '', transit: '', business: '' },
  { label: 'Biometric requirement', tourist: '', transit: '', business: '' }
]);

// Add function to add new rows:
const addSubmissionRow = () => {
  setSubmissionRows(prev => [
    ...prev,
    { label: 'Free Flow Entry', tourist: '', transit: '', business: '' }
  ]);
};

// Add function to remove rows:
const removeSubmissionRow = (idx) => {
  setSubmissionRows(prev => prev.filter((_, i) => i !== idx));
};


// Edit Tourist Visa - FIXED
const editTouristVisa = (idx) => {
  const item = touristVisaItems[idx];
  setTouristVisaForm({ description: item.description });
  setEditingItem(item);
  setEditingType('touristVisa');
  setEditIndex(idx);
};

// Edit Transit Visa - FIXED
const editTransitVisa = (idx) => {
  const item = transitVisaItems[idx];
  setTransitVisaForm({ description: item.description });
  setEditingItem(item);
  setEditingType('transitVisa');
  setEditIndex(idx);
};

// Edit Business Visa - FIXED
const editBusinessVisa = (idx) => {
  const item = businessVisaItems[idx];
  setBusinessVisaForm({ description: item.description });
  setEditingItem(item);
  setEditingType('businessVisa');
  setEditIndex(idx);
};

// Edit Photo - FIXED
const editPhoto = (idx) => {
  const item = photoItems[idx];
  setPhotoForm({ description: item.description });
  setEditingItem(item);
  setEditingType('photo');
  setEditIndex(idx);
};


// Add Tourist Visa - FIXED
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

// Add Transit Visa - FIXED
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

// Add Business Visa - FIXED
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

// Add Photo - FIXED
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



// Remove Tourist Visa
const removeTouristVisa = (idx) => {
  setTouristVisaItems(prev => prev.filter((_, i) => i !== idx));
};

// Remove Transit Visa
const removeTransitVisa = (idx) => {
  setTransitVisaItems(prev => prev.filter((_, i) => i !== idx));
};

// Remove Business Visa
const removeBusinessVisa = (idx) => {
  setBusinessVisaItems(prev => prev.filter((_, i) => i !== idx));
};

// Remove Photo
const removePhoto = (idx) => {
  setPhotoItems(prev => prev.filter((_, i) => i !== idx));
};


// Visa Form Change Handlers
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

const handleVisaFeesChange = (index, field, value) => {
  const updated = [...visaFeesRows];
  updated[index][field] = value;
  setVisaFeesRows(updated);
};

const handleSubmissionChange = (index, field, value) => {
  const updated = [...submissionRows];
  updated[index][field] = value;
  setSubmissionRows(updated);
};

// Handle file selection for image replacement
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
  const fileInput = document.getElementById('replacementFileInput');
  if (fileInput) fileInput.value = '';
};

// Update existing image
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
    if (imageCaption.trim()) {
      formData.append('caption', imageCaption.trim());
    }
    
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

  // =======================
  // TRANSPORT FOR LADIES SPECIAL TOURS
  // =======================
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

  const [transports, setTransports] = useState([]);

  const handleTransportChange = (e) => {
    const { name, value } = e.target;
    setTransportItem(prev => ({ ...prev, [name]: value }));
  };

  const addTransportRow = () => {
    if (!transportItem.airline || !transportItem.flight_no || !transportItem.from_city || !transportItem.to_city) {
      return;
    }

    setTransports(prev => [...prev, { ...transportItem, sort_order: prev.length + 1 }]);

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
    setTransportItem(item);
    setTransports(prev => prev.filter((_, i) => i !== idx));
  };

  const removeTransportRow = (idx) => {
    setTransports(prev => prev.filter((_, i) => i !== idx));
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
    setBookingPois([
      ...bookingPois,
      { item: poiText, amount_details: poiAmount, sort_order: bookingPois.length + 1 }
    ]);
    setPoiText('');
    setPoiAmount("");
  };

  const editPoi = (idx) => {
    const poi = bookingPois[idx];
    setPoiText(poi.item);
    setPoiAmount(poi.amount_details);
    setBookingPois(prev => prev.filter((_, i) => i !== idx));
  };

  const removePoi = (idx) => {
    setBookingPois(prev => prev.filter((_, i) => i !== idx));
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
    setCancelPolicies(prev => [...prev, { ...cancelItem, sort_order: prev.length + 1 }]);
    setCancelItem({ cancellation_policy: "", charges: "", sort_order: cancelPolicies.length + 2 });
  };

  const editCancelRow = (idx) => {
    const policy = cancelPolicies[idx];
    setCancelItem(policy);
    setCancelPolicies(prev => prev.filter((_, i) => i !== idx));
  };

  const removeCancelRow = (idx) => {
    setCancelPolicies(prev => prev.filter((_, i) => i !== idx));
  };

  // =======================
  // INSTRUCTIONS
  // =======================
  const [instructionText, setInstructionText] = useState('');
  const [instructions, setInstructions] = useState([]);

  const addInstruction = () => {
    const txt = instructionText.trim();
    if (!txt) return;
    setInstructions(prev => [...prev, txt]);
    setInstructionText('');
  };

  const editInstruction = (idx) => {
    const instruction = instructions[idx];
    setInstructionText(instruction);
    setInstructions(prev => prev.filter((_, i) => i !== idx));
  };

  const removeInstruction = (idx) => {
    setInstructions(prev => prev.filter((_, i) => i !== idx));
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

  // Edit function for itineraries
  const editItinerary = (idx) => {
    const item = itineraries[idx];
    
    // Parse meals string back to checkboxes
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
    
    setItineraries(prev => prev.filter((_, i) => i !== idx));
  };

  // Fetch dropdowns and tour data
 useEffect(() => {
  const loadDropdownsAndTourCode = async () => {
    try {
      // Load dropdowns
      const catRes = await fetch(`${baseurl}/api/categories/all-tours`);
      const categoryData = await catRes.json();
      setCategories(Array.isArray(categoryData) ? categoryData : []);

      const destRes = await fetch(`${baseurl}/api/destinations`);
      const destData = await destRes.json();

        // Filter for international destinations only (is_domestic == 0)
      const internationalDestinations = Array.isArray(destData) 
        ? destData.filter(destination => destination.is_domestic == 0)
        : [];
      
      setDestinations(internationalDestinations);
      

      if (isEditMode) {
        // Load existing tour data for edit
        await loadTourData();
      } else {
        // Set is_international to 1 for international tours
        setFormData(prev => ({
          ...prev,
          is_international: 1
        }));
        
        // Fetch tour code with is_international=1 parameter
        // Note: Check if your backend expects "ladiesspecial" or "ladies" for tour_type
        const tourCodeRes = await fetch(
          `${baseurl}/api/tours/next-tour-code?tour_type=ladiesspecial&is_international=1`
        );
        
        if (tourCodeRes.ok) {
          const tourCodeData = await tourCodeRes.json();
          setFormData(prev => ({
            ...prev,
            tour_code: tourCodeData.next_tour_code,
            is_international: 1
          }));
        } else {
          // Fallback or handle error
          console.error('Failed to fetch tour code');
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
      
      // Fetch full tour data
      const response = await fetch(`${baseurl}/api/tours/tour/full/ladiesspecial/${id}`);
      if (!response.ok) throw new Error('Failed to fetch tour data');
      
      const data = await response.json();
      
      if (data.success) {
        // Set basic form data
        const basic = data.basic_details;
        setFormData({
          tour_code: basic.tour_code || '',
          tour_type: basic.tour_type || 'ladiesspecial',
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
          emi_remarks: basic.emi_remarks || ''
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

        // Set departures - Ladies special tours have similar structure to group tours
        if (data.departures && Array.isArray(data.departures)) {
          const formattedDepartures = data.departures.map(dept => ({
            start_date: dept.start_date ? dept.start_date.split('T')[0] : '',
            end_date: dept.end_date ? dept.end_date.split('T')[0] : '',
            status: dept.status || 'Available',
            total_seats: dept.total_seats || 40,
            booked_seats: dept.booked_seats || 0,
            description: dept.description || '',
            // 3-Star Hotel Prices
            three_star_twin: dept.three_star_twin || '',
            three_star_triple: dept.three_star_triple || '',
            three_star_child_with_bed: dept.three_star_child_with_bed || '',
            three_star_child_without_bed: dept.three_star_child_without_bed || '',
            three_star_infant: dept.three_star_infant || '',
            three_star_single: dept.three_star_single || '',
            // 4-Star Hotel Prices
            four_star_twin: dept.four_star_twin || '',
            four_star_triple: dept.four_star_triple || '',
            four_star_child_with_bed: dept.four_star_child_with_bed || '',
            four_star_child_without_bed: dept.four_star_child_without_bed || '',
            four_star_infant: dept.four_star_infant || '',
            four_star_single: dept.four_star_single || '',
            // 5-Star Hotel Prices
            five_star_twin: dept.five_star_twin || '',
            five_star_triple: dept.five_star_triple || '',
            five_star_child_with_bed: dept.five_star_child_with_bed || '',
            five_star_child_without_bed: dept.five_star_child_without_bed || '',
            five_star_infant: dept.five_star_infant || '',
            five_star_single: dept.five_star_single || ''
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
        if (data.hotels && Array.isArray(data.hotels)) {
          setHotelRows(data.hotels);
        }

        // In the loadTourData function, update the visa loading section:
if (data.visa_details && Array.isArray(data.visa_details)) {
  // Filter and set Tourist Visa items
  const touristVisaData = data.visa_details.filter(item => item.type === 'tourist');
  setTouristVisaItems(touristVisaData.map(item => ({ description: item.description })));
  
  // Filter and set Transit Visa items
  const transitVisaData = data.visa_details.filter(item => item.type === 'transit');
  setTransitVisaItems(transitVisaData.map(item => ({ description: item.description })));
  
  // Filter and set Business Visa items
  const businessVisaData = data.visa_details.filter(item => item.type === 'business');
  setBusinessVisaItems(businessVisaData.map(item => ({ description: item.description })));
  
  // Filter and set Photo items
  const photoData = data.visa_details.filter(item => item.type === 'photo');
  setPhotoItems(photoData.map(item => ({ description: item.description })));
}

// Load Visa Forms
if (data.visa_forms && Array.isArray(data.visa_forms)) {
  const formattedForms = data.visa_forms.map(form => ({
    type: form.visa_type,
    download_text: form.download_text,
    download_action: form.download_action,
    fill_action: form.fill_action,
    action1_file: form.action1_file,
    action2_file: form.action2_file,
    action1_file_url: form.action1_file_url || null,
    action2_file_url: form.action2_file_url || null
  }));
  setVisaFormItems(formattedForms);
  
  // Load remarks from the first visa form
  if (data.visa_forms.length > 0 && data.visa_forms[0].remarks) {
    setTouristVisaRemarks(data.visa_forms[0].remarks);
  }
}

// Load Visa Fees
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

// Load Submission Data
if (data.visa_submission && Array.isArray(data.visa_submission)) {
  const submissionRows = data.visa_submission.map(item => ({
    id: item.submission_id || item.id,
    label: item.label || '',
    tourist: item.tourist || '',
    transit: item.transit || '',
    business: item.business || ''
  }));
  setSubmissionRows(submissionRows);
}


        // Set transport
        if (data.transport && Array.isArray(data.transport)) {
          setTransports(data.transport);
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

        // Set images (previews only, not files)
        if (data.images && Array.isArray(data.images)) {
          const imageUrls = data.images.map(img => img.url);
          setImagePreviews(imageUrls);
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
      'emi_price', // ← Add this line
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

  // DEPARTURE FORM CHANGE - Ladies Special (SIMILAR TO GROUP)
  const handleLadiesDepartureChange = (e) => {
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

    setLadiesDepartureForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  const handleAddDeparture = () => {
    if (!ladiesDepartureForm.start_date || !ladiesDepartureForm.end_date) return;

    const departureData = {
      ...ladiesDepartureForm,
      // Ensure all price fields are numbers or null
      three_star_twin: ladiesDepartureForm.three_star_twin || null,
      three_star_triple: ladiesDepartureForm.three_star_triple || null,
      three_star_child_with_bed: ladiesDepartureForm.three_star_child_with_bed || null,
      three_star_child_without_bed: ladiesDepartureForm.three_star_child_without_bed || null,
      three_star_infant: ladiesDepartureForm.three_star_infant || null,
      three_star_single: ladiesDepartureForm.three_star_single || null,
      four_star_twin: ladiesDepartureForm.four_star_twin || null,
      four_star_triple: ladiesDepartureForm.four_star_triple || null,
      four_star_child_with_bed: ladiesDepartureForm.four_star_child_with_bed || null,
      four_star_child_without_bed: ladiesDepartureForm.four_star_child_without_bed || null,
      four_star_infant: ladiesDepartureForm.four_star_infant || null,
      four_star_single: ladiesDepartureForm.four_star_single || null,
      five_star_twin: ladiesDepartureForm.five_star_twin || null,
      five_star_triple: ladiesDepartureForm.five_star_triple || null,
      five_star_child_with_bed: ladiesDepartureForm.five_star_child_with_bed || null,
      five_star_child_without_bed: ladiesDepartureForm.five_star_child_without_bed || null,
      five_star_infant: ladiesDepartureForm.five_star_infant || null,
      five_star_single: ladiesDepartureForm.five_star_single || null
    };

    setDepartures((prev) => [...prev, departureData]);

    // Reset form
    setLadiesDepartureForm({
      start_date: '',
      end_date: '',
      status: 'Available',
      total_seats: 40,
      booked_seats: 0,
      description: '',
      // 3-Star Hotel Prices
      three_star_twin: '',
      three_star_triple: '',
      three_star_child_with_bed: '',
      three_star_child_without_bed: '',
      three_star_infant: '',
      three_star_single: '',
      // 4-Star Hotel Prices
      four_star_twin: '',
      four_star_triple: '',
      four_star_child_with_bed: '',
      four_star_child_without_bed: '',
      four_star_infant: '',
      four_star_single: '',
      // 5-Star Hotel Prices
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
    setLadiesDepartureForm(departure);
    setDepartures(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveDeparture = (idx) => {
    setDepartures((prev) => prev.filter((_, i) => i !== idx));
  };

  // EXCLUSIONS
  const handleAddExclusion = () => {
    const trimmed = exclusionText.trim();
    if (!trimmed) return;
    setExclusions((prev) => [...prev, trimmed]);
    setExclusionText('');
  };

  const editExclusion = (idx) => {
    const exclusion = exclusions[idx];
    setExclusionText(exclusion);
    setExclusions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExclusion = (idx) => {
    setExclusions((prev) => prev.filter((_, i) => i !== idx));
  };

  // INCLUSIONS
  const handleAddInclusion = () => {
    const trimmed = inclusionText.trim();
    if (!trimmed) return;
    setInclusions((prev) => [...prev, trimmed]);
    setInclusionText('');
  };

  const editInclusion = (idx) => {
    const inclusion = inclusions[idx];
    setInclusionText(inclusion);
    setInclusions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveInclusion = (idx) => {
    setInclusions(prev => prev.filter((_, i) => i !== idx));
  };

  // IMAGES
  const handleImageChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
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

    setItineraries((prev) => [
      ...prev,
      {
        day: Number(day),
        title: title.trim(),
        description: description.trim(),
        meals: mealsString
      }
    ]);

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
    setItineraries(prev => prev.filter((_, i) => i !== idx));
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
    navigate('/intl-ladies-special-tours');
  };

  const isLastTab = activeTab === TAB_LIST[TAB_LIST.length - 1];

  // AUTO-ADD WHEN USER CLICKS SAVE & CONTINUE
  const autoAddBeforeNext = () => {
    switch (activeTab) {
      case 'itineraries':
        if (itineraryItem.day && itineraryItem.title.trim()) {
          handleAddItinerary();
        }
        break;

      case 'departures':
        if (ladiesDepartureForm.start_date && ladiesDepartureForm.end_date) {
          handleAddDeparture();
        }
        break;

      case 'emiOptions':
        const hasAtLeastOneValidOption = emiOptions.some(option =>
          option.loan_amount && option.loan_amount > 0 && option.emi && option.emi > 0
        );

        if (!hasAtLeastOneValidOption) {
          setError('Please fill at least one EMI option before proceeding');
          return false;
        }
        break;

      case 'optionalTours':
        if (optionalTourItem.tour_name && optionalTourItem.tour_name.trim()) {
          addOptionalTourRow();
        }
        break;

      case 'hotels':
        if (hotelItem.city.trim() && hotelItem.hotel_name.trim()) {
          addHotelRow();
        }
        break;

         
   case 'visa':
  // Check which visa subtab is active
  if (activeVisaSubTab === 'tourist' && touristVisaForm.description.trim()) {
    addTouristVisa();
  } else if (activeVisaSubTab === 'transit' && transitVisaForm.description.trim()) {
    addTransitVisa();
  } else if (activeVisaSubTab === 'business' && businessVisaForm.description.trim()) {
    addBusinessVisa();
  } else if (activeVisaSubTab === 'photo' && photoForm.description.trim()) {
    addPhoto();
  } else if (activeVisaSubTab === 'photo' && freeFlowPhotoText.trim()) {
    addFreeFlowPhotoEntry();
  }
  break;


      case 'transport':
        if (transportItem.airline && transportItem.flight_no) {
          addTransportRow();
        }
        break;

      case 'bookingPoi':
        if (poiText && poiText.trim()) {
          addPoi();
        }
        break;

      case 'cancellation':
        if (cancelItem.cancellation_policy && cancelItem.cancellation_policy.trim()) {
          addCancelRow();
        }
        break;

      case 'instructions':
        if (instructionText && instructionText.trim()) {
          addInstruction();
        }
        break;

      case 'inclusions':
        if (inclusionText && inclusionText.trim()) {
          handleAddInclusion();
        }
        break;

      case 'exclusions':
        if (exclusionText && exclusionText.trim()) {
          handleAddExclusion();
        }
        break;

      default:
        break;
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

      // 1) PREPARE BASIC TOUR DATA FOR UPDATE
      const tourUpdateData = {
        title: formData.title.trim(),
        tour_type: formData.tour_type || 'ladiesspecial',
        primary_destination_id: formData.primary_destination_id,
        duration_days: Number(formData.duration_days) || 0,
        overview: formData.overview || '',
        base_price_adult: Number(formData.base_price_adult) || 0,
        emi_price: Number(formData.emi_price) || 0, // ← Add this line
        is_international: Number(formData.is_international) || 0,
        cost_remarks: formData.cost_remarks || '',
        hotel_remarks: formData.hotel_remarks || '',
        transport_remarks: formData.transport_remarks || '',
        emi_remarks: formData.emi_remarks || '',
        booking_poi_remarks: formData.booking_poi_remarks || '',
        cancellation_remarks: formData.cancellation_remarks || ''
      };

      console.log('Updating tour with data:', tourUpdateData);

      // 1) UPDATE TOUR BASIC DETAILS
      const tourRes = await fetch(`${baseurl}/api/tours/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourUpdateData)
      });

      const tourResponse = await tourRes.json();
      
      if (!tourRes.ok) {
        throw new Error(tourResponse.error || tourResponse.message || 'Failed to update tour');
      }

      // 2) DELETE EXISTING DATA
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

      // 3) RE-ADD ALL DATA
      // Departures - Ladies special tours (similar to group)
      if (departures.length > 0) {
        const formattedDepartures = departures.map(dept => ({
          tour_type: 'ladiesspecial',
          start_date: dept.start_date,
          end_date: dept.end_date,
          status: dept.status,
          total_seats: dept.total_seats || 40,
          booked_seats: dept.booked_seats || 0,
          description: dept.description || null,
          adult_price: dept.three_star_twin || 0,
          // 3-Star Hotel Prices
          three_star_twin: dept.three_star_twin || null,
          three_star_triple: dept.three_star_triple || null,
          three_star_child_with_bed: dept.three_star_child_with_bed || null,
          three_star_child_without_bed: dept.three_star_child_without_bed || null,
          three_star_infant: dept.three_star_infant || null,
          three_star_single: dept.three_star_single || null,
          // 4-Star Hotel Prices
          four_star_twin: dept.four_star_twin || null,
          four_star_triple: dept.four_star_triple || null,
          four_star_child_with_bed: dept.four_star_child_with_bed || null,
          four_star_child_without_bed: dept.four_star_child_without_bed || null,
          four_star_infant: dept.four_star_infant || null,
          four_star_single: dept.four_star_single || null,
          // 5-Star Hotel Prices
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

      // Optional Tours
      if (optionalTours.length > 0) {
        await fetch(`${baseurl}/api/optional-tours/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, optional_tours: optionalTours })
        });
      }

      // EMI Options
      const validEmiOptions = emiOptions.filter(opt =>
        opt.loan_amount && opt.loan_amount > 0 && opt.emi && opt.emi > 0
      );
      
      if (validEmiOptions.length > 0) {
        await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, emi_options: validEmiOptions })
        });
      }

      // Hotels
      if (hotelRows.length > 0) {
        await fetch(`${baseurl}/api/tour-hotels/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, hotels: hotelRows })
        });
      }

      // Delete existing visa data (only for international tours)
if (formData.is_international === 1) {
  try {
    await fetch(`${baseurl}/api/visa/tour/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Failed to delete visa data:', err.message);
  }
}

// Add visa data (only for international tours)
if (formData.is_international === 1) {
 // In createTour function:
const uploadedVisaForms = await uploadVisaFormFiles( visaFormItems);

// Add this function for uploading visa form files
const uploadVisaFormFiles = async (tourId, visaForms) => {
  const uploadedForms = [];

  for (const form of visaForms) {
    const formData = {
      type: form.type,
      download_text: form.download_text,
      download_action: form.download_action,
      fill_action: form.fill_action,
      action1_file: null,
      action2_file: null
    };

    // Upload action1_file (PDF) if exists
    if (form.action1_file && typeof form.action1_file === 'object') {
      const fileName = await handleVisaFormFileUpload(tourId, form.type, 'action1', form.action1_file);
      if (fileName) {
        formData.action1_file = fileName;
      }
    } else if (form.action1_file && typeof form.action1_file === 'string') {
      // Already a filename (from editing)
      formData.action1_file = form.action1_file;
    }

    // Upload action2_file (Word) if exists
    if (form.action2_file && typeof form.action2_file === 'object') {
      const fileName = await handleVisaFormFileUpload(tourId, form.type, 'action2', form.action2_file);
      if (fileName) {
        formData.action2_file = fileName;
      }
    } else if (form.action2_file && typeof form.action2_file === 'string') {
      // Already a filename (from editing)
      formData.action2_file = form.action2_file;
    }

    uploadedForms.push(formData);
  }

  return uploadedForms;
};

// Update visa data preparation in both createTour and updateTour:
const visaData = {
  tourist_visa: touristVisaItems,
  transit_visa: transitVisaItems,
  business_visa: businessVisaItems,
  visa_forms: uploadedVisaForms.map(form => ({
    type: form.type,
    download_text: form.download_text,
    download_action: form.download_action,
    fill_action: form.fill_action,
    action1_file: form.action1_file, // Filename string
    action2_file: form.action2_file  // Filename string
  })),
  photo: [...photoItems, ...freeFlowPhotoEntries],
  visa_fees: visaFeesRows.map(row => ({
    type: row.type,
    tourist: row.tourist,
    transit: row.transit,
    business: row.business,
    tourist_charges: row.tourist_charges,
    transit_charges: row.transit_charges,
    business_charges: row.business_charges
  })),
  submission: submissionRows.map((row, index) => ({
    label: row.label,
    tourist: row.tourist,
    transit: row.transit,
    business: row.business,
    row_order: index
  })),
  tourist_visa_remarks: touristVisaRemarks
};

  if (touristVisaItems.length > 0 || transitVisaItems.length > 0 || 
      businessVisaItems.length > 0 || photoItems.length > 0) {
    await fetch(`${baseurl}/api/visa/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tour_id: id, ...visaData })
    });
  }
}

      // Transport
      if (transports.length > 0) {
        await fetch(`${baseurl}/api/tour-transports/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: transports })
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

      // Exclusions
      if (exclusions.length > 0) {
        await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: id, items: exclusions })
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

      // Images (only if new files added)
      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach((file) => {
          formDataImages.append('images', file);
        });

        if (imageCaption.trim()) {
          formDataImages.append('caption', imageCaption.trim());
        }

        await fetch(`${baseurl}/api/images/upload/${id}`, {
          method: 'POST',
          body: formDataImages
        });
      }

      setSuccess('Tour updated successfully!');
      setTimeout(() => navigate('/intl-ladies-special-tours'), 1500);
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

      // 1) CREATE TOUR
      const tourRes = await fetch(`${baseurl}/api/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!tourRes.ok) {
        const err = await tourRes.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create tour');
      }

      const tourData = await tourRes.json();
      const tourId = tourData.tour_id || tourData.id || tourData.insertId;

      // 2) DEPARTURES BULK - LADIES SPECIAL TOURS
      if (departures.length > 0) {
        const formattedDepartures = departures.map(dept => ({
          tour_type: 'ladiesspecial',
          start_date: dept.start_date,
          end_date: dept.end_date,
          status: dept.status,
          total_seats: dept.total_seats || 40,
          booked_seats: dept.booked_seats || 0,
          description: dept.description || null,
          adult_price: dept.three_star_twin || 0,
          // 3-Star Hotel Prices
          three_star_twin: dept.three_star_twin || null,
          three_star_triple: dept.three_star_triple || null,
          three_star_child_with_bed: dept.three_star_child_with_bed || null,
          three_star_child_without_bed: dept.three_star_child_without_bed || null,
          three_star_infant: dept.three_star_infant || null,
          three_star_single: dept.three_star_single || null,
          // 4-Star Hotel Prices
          four_star_twin: dept.four_star_twin || null,
          four_star_triple: dept.four_star_triple || null,
          four_star_child_with_bed: dept.four_star_child_with_bed || null,
          four_star_child_without_bed: dept.four_star_child_without_bed || null,
          four_star_infant: dept.four_star_infant || null,
          four_star_single: dept.four_star_single || null,
          // 5-Star Hotel Prices
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

      // 3) EXCLUSIONS
      if (exclusions.length > 0) {
        await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: exclusions })
        });
      }

      // 4) IMAGES
      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach((file) => {
          formDataImages.append('images', file);
        });
        if (imageCaption.trim()) {
          formDataImages.append('caption', imageCaption.trim());
        }
        await fetch(`${baseurl}/api/images/upload/${tourId}`, {
          method: 'POST',
          body: formDataImages
        });
      }

      // 5) INCLUSIONS
      if (inclusions.length > 0) {
        await fetch(`${baseurl}/api/inclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: inclusions })
        });
      }

      // 6) ITINERARY DAYS
      if (itineraries.length > 0) {
        const payload = itineraries.map((item) => ({
          ...item,
          tour_id: tourId
        }));
        await fetch(`${baseurl}/api/itineraries/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      // 7) OPTIONAL TOURS BULK
      if (optionalTours.length > 0) {
        await fetch(`${baseurl}/api/optional-tours/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, optional_tours: optionalTours })
        });
      }

      // 8) EMI OPTIONS BULK
      const validEmiOptions = emiOptions.filter(opt =>
        opt.loan_amount && opt.loan_amount > 0 && opt.emi && opt.emi > 0
      );

      if (validEmiOptions.length > 0) {
        await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, emi_options: validEmiOptions })
        });
      }

      // 9) HOTELS BULK
      if (hotelRows.length > 0) {
        await fetch(`${baseurl}/api/tour-hotels/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, hotels: hotelRows })
        });
      }

      // Save Visa Data (only for international tours)
if (formData.is_international === 1) {

  // In createTour function:
const uploadedVisaForms = await uploadVisaFormFiles(tourId, visaFormItems);

// Add this function for uploading visa form files
const uploadVisaFormFiles = async (tourId, visaForms) => {
  const uploadedForms = [];

  for (const form of visaForms) {
    const formData = {
      type: form.type,
      download_text: form.download_text,
      download_action: form.download_action,
      fill_action: form.fill_action,
      action1_file: null,
      action2_file: null
    };

    // Upload action1_file (PDF) if exists
    if (form.action1_file && typeof form.action1_file === 'object') {
      const fileName = await handleVisaFormFileUpload(tourId, form.type, 'action1', form.action1_file);
      if (fileName) {
        formData.action1_file = fileName;
      }
    } else if (form.action1_file && typeof form.action1_file === 'string') {
      // Already a filename (from editing)
      formData.action1_file = form.action1_file;
    }

    // Upload action2_file (Word) if exists
    if (form.action2_file && typeof form.action2_file === 'object') {
      const fileName = await handleVisaFormFileUpload(tourId, form.type, 'action2', form.action2_file);
      if (fileName) {
        formData.action2_file = fileName;
      }
    } else if (form.action2_file && typeof form.action2_file === 'string') {
      // Already a filename (from editing)
      formData.action2_file = form.action2_file;
    }

    uploadedForms.push(formData);
  }

  return uploadedForms;
};

// Update visa data preparation in both createTour and updateTour:
const visaData = {
  tourist_visa: touristVisaItems,
  transit_visa: transitVisaItems,
  business_visa: businessVisaItems,
  visa_forms: uploadedVisaForms.map(form => ({
    type: form.type,
    download_text: form.download_text,
    download_action: form.download_action,
    fill_action: form.fill_action,
    action1_file: form.action1_file, // Filename string
    action2_file: form.action2_file  // Filename string
  })),
  photo: [...photoItems, ...freeFlowPhotoEntries],
  visa_fees: visaFeesRows.map(row => ({
    type: row.type,
    tourist: row.tourist,
    transit: row.transit,
    business: row.business,
    tourist_charges: row.tourist_charges,
    transit_charges: row.transit_charges,
    business_charges: row.business_charges
  })),
  submission: submissionRows.map((row, index) => ({
    label: row.label,
    tourist: row.tourist,
    transit: row.transit,
    business: row.business,
    row_order: index
  })),
  tourist_visa_remarks: touristVisaRemarks
};

  if (touristVisaItems.length > 0 || transitVisaItems.length > 0 || 
      businessVisaItems.length > 0 || photoItems.length > 0) {
    await fetch(`${baseurl}/api/visa/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tour_id: tourId, ...visaData })
    });
  }
}

      // 10) TRANSPORT BULK
      if (transports.length > 0) {
        await fetch(`${baseurl}/api/tour-transports/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: transports })
        });
      }

      // 11) BOOKING POI BULK
      if (bookingPois.length > 0) {
        await fetch(`${baseurl}/api/tour-booking-poi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: bookingPois })
        });
      }

      // 12) CANCELLATION BULK
      if (cancelPolicies.length > 0) {
        await fetch(`${baseurl}/api/tour-cancellation/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, policies: cancelPolicies })
        });
      }

      // 13) INSTRUCTIONS BULK
      if (instructions.length > 0) {
        await fetch(`${baseurl}/api/tour-instructions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: instructions })
        });
      }

      setSuccess('Tour saved successfully!');
      setTimeout(() => navigate('/intl-ladies-special-tours'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to save tour');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    autoAddBeforeNext();

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

  // Dynamic "+ Add ..." button for bottom bar
  const getAddConfigForTab = (tabKey) => {
    switch (tabKey) {
      case 'itineraries':
        return { label: '+ Add Day', onClick: handleAddItinerary };
      case 'departures':
        return { label: '+ Add Departure', onClick: handleAddDeparture };
      case 'optionalTours':
        return { label: '+ Add Optional Tour', onClick: addOptionalTourRow };
      case 'inclusions':
        return { label: '+ Add Inclusion', onClick: handleAddInclusion };
      case 'exclusions':
        return { label: '+ Add Exclusion', onClick: handleAddExclusion };
      case 'transport':
        return { label: '+ Add Transport', onClick: addTransportRow };
      case 'hotels':
        return { label: '+ Add Hotel', onClick: addHotelRow };

        case 'visa':
      // Check which visa subtab is active
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
      }
      return null;

      case 'bookingPoi':
        return { label: '+ Add POI', onClick: addPoi };
      case 'cancellation':
        return { label: '+ Add Policy', onClick: addCancelRow };
      case 'instructions':
        return { label: '+ Add Instruction', onClick: addInstruction };
      default:
        return null;
    }
  };

  const addConfig = getAddConfigForTab(activeTab);

  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">{isEditMode ? 'Edit Ladies Special Tour' : 'Add Ladies Special Tour'}</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

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
                        <Form.Label>International States *</Form.Label>
                           <Form.Select
                                  name="primary_destination_id"
                                  value={formData.primary_destination_id}
                                  onChange={handleBasicChange}
                           >
                                <option value="">Select Destination</option>
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

              {/* ======== DEPARTURES TAB - LADIES SPECIAL TOUR ======== */}
              <Tab eventKey="departures" title="Departures">
                <div>
                  {/* Departure Dates Section */}
                  <Row className="mb-4">
                    <h5>Departure Dates</h5>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="start_date"
                          value={ladiesDepartureForm.start_date}
                          onChange={handleLadiesDepartureChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="end_date"
                          value={ladiesDepartureForm.end_date}
                          onChange={handleLadiesDepartureChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status *</Form.Label>
                        <Form.Select
                          name="status"
                          value={ladiesDepartureForm.status}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.total_seats}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.booked_seats}
                          onChange={handleLadiesDepartureChange}
                          placeholder="Booked seats"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          name="description"
                          value={ladiesDepartureForm.description}
                          onChange={handleLadiesDepartureChange}
                          placeholder="Optional description"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* 3-Star Hotel Prices */}
                  <Row className="mb-4">
                    <h5>3-Star Hotel Prices</h5>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Twin Sharing</Form.Label>
                        <Form.Control
                          type="number"
                          name="three_star_twin"
                          value={ladiesDepartureForm.three_star_twin}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.three_star_triple}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.three_star_child_with_bed}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.three_star_child_without_bed}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.three_star_infant}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.three_star_single}
                          onChange={handleLadiesDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* 4-Star Hotel Prices */}
                  <Row className="mb-4">
                    <h5>4-Star Hotel Prices</h5>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Twin Sharing</Form.Label>
                        <Form.Control
                          type="number"
                          name="four_star_twin"
                          value={ladiesDepartureForm.four_star_twin}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.four_star_triple}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.four_star_child_with_bed}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.four_star_child_without_bed}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.four_star_infant}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.four_star_single}
                          onChange={handleLadiesDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* 5-Star Hotel Prices */}
                  <Row className="mb-4">
                    <h5>5-Star Hotel Prices</h5>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Twin Sharing</Form.Label>
                        <Form.Control
                          type="number"
                          name="five_star_twin"
                          value={ladiesDepartureForm.five_star_twin}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.five_star_triple}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.five_star_child_with_bed}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.five_star_child_without_bed}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.five_star_infant}
                          onChange={handleLadiesDepartureChange}
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
                          value={ladiesDepartureForm.five_star_single}
                          onChange={handleLadiesDepartureChange}
                          placeholder="₹"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Display Added Departures */}
                  {departures.length > 0 && (
                    <div className="mt-4">
                      <h6>Added Departures:</h6>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Seats</th>
                            <th>3-Star Twin</th>
                            <th>4-Star Twin</th>
                            <th>5-Star Twin</th>
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
                </div>
              </Tab>

              <Tab eventKey="costs" title="Tour Cost">
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

                <Form.Group className="mt-3">
                  <Form.Label>EMI Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="emi_remarks"
                    value={formData.emi_remarks}
                    onChange={handleBasicChange}
                  />
                </Form.Group>
              </Tab>

              {/* ======== OPTIONAL TOURS ======== */}
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
                        type="number"
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
                        type="number"
                        name="child_price"
                        value={optionalTourItem.child_price}
                        onChange={handleOptionalTourChange}
                        placeholder="Enter child price"
                      />
                    </Form.Group>
                  </Col>
                </Row>

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

              {/* ======== EMI OPTIONS (MANUAL) ======== */}
              <Tab eventKey="emiOptions" title="EMI Options">
                <Table striped bordered hover responsive className="align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th width="5%">#</th>
                      <th width="30%">Particulars</th>
                      <th width="25%">Loan Amount</th>
                      <th width="15%">Months</th>
                      <th width="25%">EMI</th>
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
                                onChange={(e) => handleLoanAmountChange(index, e.target.value)}
                                placeholder="Optional"
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
                                onChange={(e) => handleEMIChange(index, e.target.value)}
                                placeholder="Optional"
                              />
                            </InputGroup>
                          </Form.Group>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Row className="mt-3">
                  <Col md={12} className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        <i className="fas fa-info-circle"></i> Fill only the options you want to offer. Leave others empty.
                      </small>
                    </div>
                  </Col>
                </Row>
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

              {/* ======== TRANSPORT TAB - LADIES SPECIAL TOUR ======== */}
              <Tab eventKey="transport" title="Transport">
                <Row className="mt-3">
                  {/* Airline */}
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

                  {/* Flight No */}
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

                  {/* Via */}
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

                  {/* FROM */}
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

                  {/* TO */}
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

                {/* ================= TRANSPORT REMARKS ================= */}
                <Form.Group className="mt-4">
                  <Form.Label>Transport Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="transport_remarks"
                    value={formData.transport_remarks}
                    onChange={handleBasicChange}
                  />
                </Form.Group>

                {/* ================= TABLE ================= */}
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

              <Tab eventKey="hotels" title="Hotels">
                <Row className="align-items-end">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={hotelItem.city}
                        onChange={handleHotelChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Hotel Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="hotel_name"
                        value={hotelItem.hotel_name}
                        onChange={handleHotelChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Standard</Form.Label>
                      <Form.Control
                        type="number"
                        name="hotel_standard"
                        value={hotelItem.hotel_standard}
                        onChange={handleHotelChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Deluxe</Form.Label>
                      <Form.Control
                        type="number"
                        name="hotel_deluxe"
                        value={hotelItem.hotel_deluxe}
                        onChange={handleHotelChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Executive</Form.Label>
                      <Form.Control
                        type="number"
                        name="hotel_executive"
                        value={hotelItem.hotel_executive}
                        onChange={handleHotelChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Room Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="room_type"
                        value={hotelItem.room_type}
                        onChange={handleHotelChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
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
                        <th>Hotel</th>
                        <th>Room</th>
                        <th>Nights</th>
                        <th>Standard</th>
                        <th>Deluxe</th>
                        <th>Executive</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelRows.map((h, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{h.city}</td>
                          <td>{h.hotel_name}</td>
                          <td>{h.room_type}</td>
                          <td>{h.nights}</td>
                          <td>{h.hotel_standard}</td>
                          <td>{h.hotel_deluxe}</td>
                          <td>{h.hotel_executive}</td>
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

              {/* ======== VISA TAB ======== */}
{formData.is_international === 1 && (
  <Tab eventKey="visa" title="Visa">
    <Tabs
      activeKey={activeVisaSubTab}
      onSelect={(k) => setActiveVisaSubTab(k)}
      className="mb-4"
    >
      {/* Subtab 1: Tourist Visa */}
      <Tab eventKey="tourist" title="Tourist Visa">
        <Form.Group className="mb-3">
          <Form.Label>Free Flow Entry (Same like departure field)</Form.Label>
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
          <Form.Label>Free Flow Entry (Same like departure field)</Form.Label>
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
          <Form.Label>Free Flow Entry (Same like departure field)</Form.Label>
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
  <Table striped bordered hover size="sm">
    <thead>
      <tr>
        <th>Visa Type</th>
        <th>Form Download</th>
        <th>Action 1 (Upload PDF)</th>
        <th>Action 2 (Upload Word)</th>
      </tr>
    </thead>
    <tbody>
      {visaFormItems.map((item, idx) => (
        <tr key={idx}>
          <td>{item.type}</td>
          <td>{item.download_text}</td>
          <td>
            <div className="mb-2">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => document.getElementById(`pdf-upload-${idx}`).click()}
              >
                {item.action1_file ? 'Change PDF' : 'Upload PDF'}
              </Button>
              <Form.Control
                type="file"
                id={`pdf-upload-${idx}`}
                accept=".pdf"
                className="d-none"
                onChange={(e) => handleVisaFormFileChange(idx, 'action1', e.target.files[0])}
              />
              {item.action1_file && (
                <div className="mt-1 small">
                  <span className="text-success">
                    ✓ {typeof item.action1_file === 'string' ? item.action1_file : item.action1_file.name}
                  </span>
                </div>
              )}
            </div>
          </td>
          <td>
            <div className="mb-2">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => document.getElementById(`word-upload-${idx}`).click()}
              >
                {item.action2_file ? 'Change Word' : 'Upload Word'}
              </Button>
              <Form.Control
                type="file"
                id={`word-upload-${idx}`}
                accept=".doc,.docx"
                className="d-none"
                onChange={(e) => handleVisaFormFileChange(idx, 'action2', e.target.files[0])}
              />
              {item.action2_file && (
                <div className="mt-1 small">
                  <span className="text-success">
                    ✓ {typeof item.action2_file === 'string' ? item.action2_file : item.action2_file.name}
                  </span>
                </div>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>

  <Card className="mt-3">
    <Card.Body>
      <Form.Group>
        <Form.Label>Free Flow Remarks (Same like Tourist Visa)</Form.Label>
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
      {/* Subtab 5: Photo */}
<Tab eventKey="photo" title="Photo">
  {/* Free Flow Entry Section */}
  <Card className="mb-3">
    <Card.Body>
      <Form.Group className="mb-3">
        <Form.Label>Add Free Flow Entry</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            as="textarea"
            rows={2}
            value={freeFlowPhotoText}
            onChange={handleFreeFlowPhotoChange}
            placeholder="Type free flow entry"
          />
          <Button 
            variant="success" 
            onClick={addFreeFlowPhotoEntry}
            className="align-self-start"
          >
            + Add Free Flow
          </Button>
        </div>
      </Form.Group>

      {freeFlowPhotoEntries.length > 0 && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Free Flow Entry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {freeFlowPhotoEntries.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.description || '-'}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => editFreeFlowPhotoEntry(idx)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFreeFlowPhotoEntry(idx)}
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
    </Card.Body>
  </Card>

  {/* Existing Photo Items Table */}
  {photoItems.length > 0 && (
    <Card>
      <Card.Body>
        <h6>Photo Requirements List</h6>
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
              disabled={row.id <= 3} // Prevent removing first 3 rows
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
      {submissionRows.map((row, idx) => (
        <tr key={idx}>
          <td>
            <Form.Control
              type="text"
              value={row.label}
              onChange={(e) => {
                const updated = [...submissionRows];
                updated[idx].label = e.target.value;
                setSubmissionRows(updated);
              }}
              placeholder="Enter item label"
              size="sm"
            />
          </td>
          <td>
            <Form.Control
              type="text"
              value={row.tourist}
              onChange={(e) => {
                const updated = [...submissionRows];
                updated[idx].tourist = e.target.value;
                setSubmissionRows(updated);
              }}
              placeholder="Free flow alphanumeric"
              size="sm"
            />
          </td>
          <td>
            <Form.Control
              type="text"
              value={row.transit}
              onChange={(e) => {
                const updated = [...submissionRows];
                updated[idx].transit = e.target.value;
                setSubmissionRows(updated);
              }}
              placeholder="Free flow alphanumeric"
              size="sm"
            />
          </td>
          <td>
            <Form.Control
              type="text"
              value={row.business}
              onChange={(e) => {
                const updated = [...submissionRows];
                updated[idx].business = e.target.value;
                setSubmissionRows(updated);
              }}
              placeholder="Free flow alphanumeric"
              size="sm"
            />
          </td>
          <td>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeSubmissionRow(idx)}
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

              <Tab eventKey="bookingPoi" title="Booking POI">
                <Form.Group className="mb-3">
                  <Row>
                    <Col md={8}>
                      <Form.Label>Add POI Item</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={poiText}
                        onChange={(e) => setPoiText(e.target.value)}
                        placeholder="Type and click Add"
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
                    <Form.Label>Booking POI Remarks</Form.Label>
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
                          <td>{p.item}</td>
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
                    <Form.Group>
                      <Form.Label>Cancellation Policy</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="cancellation_policy"
                        value={cancelItem.cancellation_policy}
                        onChange={handleCancelChange}
                        placeholder="Type cancellation policy here"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Charges</Form.Label>
                      <Form.Control
                        type="text"
                        name="charges"
                        value={cancelItem.charges}
                        onChange={handleCancelChange}
                        placeholder="Example: No refund / 50% retained"
                      />
                    </Form.Group>
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
                          <td>{c.cancellation_policy}</td>
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
                <Form.Group className="mb-3">
                  <Form.Label>Upload Images</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleImageChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Caption (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                  />
                </Form.Group>

                {imagePreviews.length > 0 && (
                  <Row>
                    {imagePreviews.map((src, idx) => (
                      <Col md={3} key={idx}>
                        <img
                          src={src}
                          alt="preview"
                          style={{ width: '100%', borderRadius: 8 }}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab>
            </Tabs>

            {/* ======== BUTTONS ======== */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
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
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddLadiesTour;