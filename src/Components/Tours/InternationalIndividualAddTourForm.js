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

// Add these state variables near your other state declarations
const [editingVisaItemId, setEditingVisaItemId] = useState(null);
const [editingVisaFormIndex, setEditingVisaFormIndex] = useState(null);
const [visaFormEditData, setVisaFormEditData] = useState({
  type: '',
  download_action: '',
  fill_action: '',
  action1_file: null,
  action2_file: null
});

// Edit Visa Form Item
const editVisaFormItem = (index) => {
  const formItem = visaFormItems[index];
  setVisaFormEditData({
    type: formItem.type,
    // download_text: formItem.download_text,
    download_action: formItem.download_action,
    fill_action: formItem.fill_action,
    action1_file: formItem.action1_file,
    action2_file: formItem.action2_file
  });
  setEditingVisaFormIndex(index);
  setActiveVisaSubTab('form');
};

// Update Visa Form Item
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

// Reset Visa Form Edit
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


// Reset editing context for visa items
const resetVisaEditing = () => {
  setEditingItem(null);
  setEditingType('');
  setEditIndex(-1);
  setEditingVisaItemId(null);
  setEditingVisaFormIndex(null);
  
  // Also reset form fields
  setTouristVisaForm({ description: '' });
  setTransitVisaForm({ description: '' });
  setBusinessVisaForm({ description: '' });
  setPhotoForm({ description: '' });
  setFreeFlowPhotoText('');
  
  // Reset visa form edit data
  setVisaFormEditData({
    type: '',
    download_action: '',
    fill_action: '',
    action1_file: null,
    action2_file: null
  });
};


// Handle Visa Form Edit Change
const handleVisaFormEditChange = (e) => {
  const { name, value } = e.target;
  setVisaFormEditData(prev => ({
    ...prev,
    [name]: value
  }));
};

// Handle Visa Form File Change with Edit Support
// Handle Visa Form File Change with Edit Support
const handleVisaFormFileChangeWithEdit = async (index, action, file) => {
  if (!file) return;
  
  if (editingVisaFormIndex !== null && editingVisaFormIndex === index) {
    // If editing, update the edit data - store as File object
    setVisaFormEditData(prev => ({
      ...prev,
      [action === 'action1' ? 'action1_file' : 'action2_file']: file
    }));
  } else {
    // If not editing, update the main list
    const updated = [...visaFormItems];
    updated[index][action === 'action1' ? 'action1_file' : 'action2_file'] = file;
    setVisaFormItems(updated);
  }
  
  // Upload file if in edit mode (only upload when editing existing tour)
  if (isEditMode && id) {
    const visaType = editingVisaFormIndex !== null 
      ? visaFormEditData.type 
      : visaFormItems[index].type;
    
    const uploadedFileName = await handleVisaFormFileUpload(id, visaType, action, file);
    if (uploadedFileName) {
      if (editingVisaFormIndex !== null && editingVisaFormIndex === index) {
        // Update edit data with filename string
        setVisaFormEditData(prev => ({
          ...prev,
          [action === 'action1' ? 'action1_file' : 'action2_file']: uploadedFileName
        }));
      } else {
        // Update main list with filename string
        const updatedWithFilename = [...visaFormItems];
        updatedWithFilename[index][action === 'action1' ? 'action1_file' : 'action2_file'] = uploadedFileName;
        setVisaFormItems(updatedWithFilename);
      }
    }
  }
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
    duration_days: '',
    overview: '',
    base_price_adult: '',
    emi_price: '',
    is_international: 1,
    cost_remarks: "",
    hotel_remarks: "",
    transport_remarks: "",
    booking_poi_remarks: "",
    cancellation_remarks: "",
    emi_remarks: "",
      optional_tour_remarks: "" // ← ADD THIS LINE
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
  ...(formData.is_international === 1 ? ['visa'] : []), // Main visa tab
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


// Add these for image management:
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

// Add this near other state declarations
const [activeVisaSubTab, setActiveVisaSubTab] = useState('tourist');

// Transit Visa
const [transitVisaItems, setTransitVisaItems] = useState([]);
const [transitVisaForm, setTransitVisaForm] = useState({ description: '' });

// Business Visa
const [businessVisaItems, setBusinessVisaItems] = useState([]);
const [businessVisaForm, setBusinessVisaForm] = useState({ description: '' });

// Visa Form
// Replace the current visaFormItems state with:
const [visaFormItems, setVisaFormItems] = useState([
  {
    type: 'Tourist Visa',
    // download_text: 'Tourist Visa Form Download',
    download_action: 'Download',
    fill_action: 'Fill Manually',
    action1_file: null, // PDF upload
    action2_file: null  // Word document upload
  },
  {
    type: 'Transit Visa',
    // download_text: 'Transit Visa Form Download',
    download_action: 'Download',
    fill_action: 'Fill Manually',
    action1_file: null,
    action2_file: null
  },
  {
    type: 'Business Visa',
    // download_text: 'Business Visa Form Download',
    download_action: 'Download',
    fill_action: 'Fill Manually',
    action1_file: null,
    action2_file: null
  }
]);

// Add state for tourist visa remarks (free flow field)
const [touristVisaRemarks, setTouristVisaRemarks] = useState('');

// Photo
const [photoItems, setPhotoItems] = useState([]);
const [photoForm, setPhotoForm] = useState({ description: '' });






// Add this near your other state declarations
const [freeFlowPhotoEntries, setFreeFlowPhotoEntries] = useState([]);
const [freeFlowPhotoText, setFreeFlowPhotoText] = useState('');


// Add this function to handle file viewing
// Replace the getFileUrl function with this:
// Replace the getFileUrl function with this FIXED version:
const getFileUrl = (fileName) => {
  // If fileName is null, undefined, or not a string, return null
  if (!fileName || typeof fileName !== 'string') {
    return null;
  }
  
  // If it's already a URL, return it
  if (fileName.startsWith('http')) {
    return fileName;
  }
  
  // Check if it's a relative URL (starts with /uploads/)
  if (fileName.startsWith('/uploads/')) {
    return `${baseurl}${fileName}`;
  }
  
  // If it's just a filename, construct the correct URL
  // Based on your backend, files are stored in: /uploads/visa/{filename}
  return `${baseurl}/uploads/visa/${fileName}`;
};

// Also add a helper function to download files
const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'file';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to open file in new tab (for viewing)
const openFileInNewTab = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
};

// Function to check if file is a PDF
const isPDF = (fileName) => {
  return fileName && (fileName.toLowerCase().endsWith('.pdf') || fileName.toLowerCase().includes('pdf'));
};

// Function to check if file is a Word document
const isWordDoc = (fileName) => {
  return fileName && (fileName.toLowerCase().endsWith('.doc') || 
                      fileName.toLowerCase().endsWith('.docx') ||
                      fileName.toLowerCase().includes('word') ||
                      fileName.toLowerCase().includes('doc'));
};


// Add these functions near your other handler functions


// Remove Free Flow Photo Entry
const removeFreeFlowPhotoEntry = (idx) => {
  setFreeFlowPhotoEntries(prev => prev.filter((_, i) => i !== idx));
};

// Handle Free Flow Photo Text Change
const handleFreeFlowPhotoChange = (e) => {
  setFreeFlowPhotoText(e.target.value);
};

// Visa Fees

// Replace the current visaFeesRows state with:
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

// Update the extendableRow state:
const [extendableRow, setExtendableRow] = useState({
  type: 'Extendable as per requirement',
  tourist: '',
  transit: '',
  business: '',
  tourist_charges: '',
  transit_charges: '',
  business_charges: ''
});



// Function to add new free flow entry
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


// Function to remove a row
const removeVisaFeesRow = (id) => {
  setVisaFeesRows(visaFeesRows.filter(row => row.id !== id));
};

// Submission & Pick Up
// Add these states near your other state declarations
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

// Function to add new free flow entry in Submission & Pick Up
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

// Function to remove a row from Submission & Pick Up
const removeSubmissionRow = (id) => {
  setSubmissionRows(submissionRows.filter(row => row.id !== id));
};

// Function to handle label change in Submission & Pick Up
const handleSubmissionLabelChange = (id, value) => {
  const updated = submissionRows.map(row => 
    row.id === id ? { ...row, label: value } : row
  );
  setSubmissionRows(updated);
};

// Function to handle value change in Submission & Pick Up
const handleSubmissionValueChange = (id, field, value) => {
  const updated = submissionRows.map(row => 
    row.id === id ? { ...row, [field]: value } : row
  );
  setSubmissionRows(updated);
};

  // ========================
  // EDIT FUNCTIONS - FIXED
  // ========================

  // Edit itinerary - FIXED: Only sets form for editing, doesn't remove from list
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
    // Set editing context
    setEditingItem(item);
    setEditingType('itinerary');
    setEditIndex(idx);
  };

  // Edit departure - FIXED
  const editDeparture = (idx) => {
    const departure = departures[idx];
    setDepartureForm(departure);
    setEditingItem(departure);
    setEditingType('departure');
    setEditIndex(idx);
  };

  // Edit cost row - FIXED
  const editCostRow = (idx) => {
    const item = tourCosts[idx];
    setTourCostItem(item);
    setEditingItem(item);
    setEditingType('cost');
    setEditIndex(idx);
  };

  // Edit optional tour - FIXED
  const editOptionalTourRow = (idx) => {
    const item = optionalTours[idx];
    setOptionalTourItem(item);
    setEditingItem(item);
    setEditingType('optionalTour');
    setEditIndex(idx);
  };

  // Edit hotel row - FIXED
  const editHotelRow = (idx) => {
    const item = hotelRows[idx];
    setHotelItem(item);
    setEditingItem(item);
    setEditingType('hotel');
    setEditIndex(idx);
  };

  // Edit transport row - FIXED
  const editTransportRow = (idx) => {
    const item = transports[idx];
    setTransportItem(item);
    setEditingItem(item);
    setEditingType('transport');
    setEditIndex(idx);
  };

  // Edit inclusion - FIXED
  const editInclusion = (idx) => {
    const inclusion = inclusions[idx];
    setInclusionText(inclusion);
    setEditingItem(inclusion);
    setEditingType('inclusion');
    setEditIndex(idx);
  };

  // Edit exclusion - FIXED
  const editExclusion = (idx) => {
    const exclusion = exclusions[idx];
    setExclusionText(exclusion);
    setEditingItem(exclusion);
    setEditingType('exclusion');
    setEditIndex(idx);
  };

  // Edit POI - FIXED
  const editPoi = (idx) => {
    const poi = bookingPois[idx];
    setPoiText(poi.item);
    setPoiAmount(poi.amount_details);
    setEditingItem(poi);
    setEditingType('poi');
    setEditIndex(idx);
  };

  // Edit cancel policy - FIXED
  const editCancelRow = (idx) => {
    const policy = cancelPolicies[idx];
    setCancelItem(policy);
    setEditingItem(policy);
    setEditingType('cancellation');
    setEditIndex(idx);
  };

  // Edit instruction - FIXED
  const editInstruction = (idx) => {
    const instruction = instructions[idx];
    setInstructionText(instruction);
    setEditingItem(instruction);
    setEditingType('instruction');
    setEditIndex(idx);
  };

  
  // Edit Tourist Visa
const editTouristVisa = (idx) => {
  const item = touristVisaItems[idx];
  setTouristVisaForm({ description: item.description });
  setEditingItem(item);
  setEditingType('touristVisa');
  setEditIndex(idx);
  setEditingVisaItemId(idx); // This should be definedTab
};

// Edit Transit Visa
const editTransitVisa = (idx) => {
  const item = transitVisaItems[idx];
  setTransitVisaForm({ description: item.description });
  setEditingItem(item);
  setEditingType('transitVisa');
  setEditIndex(idx);
  setEditingVisaItemId(idx); // This should be defined
};

// Edit Business Visa
const editBusinessVisa = (idx) => {
  const item = businessVisaItems[idx];
  setBusinessVisaForm({ description: item.description });
  setEditingItem(item);
  setEditingType('businessVisa');
  setEditIndex(idx);
  setEditingVisaItemId(idx); // This should be defined
};

// Edit Photo
const editPhoto = (idx) => {
  const item = photoItems[idx];
  setPhotoForm({ description: item.description });
  setEditingItem(item);
  setEditingType('photo');
  setEditIndex(idx);
  setEditingVisaItemId(idx); // This should be defined
};

// Edit Free Flow Photo Entry
const editFreeFlowPhotoEntry = (idx) => {
  const item = freeFlowPhotoEntries[idx];
  setFreeFlowPhotoText(item.description);
  setEditingItem(item);
  setEditingType('freeFlowPhoto');
  setEditIndex(idx);
  setEditingVisaItemId(idx); // This should be defined
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

    const processedItem = {
      ...optionalTourItem,
    //    adult_price: optionalTourItem.adult_price || '',
    // child_price: optionalTourItem.child_price || ''
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


// Add/Update Tourist Visa
const addTouristVisa = () => {
  const trimmed = touristVisaForm.description.trim();
  if (!trimmed) return;
  
  const newItem = { description: trimmed };
  
  if (editingType === 'touristVisa' && editIndex !== -1) {
    // Update existing item
    const updated = [...touristVisaItems];
    updated[editIndex] = newItem;
    setTouristVisaItems(updated);
  } else {
    // Add new item
    setTouristVisaItems(prev => [...prev, newItem]);
  }
  
  // Reset form
  setTouristVisaForm({ description: '' });
  resetVisaEditing(); // This should be defined
};

// Add/Update Transit Visa
const addTransitVisa = () => {
  const trimmed = transitVisaForm.description.trim();
  if (!trimmed) return;
  
  const newItem = { description: trimmed };
  
  if (editingType === 'transitVisa' && editIndex !== -1) {
    // Update existing item
    const updated = [...transitVisaItems];
    updated[editIndex] = newItem;
    setTransitVisaItems(updated);
  } else {
    // Add new item
    setTransitVisaItems(prev => [...prev, newItem]);
  }
  
  setTransitVisaForm({ description: '' });
  resetVisaEditing(); // This should be defined
};

// Add/Update Business Visa
const addBusinessVisa = () => {
  const trimmed = businessVisaForm.description.trim();
  if (!trimmed) return;
  
  const newItem = { description: trimmed };
  
  if (editingType === 'businessVisa' && editIndex !== -1) {
    // Update existing item
    const updated = [...businessVisaItems];
    updated[editIndex] = newItem;
    setBusinessVisaItems(updated);
  } else {
    // Add new item
    setBusinessVisaItems(prev => [...prev, newItem]);
  }
  
  setBusinessVisaForm({ description: '' });
  resetVisaEditing(); // This should be defined
};

// Add/Update Photo
const addPhoto = () => {
  const trimmed = photoForm.description.trim();
  if (!trimmed) return;
  
  const newItem = { description: trimmed };
  
  if (editingType === 'photo' && editIndex !== -1) {
    // Update existing item
    const updated = [...photoItems];
    updated[editIndex] = newItem;
    setPhotoItems(updated);
  } else {
    // Add new item
    setPhotoItems(prev => [...prev, newItem]);
  }
  
  setPhotoForm({ description: '' });
  resetVisaEditing(); // This should be defined
};

// Add Free Flow Photo Entry
const addFreeFlowPhotoEntry = () => {
  const trimmed = freeFlowPhotoText.trim();
  if (!trimmed) return;
  
  const newItem = { description: trimmed };
  
  if (editingType === 'freeFlowPhoto' && editIndex !== -1) {
    // Update existing free flow entry
    const updated = [...freeFlowPhotoEntries];
    updated[editIndex] = newItem;
    setFreeFlowPhotoEntries(updated);
  } else {
    // Add new free flow entry
    setFreeFlowPhotoEntries(prev => [...prev, newItem]);
  }
  
  setFreeFlowPhotoText('');
  resetVisaEditing(); // This should be defined
};


  // Reset editing context
 // Reset editing context
const resetEditing = () => {
  setEditingItem(null);
  setEditingType('');
  setEditIndex(-1);
  setEditingVisaItemId(null);
  setEditingVisaFormIndex(null);
  
  // Also reset any form fields that might be in edit mode
  if (editingType === 'touristVisa') {
    setTouristVisaForm({ description: '' });
  } else if (editingType === 'transitVisa') {
    setTransitVisaForm({ description: '' });
  } else if (editingType === 'businessVisa') {
    setBusinessVisaForm({ description: '' });
  } else if (editingType === 'photo') {
    setPhotoForm({ description: '' });
  } else if (editingType === 'freeFlowPhoto') {
    setFreeFlowPhotoText('');
  }
  
  // Reset visa form edit data
  if (editingVisaFormIndex !== null) {
    setVisaFormEditData({
      type: '',
      // download_text: '',
      download_action: '',
      fill_action: '',
      action1_file: null,
      action2_file: null
    });
    setEditingVisaFormIndex(null);
  }
};

  // ========================
  // REMOVE FUNCTIONS
  // ========================

  const handleRemoveItinerary = (idx) => {
    setItineraries(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveDeparture = (idx) => {
    setDepartures(prev => prev.filter((_, i) => i !== idx));
  };

  const removeCostRow = (idx) => {
    setTourCosts(prev => prev.filter((_, i) => i !== idx));
  };

  const removeOptionalTourRow = (idx) => {
    setOptionalTours(prev => prev.filter((_, i) => i !== idx));
  };

  const removeHotelRow = (idx) => {
    setHotelRows(prev => prev.filter((_, i) => i !== idx));
  };

  const removeTransportRow = (idx) => {
    setTransports(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveInclusion = (idx) => {
    setInclusions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExclusion = (idx) => {
    setExclusions(prev => prev.filter((_, i) => i !== idx));
  };

  const removePoi = (idx) => {
    setBookingPois(prev => prev.filter((_, i) => i !== idx));
  };

  const removeCancelRow = (idx) => {
    setCancelPolicies(prev => prev.filter((_, i) => i !== idx));
  };

  const removeInstruction = (idx) => {
    setInstructions(prev => prev.filter((_, i) => i !== idx));
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

 // Handle image upload/selection for new images
const handleImageChange = (e) => {
  const files = e.target.files ? Array.from(e.target.files) : [];
  setImageFiles(files);
  
  // Create previews for new files only (not for existing images)
  const previews = files.map((file) => URL.createObjectURL(file));
  setImagePreviews(previews);
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

// Add this function to handle file uploads for visa forms

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
        updatedWithFilename[index].action1_file = uploadedFileName; // Store filename
      } else {
        updatedWithFilename[index].action2_file = uploadedFileName; // Store filename
      }
      setVisaFormItems(updatedWithFilename);
    }
  }
};
// Add this function to your frontend component
// Update this function in your frontend code
const handleVisaFormFileUpload = async (tourId, visaType, actionType, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('visa_type', visaType);
    formData.append('action_type', actionType);

    console.log('📤 Uploading visa form file:', {
      tourId,
      visaType,
      actionType,
      fileName: file.name
    });

    const response = await fetch(`${baseurl}/api/visa/upload-file/${tourId}`, {
      method: 'POST',
      body: formData
      // Don't set Content-Type header - let browser set it with boundary
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ File uploaded successfully:', result);
      return result.fileName;
    } else {
      console.error('❌ File upload failed:', result.error);
      return null;
    }
  } catch (err) {
    console.error('❌ Upload error:', err);
    return null;
  }
};


// Handler for tourist visa remarks
const handleTouristVisaRemarksChange = (e) => {
  setTouristVisaRemarks(e.target.value);
};

const handleVisaFeesChange = (id, field, value) => {
  const updated = visaFeesRows.map(row => 
    row.id === id ? { ...row, [field]: value } : row
  );
  setVisaFeesRows(updated);
};

const handleSubmissionChange = (index, field, value) => {
  const updated = [...submissionRows];
  updated[index][field] = value;
  setSubmissionRows(updated);
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

 // In the useEffect hook, update the tour code fetch:

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
        await loadTourData();
      } else {
        // Set is_international to 1 for international tours
          // You might want to get this from a URL parameter or other context
  const isInternational = window.location.pathname.includes('intl') ? 1 : 0;

        setFormData(prev => ({
          ...prev,
          is_international: 1
        }));
        
        // Fetch tour code with is_international=1 parameter
        const tourCodeRes = await fetch(`${baseurl}/api/tours/next-tour-code?tour_type=individual&is_international=${isInternational}`);
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
            optional_tour_remarks: basic.optional_tour_remarks || '' // ← ADD THIS LINE
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
        if (data.transport && Array.isArray(data.transport)) {
          setTransports(data.transport);
        }

        // Load Visa Data

          // Load Visa Data - Add this section
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
      
      // Load Visa Forms - Update this part
      if (data.visa_forms && Array.isArray(data.visa_forms)) {
        const formattedForms = data.visa_forms.map(form => ({
          type: form.visa_type,
          // download_text: form.download_text,
          download_action: form.download_action,
          fill_action: form.fill_action,
          action1_file: form.action1_file, // Keep the filename string
          action2_file: form.action2_file, // Keep the filename string
          action1_file_url: form.action1_file_url || null,
          action2_file_url: form.action2_file_url || null
        }));
        setVisaFormItems(formattedForms);
        
        // Load remarks from the first visa form
        if (data.visa_forms.length > 0 && data.visa_forms[0].remarks) {
          setTouristVisaRemarks(data.visa_forms[0].remarks);
        }
      }
      
      // Load Visa Fees - Update this part
      if (data.visa_fees && Array.isArray(data.visa_fees)) {
        // Create Visa Fees rows with separate charges
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
      
      // Load Submission Data - Update this part
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
        // In the loadTourData function, update the images section:
          // Set images
          if (data.images && Array.isArray(data.images)) {
            const imageUrls = data.images.map(img => img.url);
            // Keep existing images separately
            setExistingImages(data.images);
            // Set previews for new uploads (empty if no new files)
            setImagePreviews([]);
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
  
  // If we're on the main visa tab
  if (activeTab === 'visa') {
    // Check if there are more visa subtabs to complete
    const currentSubTabIndex = visaSubTabs.indexOf(activeVisaSubTab);
    
    // If current subtab is not the last one
    if (currentSubTabIndex < visaSubTabs.length - 1) {
      // Move to next visa subtab
      setActiveVisaSubTab(visaSubTabs[currentSubTabIndex + 1]);
      return;
    } else {
      // All visa subtabs are done, move to booking
      if (currentIndex < TAB_LIST.length - 1) {
        setActiveTab(TAB_LIST[currentIndex + 1]); // Move to bookingPoi
      }
      return;
    }
  }
  
  // Normal navigation for other tabs
  if (currentIndex < TAB_LIST.length - 1) {
    setActiveTab(TAB_LIST[currentIndex + 1]);
  }
};
const goBack = () => {
  const currentIndex = TAB_LIST.indexOf(activeTab);
  
  // If we're on the main visa tab
  if (activeTab === 'visa') {
    // Check if we can go back to previous visa subtab
    const currentSubTabIndex = visaSubTabs.indexOf(activeVisaSubTab);
    
    // If current subtab is not the first one
    if (currentSubTabIndex > 0) {
      // Move to previous visa subtab
      setActiveVisaSubTab(visaSubTabs[currentSubTabIndex - 1]);
      return;
    } else {
      // Go back to hotels tab from first visa subtab
      if (currentIndex > 0) {
        setActiveTab(TAB_LIST[currentIndex - 1]); // Move to hotels
      }
      return;
    }
  }
  
  // Normal navigation for other tabs
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
  optional_tour_remarks: formData.optional_tour_remarks || '', // Ensure it's included
  transport_remarks: formData.transport_remarks || '' // Ensure it's included
})
      });

      if (!tourRes.ok) {
        const err = await tourRes.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create tour');
      }

      const tourData = await tourRes.json();
      const tourId = tourData.tour_id || tourData.id || tourData.insertId;

          // Upload visa form files FIRST
    const uploadedVisaForms = await uploadVisaFormFiles(tourId, visaFormItems);

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

      // 7) HOTELS
      if (hotelRows.length > 0) {
        await fetch(`${baseurl}/api/tour-hotels/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, hotels: hotelRows })
        });
      }

 const visaData = {
  tourist_visa: touristVisaItems,
  transit_visa: transitVisaItems,
  business_visa: businessVisaItems,
  visa_forms: uploadedVisaForms.map(form => ({
    visa_type: form.type, // Use 'visa_type' to match backend
    download_action: form.download_action,
    fill_action: form.fill_action,
    action1_file: form.action1_file, // Already a filename string
    action2_file: form.action2_file
  })),
  photo: [...photoItems, ...freeFlowPhotoEntries],
  // Visa Fees: Combine fixed rows and free-flow entries
  visa_fees: [...visaFeesRows].map((row, index) => ({
    type: row.type, // Backend expects 'type' or 'row_type'
    tourist: row.tourist || '',
    transit: row.transit || '',
    business: row.business || '',
    tourist_charges: row.tourist_charges || '',
    transit_charges: row.transit_charges || '',
    business_charges: row.business_charges || '',
    row_order: index // Important for proper ordering
  })),
  // Submission data
  submission: submissionRows.map((row, index) => ({
    label: row.label,
    tourist: row.tourist,
    transit: row.transit,
    business: row.business,
    row_order: index // Important for ordering
  })),
  tourist_visa_remarks: touristVisaRemarks
};

      // Inside your try block, where you make the visa bulk API call:
if (touristVisaItems.length > 0 || transitVisaItems.length > 0 || businessVisaItems.length > 0 || photoItems.length > 0) {
  console.log('📤 Sending visa data to backend:', {
    tour_id: tourId, // or id for updateTour
    visaData: visaData // This will show the exact structure
  });
  
  const visaResponse = await fetch(`${baseurl}/api/visa/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tour_id: tourId, ...visaData })
  });
  
  const visaResult = await visaResponse.json();
  
  if (!visaResponse.ok) {
    console.error('❌ Visa API Error:', visaResult);
    throw new Error(`Visa save failed: ${visaResult.error || visaResponse.statusText}`);
  }
  
  console.log('✅ Visa data saved:', visaResult);
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
        if (imageCaption.trim()) {
          formDataImages.append('caption', imageCaption.trim());
        }
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
        optional_tour_remarks: formData.optional_tour_remarks || '' // ← ADD THIS LINE
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

      // Delete existing visa data
      try {
        await fetch(`${baseurl}/api/visa/tour/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Failed to delete visa data:', err.message);
      }


        // Upload visa form files FIRST
    const uploadedVisaForms = await uploadVisaFormFiles(id, visaFormItems);


    const visaData = {
  tourist_visa: touristVisaItems,
  transit_visa: transitVisaItems,
  business_visa: businessVisaItems,
  visa_forms: uploadedVisaForms.map(form => ({
    visa_type: form.type, // Use 'visa_type' to match backend
    download_action: form.download_action,
    fill_action: form.fill_action,
    action1_file: form.action1_file, // Already a filename string
    action2_file: form.action2_file
  })),
  photo: [...photoItems, ...freeFlowPhotoEntries],
  // Visa Fees: Combine fixed rows and free-flow entries
  visa_fees: [...visaFeesRows].map((row, index) => ({
    type: row.type, // Backend expects 'type' or 'row_type'
    tourist: row.tourist || '',
    transit: row.transit || '',
    business: row.business || '',
    tourist_charges: row.tourist_charges || '',
    transit_charges: row.transit_charges || '',
    business_charges: row.business_charges || '',
    row_order: index // Important for proper ordering
  })),
  // Submission data
  submission: submissionRows.map((row, index) => ({
    label: row.label,
    tourist: row.tourist,
    transit: row.transit,
    business: row.business,
    row_order: index // Important for ordering
  })),
  tourist_visa_remarks: touristVisaRemarks
};

// Inside your try block, where you make the visa bulk API call:
if (touristVisaItems.length > 0 || transitVisaItems.length > 0 || businessVisaItems.length > 0 || photoItems.length > 0) {
  console.log('📤 Sending visa data to backend:', {
    tour_id: id, // or id for updateTour
    visaData: visaData // This will show the exact structure
  });
  
  const visaResponse = await fetch(`${baseurl}/api/visa/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tour_id: id, ...visaData })
  });
  
  const visaResult = await visaResponse.json();
  
  if (!visaResponse.ok) {
    console.error('❌ Visa API Error:', visaResult);
    throw new Error(`Visa save failed: ${visaResult.error || visaResponse.statusText}`);
  }
  
  console.log('✅ Visa data saved:', visaResult);
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
        if (imageCaption.trim()) {
          formDataImages.append('caption', imageCaption.trim());
        }
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


const uploadVisaFormFiles = async (tourId, visaForms) => {
  const uploadedForms = [];

  for (const form of visaForms) {
    const formData = {
      type: form.type,
      // download_text: form.download_text,
      download_action: form.download_action,
      fill_action: form.fill_action,
      action1_file: null,
      action2_file: null
    };

    // Upload action1_file (PDF) if exists
    if (form.action1_file) {
      if (typeof form.action1_file === 'object' && form.action1_file instanceof File) {
        // It's a File object - upload it
        const fileName = await handleVisaFormFileUpload(tourId, form.type, 'action1', form.action1_file);
        if (fileName) {
          formData.action1_file = fileName;
        }
      } else if (typeof form.action1_file === 'string') {
        // Already a filename (from database or previous upload)
        formData.action1_file = form.action1_file;
      }
    }

    // Upload action2_file (Word) if exists
    if (form.action2_file) {
      if (typeof form.action2_file === 'object' && form.action2_file instanceof File) {
        // It's a File object - upload it
        const fileName = await handleVisaFormFileUpload(tourId, form.type, 'action2', form.action2_file);
        if (fileName) {
          formData.action2_file = fileName;
        }
      } else if (typeof form.action2_file === 'string') {
        // Already a filename (from database or previous upload)
        formData.action2_file = form.action2_file;
      }
    }

    uploadedForms.push(formData);
  }

  return uploadedForms;
};

// Add this helper function near your other helper functions
const getFileDisplayName = (fileData) => {
  if (!fileData) return '';
  
  if (typeof fileData === 'string') {
    return fileData;
  }
  
  if (typeof fileData === 'object' && fileData.name) {
    return fileData.name;
  }
  
  return 'Unknown file';
};


const handleSaveClick = () => {
  if (isLastTab) {
    if (isEditMode) {
      updateTour();
    } else {
      createTour();
    }
  } else {
    // Check if current visa subtab is complete before moving on
    if (activeTab === 'visa') {
      const currentSubTab = activeVisaSubTab;
      
      // Check if current subtab has data
      let isCurrentSubTabComplete = false;
      
      switch (currentSubTab) {
        case 'tourist':
          isCurrentSubTabComplete = touristVisaItems.length > 0 || touristVisaForm.description.trim() !== '';
          break;
        case 'transit':
          isCurrentSubTabComplete = transitVisaItems.length > 0 || transitVisaForm.description.trim() !== '';
          break;
        case 'business':
          isCurrentSubTabComplete = businessVisaItems.length > 0 || businessVisaForm.description.trim() !== '';
          break;
        case 'form':
          isCurrentSubTabComplete = visaFormItems.some(form => form.action1_file || form.action2_file);
          break;
        case 'photo':
          isCurrentSubTabComplete = photoItems.length > 0 || photoForm.description.trim() !== '';
          break;
        case 'fees':
          isCurrentSubTabComplete = visaFeesRows.some(row => 
            row.tourist || row.transit || row.business ||
            row.tourist_charges || row.transit_charges || row.business_charges
          );
          break;
        case 'submission':
          isCurrentSubTabComplete = submissionRows.some(row => 
            row.tourist || row.transit || row.business
          );
          break;
        default:
          isCurrentSubTabComplete = true;
      }
      
      if (!isCurrentSubTabComplete) {
        setError(`Please complete the "${currentSubTab}" section before proceeding`);
        return;
      }
    }
    
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

      case 'visa':
  // Check which subtab is active
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
  

  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">{isEditMode ? 'Edit Tour' : 'Add Tour'}</h2>

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

                     <Form.Group className="mb-3">
                      <Form.Label>Tour Price *</Form.Label>
                      <Form.Control
                        type="number"
                        name="base_price_adult"
                        value={formData.base_price_adult}
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
                      <Form.Label>Free Flow Description</Form.Label>
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

  {/* Add Transport Remarks field */}
  <Form.Group className="mt-3">
    <Form.Label>Flights Remarks</Form.Label>
    <Form.Control
      as="textarea"
      rows={3}
      name="transport_remarks"
      value={formData.transport_remarks}
      onChange={handleBasicChange}
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
                    {/* Edit Form Modal */}
                    {editingVisaFormIndex !== null && (
                      <Card className="mb-4 border-warning">
                        <Card.Header className="bg-warning text-dark">
                          <strong>✏️ Editing {visaFormEditData.type}</strong>
                          <Button 
                            variant="outline-dark" 
                            size="sm" 
                            className="float-end"
                            onClick={resetVisaFormEdit}
                          >
                            Cancel Edit
                          </Button>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Visa Type</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="type"
                                  value={visaFormEditData.type}
                                  onChange={handleVisaFormEditChange}
                                  disabled
                                />
                              </Form.Group>
                            </Col>
                            {/* <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Download Text</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="download_text"
                                  value={visaFormEditData.download_text}
                                  onChange={handleVisaFormEditChange}
                                />
                              </Form.Group>
                            </Col> */}
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Download Action</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="download_action"
                                  value={visaFormEditData.download_action}
                                  onChange={handleVisaFormEditChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Fill Action</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="fill_action"
                                  value={visaFormEditData.fill_action}
                                  onChange={handleVisaFormEditChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>PDF File</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => document.getElementById(`edit-pdf-upload`).click()}
                                  >
                                    {visaFormEditData.action1_file ? 'Change PDF' : 'Upload PDF'}
                                  </Button>
                                  <Form.Control
                                    type="file"
                                    id="edit-pdf-upload"
                                    accept=".pdf"
                                    className="d-none"
                                    onChange={(e) => handleVisaFormFileChangeWithEdit(editingVisaFormIndex, 'action1', e.target.files[0])}
                                  />
                                  {visaFormEditData.action1_file && (
                                    <span className="text-success small">
                                      ✓ {typeof visaFormEditData.action1_file === 'string' 
                                        ? visaFormEditData.action1_file 
                                        : visaFormEditData.action1_file.name}
                                    </span>
                                  )}
                                </div>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Word File</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                  <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={() => document.getElementById(`edit-word-upload`).click()}
                                  >
                                    {visaFormEditData.action2_file ? 'Change Word' : 'Upload Word'}
                                  </Button>
                                  <Form.Control
                                    type="file"
                                    id="edit-word-upload"
                                    accept=".doc,.docx"
                                    className="d-none"
                                    onChange={(e) => handleVisaFormFileChangeWithEdit(editingVisaFormIndex, 'action2', e.target.files[0])}
                                  />
                                  {visaFormEditData.action2_file && (
                                    <span className="text-success small">
                                      ✓ {typeof visaFormEditData.action2_file === 'string' 
                                        ? visaFormEditData.action2_file 
                                        : visaFormEditData.action2_file.name}
                                    </span>
                                  )}
                                </div>
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="d-flex gap-2 justify-content-end">
                            <Button 
                              variant="success" 
                              onClick={updateVisaFormItem}
                            >
                              Update Visa Form
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              onClick={resetVisaFormEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    )}

                    {/* Visa Forms Table */}
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Visa Type</th>
                          <th>Upload PDF</th>
                          <th>Upload Word</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {visaFormItems.map((item, idx) => {
                          const pdfFile = item.action1_file;
                          const wordFile = item.action2_file;
                          const pdfUrl = getFileUrl(pdfFile);
                          const wordUrl = getFileUrl(wordFile);
                          
                          return (
                            <tr key={idx} className={editingVisaFormIndex === idx ? 'table-warning' : ''}>
                              <td>
                                <strong>{item.type}</strong>
                              </td>
                              <td>
                                <div className="d-flex flex-column gap-2">
                                  {/* Upload Button */}
                                  <div>
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      onClick={() => document.getElementById(`pdf-upload-${idx}`).click()}
                                      disabled={editingVisaFormIndex !== null && editingVisaFormIndex !== idx}
                                    >
                                      {pdfFile ? 'Change PDF' : 'Upload PDF'}
                                    </Button>
                                    <Form.Control
                                      type="file"
                                      id={`pdf-upload-${idx}`}
                                      accept=".pdf"
                                      className="d-none"
                                      onChange={(e) => handleVisaFormFileChangeWithEdit(idx, 'action1', e.target.files[0])}
                                    />
                                  </div>
                                  
                                
                  {/* File Info and View Button */}
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
                      
                      {/* Only show view button if we have a string filename (not a File object) */}
                      {typeof pdfFile === 'string' && (
                        <div className="ms-2">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => openFileInNewTab(getFileUrl(pdfFile))}
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
                                  {/* Upload Button */}
                                  <div>
                                    <Button 
                                      variant="outline-secondary" 
                                      size="sm"
                                      onClick={() => document.getElementById(`word-upload-${idx}`).click()}
                                      disabled={editingVisaFormIndex !== null && editingVisaFormIndex !== idx}
                                    >
                                      {wordFile ? 'Change Word' : 'Upload Word'}
                                    </Button>
                                    <Form.Control
                                      type="file"
                                      id={`word-upload-${idx}`}
                                      accept=".doc,.docx"
                                      className="d-none"
                                      onChange={(e) => handleVisaFormFileChangeWithEdit(idx, 'action2', e.target.files[0])}
                                    />
                                  </div>
                                  
                                  {/* File Info and View Button */}
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
                              {/* <td>
                                {editingVisaFormIndex === idx ? (
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={updateVisaFormItem}
                                  >
                                    Update
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => editVisaFormItem(idx)}
                                    title="Edit"
                                  >
                                    <Pencil size={14} /> Edit
                                  </Button>
                                )}
                              </td> */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>

                    {/* Remarks Section */}
                    <Card className="mt-3">
                      <Card.Body>
                        <Form.Group>
                          <Form.Label>Visa Form Remarks</Form.Label>
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
  {/* Add/Edit Photo Form */}
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
          {/* <Button 
            variant={editingType === 'photo' ? "warning" : "success"} 
            onClick={addPhoto}
            className="align-self-start"
            disabled={!photoForm.description.trim()}
          >
            {editingType === 'photo' ? 'Update Photo' : '+ Add Photo'}
          </Button> */}
        </div>
      </Form.Group>
    </Card.Body>
  </Card>


  {/* Existing Photo Items Table */}
  {photoItems.length > 0 && (
    <Card>
      {/* <Card.Header>Photo Requirements List</Card.Header> */}
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
                      {/* <th>Tabs</th> */}
                      <th>Tourist Visa</th>
                      <th>Toursit Visa Charges</th>
                      <th>Transit Visa</th>
                      <th>Transit Visa Charges</th>
                      <th>Business Visa</th>
                      <th>Business Visa Charges</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render all rows including free flow entries */}
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
                          
                          {/* Dynamic rows */}
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

              <Tab eventKey="bookingPoi" title="Booking Policy">
                <Form.Group className="mb-3">
                  <Row>
                    <Col md={8}>
                      <Form.Label>Booking Policy</Form.Label>
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
        
        <Form.Group className="mb-3">
          <Form.Label>Caption (optional - applies to all new images)</Form.Label>
          <Form.Control
            type="text"
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            placeholder="Enter a caption for the new images"
          />
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

     {/* Update the Save & Continue button text in visa tab */}
<Button
  variant="primary"
  onClick={handleSaveClick}
  disabled={loading}
>
  {loading ? 'Saving...' : 
   isLastTab ? (isEditMode ? 'Update All' : 'Save All') : 
   activeTab === 'visa' ? `Save & Next (${visaSubTabs.indexOf(activeVisaSubTab) + 1}/${visaSubTabs.length})` : 
   'Save & Continue'}
</Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default INTLAddTour;