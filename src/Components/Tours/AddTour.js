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
  const { id } = useParams(); // Get tour ID from URL for edit mode
  const isEditMode = !!id;

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
    is_international: 0,
    cost_remarks: "",
    hotel_remarks: "",
    transport_remarks: "",
    booking_poi_remarks: "",
    cancellation_remarks: "",
    emi_remarks: ""
  });

  // DEPARTURES (multiple)
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

  // =======================
  // TOUR COST
  // =======================
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

  const handleCostChange = (e) => {
    const { name, value } = e.target;
    setTourCostItem(prev => ({ ...prev, [name]: value }));
  };

  const addCostRow = () => {
    if (!tourCostItem.pax) return;
    setTourCosts(prev => [...prev, { ...tourCostItem }]);
    setTourCostItem({
      pax: '',
      standard_hotel: '',
      deluxe_hotel: '',
      executive_hotel: '',
      child_with_bed: '',
      child_no_bed: '',
      remarks: ''
    });
  };

  const editCostRow = (idx) => {
    const item = tourCosts[idx];
    setTourCostItem(item);
    setTourCosts(prev => prev.filter((_, i) => i !== idx));
  };

  const removeCostRow = (idx) => {
    setTourCosts(prev => prev.filter((_, i) => i !== idx));
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

  // =======================
  // TRANSPORT
  // =======================
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

  const handleTransportChange = (e) => {
    const { name, value } = e.target;
    setTransportItem(prev => ({ ...prev, [name]: value }));
  };

  const addTransportRow = () => {
    if (!transportItem.description.trim()) return;
    setTransports(prev => [...prev, { ...transportItem }]);
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
      { item: poiText, amount_details: poiAmount }
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
    charges: ""
  });

  const [cancelPolicies, setCancelPolicies] = useState([]);

  const handleCancelChange = (e) => {
    const { name, value } = e.target;
    setCancelItem(prev => ({ ...prev, [name]: value }));
  };

  const addCancelRow = () => {
    if (!cancelItem.cancellation_policy.trim()) return;
    setCancelPolicies(prev => [...prev, { ...cancelItem }]);
    setCancelItem({ cancellation_policy: "", charges: "" });
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

  // Edit functions for itineraries
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
    
    // Remove from list so user can re-add with changes
    setItineraries(prev => prev.filter((_, i) => i !== idx));
  };

  // Fetch tour data for edit mode
  useEffect(() => {
    const loadDropdownsAndTourCode = async () => {
      try {
        // Load dropdowns
        const catRes = await fetch(`${baseurl}/api/categories/all-tours`);
        const categoryData = await catRes.json();
        setCategories(Array.isArray(categoryData) ? categoryData : []);

        const destRes = await fetch(`${baseurl}/api/destinations`);
        const destData = await destRes.json();
        setDestinations(Array.isArray(destData) ? destData : []);

        if (isEditMode) {
          // Load existing tour data for edit
          await loadTourData();
        } else {
          // Load next tour code for add mode
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
      
      // Fetch full tour data
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
          setHotelRows(data.hotels);
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

  const handleAddDeparture = () => {
    if (!departureForm.description.trim()) return;
    setDepartures((prev) => [
      ...prev,
      { ...departureForm }
    ]);

    setDepartureForm({
      departure_date: '',
      return_date: '',
      adult_price: '',
      child_price: '',
      infant_price: '',
      description: '',
      total_seats: ''
    });
  };

  const editDeparture = (idx) => {
    const departure = departures[idx];
    setDepartureForm(departure);
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
    setInclusions((prev) => prev.filter((_, i) => i !== idx));
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
    setItineraries((prev) => prev.filter((_, i) => i !== idx));
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
    navigate('/tours');
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
        if (departureForm.description && departureForm.description.trim()) {
          handleAddDeparture();
        }
        break;

      case 'costs':
        if (tourCostItem.pax) {
          addCostRow();
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

      case 'transport':
        if (transportItem.description && transportItem.description.trim()) {
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
      tour_type: formData.tour_type || 'individual',
      primary_destination_id: formData.primary_destination_id,
      duration_days: Number(formData.duration_days) || 0,
      overview: formData.overview || '',
      base_price_adult: Number(formData.base_price_adult) || 0,
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

    // 2) DELETE EXISTING DATA (your existing code is fine)
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

    // 3) RE-ADD ALL DATA (your existing code is fine)
    // [Keep all your existing bulk insert code here]
    
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
    setTimeout(() => navigate('/tours'), 1500);
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

      // 2) DEPARTURES BULK
      if (departures.length > 0) {
        await fetch(`${baseurl}/api/departures/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, departures })
        });
      }

      // 3) TOUR COSTS BULK
      if (tourCosts.length > 0) {
        await fetch(`${baseurl}/api/tour-costs/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, costs: tourCosts })
        });
      }

      // 4) OPTIONAL TOURS BULK
      if (optionalTours.length > 0) {
        await fetch(`${baseurl}/api/optional-tours/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, optional_tours: optionalTours })
        });
      }

      // 5) EMI OPTIONS BULK
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

      // 6) HOTELS BULK
      if (hotelRows.length > 0) {
        await fetch(`${baseurl}/api/tour-hotels/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, hotels: hotelRows })
        });
      }

      // 7) TRANSPORT BULK
      if (transports.length > 0) {
        await fetch(`${baseurl}/api/tour-transports/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: transports })
        });
      }

      // 8) BOOKING POI BULK
      if (bookingPois.length > 0) {
        await fetch(`${baseurl}/api/tour-booking-poi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: bookingPois })
        });
      }

      // 9) CANCELLATION BULK
      if (cancelPolicies.length > 0) {
        await fetch(`${baseurl}/api/tour-cancellation/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, policies: cancelPolicies })
        });
      }

      // 10) INSTRUCTIONS BULK
      if (instructions.length > 0) {
        await fetch(`${baseurl}/api/tour-instructions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: instructions })
        });
      }

      // 11) EXCLUSIONS
      if (exclusions.length > 0) {
        await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: exclusions })
        });
      }

      // 12) IMAGES
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

      // 13) INCLUSIONS
      if (inclusions.length > 0) {
        await fetch(`${baseurl}/api/inclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: inclusions })
        });
      }

      // 14) ITINERARY DAYS
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

      setSuccess('Tour saved successfully!');
      setTimeout(() => navigate('/tours'), 1500);
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

  const handleDepartureDateSelect = (e) => {
    const departureDate = e.target.value;
    const duration = formData.duration_days;

    if (!departureDate || !duration) {
      setDepartureForm(prev => ({ ...prev, departure_date: departureDate }));
      return;
    }

    const dateObj = new Date(departureDate);
    dateObj.setDate(dateObj.getDate() + Number(duration));

    const returnISO = dateObj.toISOString().split("T")[0];

    setDepartureForm(prev => ({
      ...prev,
      departure_date: departureDate,
      return_date: returnISO
    }));
  };

  // Dynamic "+ Add ..." button for bottom bar
  const getAddConfigForTab = (tabKey) => {
    switch (tabKey) {
      case 'itineraries':
        return { label: '+ Add Day', onClick: handleAddItinerary };
      case 'departures':
        return { label: '+ Add Departure', onClick: handleAddDeparture };
      case 'costs':
        return { label: '+ Add Cost Row', onClick: addCostRow };
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
                      <Form.Text className="text-muted">
                        {isEditMode ? "Tour code cannot be changed" : "Auto-generated tour code"}
                      </Form.Text>
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
                      <Form.Label>International Tour?</Form.Label>
                      <Form.Select
                        name="is_international"
                        value={formData.is_international}
                        onChange={handleBasicChange}
                      >
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                      </Form.Select>
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
                      <Form.Label>Tour Price *</Form.Label>
                      <Form.Control
                        type="number"
                        name="base_price_adult"
                        value={formData.base_price_adult}
                        onChange={handleBasicChange}
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

              <Tab eventKey="transport" title="Transport">
                <Row className="mt-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Flights/Train or Transport Details</Form.Label>
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
                  <Form.Label>Transport Remarks</Form.Label>
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

                   <Col md={3}>
                    <Form.Group>
                      <Form.Label>Standard</Form.Label>
                      <Form.Control
                        type="text"
                        name="hotel_standard"
                        value={hotelItem.hotel_standard}
                        onChange={handleHotelChange}
                      />
                    </Form.Group>
                  </Col>
                   <Col md={3}>
                    <Form.Group>
                      <Form.Label>Deluxe</Form.Label>
                      <Form.Control
                        type="text"
                        name="hotel_deluxe"
                        value={hotelItem.hotel_deluxe}
                        onChange={handleHotelChange}
                      />
                    </Form.Group>
                  </Col>
                   <Col md={3}>
                    <Form.Group>
                      <Form.Label>Executive</Form.Label>
                      <Form.Control
                        type="text"
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

export default AddTour;