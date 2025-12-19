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
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const AddSeniorTour = () => {
  const navigate = useNavigate();

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

  // Dropdowns
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);

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
    is_international: 0,
    cost_remarks: "",
    hotel_remarks: "",
    transport_remarks: "",
    booking_poi_remarks: "",
    cancellation_remarks: "",
    emi_remarks: ""
  });

  // =======================
  // DEPARTURES FOR GROUP TOURS
  // =======================
  const [groupDepartureForm, setGroupDepartureForm] = useState({
    start_date: '',
    end_date: '',
    status: 'Available',
    price: '',
    description: ''
  });

  // TOUR COST FIELDS FOR GROUP TOURS
  const [tourCostFields, setTourCostFields] = useState({
    threeStar: {
      perPaxTwin: '',
      perPaxTriple: '',
      childWithBed: '',
      childWithoutBed: '',
      infant: '',
      perPaxSingle: ''
    },
    fourStar: {
      perPaxTwin: '',
      perPaxTriple: '',
      childWithBed: '',
      childWithoutBed: '',
      infant: '',
      perPaxSingle: ''
    },
    fiveStar: {
      perPaxTwin: '',
      perPaxTriple: '',
      childWithBed: '',
      childWithoutBed: '',
      infant: '',
      perPaxSingle: ''
    }
  });


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
    // Required field: pax
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

  const removeCostRow = (idx) => {
    setTourCosts(prev => prev.filter((_, i) => i !== idx));
  };



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
    // Required field: tour_name
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

  // Remove the old loanAmount state and useEffect
  // Remove these lines:
  // const [loanAmount, setLoanAmount] = useState('');
  // useEffect(() => {
  //   if (loanAmount) {
  //     const amount = parseFloat(loanAmount);
  //     if (!isNaN(amount) && amount > 0) {
  //       const updatedEmiOptions = emiOptions.map(option => {
  //         const emi = calculateEMI(amount, option.months);
  //         return { ...option, emi };
  //       });
  //       setEmiOptions(updatedEmiOptions);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loanAmount]);

  // Remove the calculateEMI function or keep it as helper if needed elsewhere

  // Handle loan amount change for a specific row
  const handleLoanAmountChange = (index, value) => {
    const updatedOptions = [...emiOptions];
    updatedOptions[index].loan_amount = value;
    setEmiOptions(updatedOptions);
  };

  // Handle EMI change for a specific row
  const handleEMIChange = (index, value) => {
    const updatedOptions = [...emiOptions];
    updatedOptions[index].emi = value;
    setEmiOptions(updatedOptions);
  };

  // Add EMI Options to form
  const handleAddEMIOptions = () => {
    console.log('EMI Options before validation:', emiOptions);

    // Filter only rows that have values (not all rows need to be filled)
    const validEmiOptions = emiOptions.filter(option =>
      option.loan_amount && option.loan_amount > 0 && option.emi && option.emi > 0
    );

    console.log('Valid EMI options:', validEmiOptions);

    // Check if at least one row is filled (optional requirement)
    if (validEmiOptions.length === 0) {
      setError('Please fill at least one EMI option row');
      return;
    }

    setError('');
    setSuccess(`Added ${validEmiOptions.length} EMI options successfully`);

    console.log('Valid EMI Options saved:', validEmiOptions);
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
    // Required: city & hotel_name
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

  const removeHotelRow = (idx) => {
    setHotelRows(prev => prev.filter((_, i) => i !== idx));
  };

  // =======================
  // TRANSPORT FOR GROUP TOURS
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
    via: ''
  });

  const [transports, setTransports] = useState([]);

  const handleTransportChange = (e) => {
    const { name, value } = e.target;
    setTransportItem(prev => ({ ...prev, [name]: value }));
  };

  const addTransportRow = () => {
    // For Group tours, require airline and flight_no
    if (!transportItem.airline || !transportItem.flight_no || !transportItem.from_city || !transportItem.to_city) {
      return;
    }

    setTransports(prev => [...prev, { ...transportItem }]);

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
      via: ''
    });
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
    // Required: cancellation_policy
    if (!cancelItem.cancellation_policy.trim()) return;
    setCancelPolicies(prev => [...prev, { ...cancelItem }]);
    setCancelItem({ cancellation_policy: "", charges: "" });
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

  // Fetch next tour code when component loads
  useEffect(() => {
    const loadDropdownsAndTourCode = async () => {
      try {
        // Pass tour_type as query parameter
        const tourCodeRes = await fetch(`${baseurl}/api/tours/next-tour-code?tour_type=group`);
        if (tourCodeRes.ok) {
          const tourCodeData = await tourCodeRes.json();
          setFormData(prev => ({
            ...prev,
            tour_code: tourCodeData.next_tour_code
          }));
        }

        const catRes = await fetch(`${baseurl}/api/categories/all-tours`);
        const categoryData = await catRes.json();
        setCategories(Array.isArray(categoryData) ? categoryData : []);

        const destRes = await fetch(`${baseurl}/api/destinations`);
        const destData = await destRes.json();
        setDestinations(Array.isArray(destData) ? destData : []);
      } catch (err) {
        setError('Failed to load dropdown data');
      }
    };

    loadDropdownsAndTourCode();
  }, []);

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

  // DEPARTURE FORM CHANGE - Group
  const handleGroupDepartureChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['price'];

    setGroupDepartureForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  // TOUR COST FIELDS CHANGE - Group
  const handleTourCostFieldsChange = (e) => {
    const { name, value } = e.target;
    // Extract hotel type and field name from input name (e.g., "threeStar_perPaxTwin")
    const [hotelType, fieldName] = name.split('_');

    setTourCostFields(prev => ({
      ...prev,
      [hotelType]: {
        ...prev[hotelType],
        [fieldName]: value
      }
    }));
  };

  const handleAddDeparture = () => {
    // Group tour: Structured departure
    if (!groupDepartureForm.start_date || !groupDepartureForm.end_date || !groupDepartureForm.price) return;

    const departureData = {
      tour_type: 'Group',
      start_date: groupDepartureForm.start_date,
      end_date: groupDepartureForm.end_date,
      status: groupDepartureForm.status,
      price: groupDepartureForm.price,
      description: groupDepartureForm.description || '',
      type: 'structured',
      // Add tour cost data
      tour_costs: tourCostFields
    };

    setDepartures((prev) => [...prev, departureData]);

    // Reset form
    setGroupDepartureForm({
      start_date: '',
      end_date: '',
      status: 'Available',
      price: '',
      description: ''
    });

    // Reset tour cost fields
    setTourCostFields({
      threeStar: {
        perPaxTwin: '',
        perPaxTriple: '',
        childWithBed: '',
        childWithoutBed: '',
        infant: '',
        perPaxSingle: ''
      },
      fourStar: {
        perPaxTwin: '',
        perPaxTriple: '',
        childWithBed: '',
        childWithoutBed: '',
        infant: '',
        perPaxSingle: ''
      },
      fiveStar: {
        perPaxTwin: '',
        perPaxTriple: '',
        childWithBed: '',
        childWithoutBed: '',
        infant: '',
        perPaxSingle: ''
      }
    });
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

  const handleRemoveInclusion = (idx) => {
    setInclusions((prev) => prev.filter((_, i) => i !== idx));
  };

  // IMAGES
  const handleImageChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
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
    // Required: day & title
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
        if (groupDepartureForm.start_date && groupDepartureForm.end_date && groupDepartureForm.price) {
          handleAddDeparture();
        }
        break;

      // Add this case to your autoAddBeforeNext function:
      case 'emiOptions':
        // Don't validate all rows - just check if at least one row has values
        const hasAtLeastOneValidOption = emiOptions.some(option =>
          option.loan_amount && option.loan_amount > 0 && option.emi && option.emi > 0
        );

        if (!hasAtLeastOneValidOption) {
          console.log('No valid EMI options found');
          setError('Please fill at least one EMI option before proceeding');
          // Stay on current tab
          return false;
        }

        console.log('EMI options check passed - proceeding to next tab');
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

  // FINAL SUBMIT — all APIs hit here
  const finalSubmit = async () => {
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

      // 2) DEPARTURES BULK - GROUP TOURS
      if (departures.length > 0) {
        // Transform departures data for backend
        const formattedDepartures = departures.map(dep => ({
          tour_type: 'Group',
          start_date: dep.start_date,
          end_date: dep.end_date,
          status: dep.status,
          price: dep.price,
          description: dep.description || null,
          total_seats: 40, // Default value
          booked_seats: 0,
          // Tour costs for group
          tour_costs: dep.tour_costs
        }));

        const depBody = {
          tour_id: tourId,
          departures: formattedDepartures
        };

        const depRes = await fetch(`${baseurl}/api/departures/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(depBody)
        });

        if (!depRes.ok) {
          const err = await depRes.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to save departures');
        }
      }

      // 7) TOUR COSTS BULK
      if (tourCosts.length > 0) {
        await fetch(`${baseurl}/api/tour-costs/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_id: tourId,
            costs: tourCosts
          })
        });
      }

      // 3) EXCLUSIONS
      if (exclusions.length > 0) {
        const excRes = await fetch(`${baseurl}/api/exclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: exclusions })
        });

        if (!excRes.ok) {
          const err = await excRes.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to save exclusions');
        }
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
        const imgRes = await fetch(`${baseurl}/api/images/upload/${tourId}`, {
          method: 'POST',
          body: formDataImages
        });
        if (!imgRes.ok) {
          const err = await imgRes.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to upload images');
        }
      }

      // 5) INCLUSIONS
      if (inclusions.length > 0) {
        const incRes = await fetch(`${baseurl}/api/inclusions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tourId, items: inclusions })
        });
        if (!incRes.ok) {
          const err = await incRes.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to save inclusions');
        }
      }

      // 6) ITINERARY DAYS
      if (itineraries.length > 0) {
        const payload = itineraries.map((item) => ({
          ...item,
          tour_id: tourId
        }));
        const itiRes = await fetch(`${baseurl}/api/itineraries/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!itiRes.ok) {
          const err = await itiRes.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to save itineraries');
        }
      }

      // 7) OPTIONAL TOURS BULK
      if (optionalTours.length > 0) {
        await fetch(`${baseurl}/api/optional-tours/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_id: tourId,
            optional_tours: optionalTours
          })
        });
      }

      // 8) EMI OPTIONS BULK
      // 8) EMI OPTIONS BULK - UPDATED VERSION
      console.log('Sending EMI options to backend:', emiOptions);

      // Filter only options that have values
      const validEmiOptions = emiOptions.filter(opt =>
        opt.loan_amount && opt.loan_amount > 0 && opt.emi && opt.emi > 0
      );

      console.log('Valid EMI options for submission:', validEmiOptions);

      if (validEmiOptions.length > 0) {
        try {
          const emiPayload = {
            tour_id: tourId,
            emi_options: validEmiOptions.map(opt => ({
              particulars: opt.particulars,
              months: opt.months,
              loan_amount: parseFloat(opt.loan_amount),
              emi: parseFloat(opt.emi)
            }))
          };

          console.log('EMI API Payload:', JSON.stringify(emiPayload, null, 2));

          const emiResponse = await fetch(`${baseurl}/api/emi-options/emi/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emiPayload)
          });

          console.log('EMI API Status:', emiResponse.status);

          if (!emiResponse.ok) {
            const errorText = await emiResponse.text();
            console.error('EMI API Error Response:', errorText);
            // Don't throw error - just log it as EMI options are optional
            console.warn('EMI options could not be saved, but continuing with other data');
          } else {
            const emiResult = await emiResponse.json();
            console.log('EMI API Success Response:', emiResult);
          }
        } catch (error) {
          console.error('Error saving EMI options:', error);
          // Don't throw here to allow other data to be saved
          // EMI options are optional
        }
      } else {
        console.log('No valid EMI options to save - this is optional');
      }

      // 9) HOTELS BULK
      if (hotelRows.length > 0) {
        await fetch(`${baseurl}/api/tour-hotels/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_id: tourId,
            hotels: hotelRows
          })
        });
      }

      // 10) TRANSPORT BULK
      if (transports.length > 0) {
        await fetch(`${baseurl}/api/tour-transports/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_id: tourId,
            items: transports
          })
        });
      }

      // 11) BOOKING POI BULK
      if (bookingPois.length > 0) {
        await fetch(`${baseurl}/api/tour-booking-poi/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_id: tourId,
            items: bookingPois
          })
        });
      }

      // 12) CANCELLATION BULK
      if (cancelPolicies.length > 0) {
        await fetch(`${baseurl}/api/tour-cancellation/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_id: tourId,
            policies: cancelPolicies
          })
        });
      }

      // 13) INSTRUCTIONS BULK
      if (instructions.length > 0) {
        await fetch(`${baseurl}/api/tour-instructions/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_id: tourId,
            items: instructions
          })
        });
      }

      setSuccess('Tour saved successfully!');
      setTimeout(() => navigate('/group-tours'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to save tour');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    // Auto-add buffered row if user forgot to click "+ Add"
    autoAddBeforeNext();

    if (isLastTab) {
      finalSubmit();
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
        return null; // basic, emiOptions, images have no "+ Add" here
    }
  };

  const addConfig = getAddConfigForTab(activeTab);

  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">Add Group Tour</h2>

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
                        style={{
                          cursor: "not-allowed",
                          fontWeight: "bold"
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
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleRemoveItinerary(idx)}
                              >
                                remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ======== DEPARTURES TAB - GROUP TOUR ======== */}
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
                          value={groupDepartureForm.start_date}
                          onChange={handleGroupDepartureChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="end_date"
                          value={groupDepartureForm.end_date}
                          onChange={handleGroupDepartureChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status *</Form.Label>
                        <Form.Select
                          name="status"
                          value={groupDepartureForm.status}
                          onChange={handleGroupDepartureChange}
                        >
                          <option value="Available">Available</option>
                          <option value="Few Seats">Few Seats</option>
                          <option value="Sold Out">Sold Out</option>
                          <option value="Fast Filling">Fast Filling</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price *</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={groupDepartureForm.price}
                          onChange={handleGroupDepartureChange}
                          placeholder="Enter price"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          name="description"
                          value={groupDepartureForm.description}
                          onChange={handleGroupDepartureChange}
                          placeholder="Optional description"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Tour Cost Section */}
                  <Row className="mb-4">
                    <h5>Tour Cost</h5>

                    {/* Table Header */}
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Particulars</th>
                          <th>3 Star</th>
                          <th>4 Star</th>
                          <th>5 Star</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Per Pax on Twin Basis */}
                        <tr>
                          <td>Per Pax on Twin Basis</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="threeStar_perPaxTwin"
                              value={tourCostFields.threeStar.perPaxTwin}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fourStar_perPaxTwin"
                              value={tourCostFields.fourStar.perPaxTwin}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fiveStar_perPaxTwin"
                              value={tourCostFields.fiveStar.perPaxTwin}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                        </tr>

                        {/* Per Pax on Triple Basis */}
                        <tr>
                          <td>Per Pax on Triple Basis</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="threeStar_perPaxTriple"
                              value={tourCostFields.threeStar.perPaxTriple}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fourStar_perPaxTriple"
                              value={tourCostFields.fourStar.perPaxTriple}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fiveStar_perPaxTriple"
                              value={tourCostFields.fiveStar.perPaxTriple}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                        </tr>

                        {/* Child with Bed */}
                        <tr>
                          <td>Child with Bed</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="threeStar_childWithBed"
                              value={tourCostFields.threeStar.childWithBed}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fourStar_childWithBed"
                              value={tourCostFields.fourStar.childWithBed}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fiveStar_childWithBed"
                              value={tourCostFields.fiveStar.childWithBed}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                        </tr>

                        {/* Child without Bed */}
                        <tr>
                          <td>Child without Bed</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="threeStar_childWithoutBed"
                              value={tourCostFields.threeStar.childWithoutBed}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fourStar_childWithoutBed"
                              value={tourCostFields.fourStar.childWithoutBed}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fiveStar_childWithoutBed"
                              value={tourCostFields.fiveStar.childWithoutBed}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                        </tr>

                        {/* Infant */}
                        <tr>
                          <td>Infant</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="threeStar_infant"
                              value={tourCostFields.threeStar.infant}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fourStar_infant"
                              value={tourCostFields.fourStar.infant}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fiveStar_infant"
                              value={tourCostFields.fiveStar.infant}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                        </tr>

                        {/* Per Pax Single Occupancy */}
                        <tr>
                          <td>Per Pax Single Occupancy</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="threeStar_perPaxSingle"
                              value={tourCostFields.threeStar.perPaxSingle}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fourStar_perPaxSingle"
                              value={tourCostFields.fourStar.perPaxSingle}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name="fiveStar_perPaxSingle"
                              value={tourCostFields.fiveStar.perPaxSingle}
                              onChange={handleTourCostFieldsChange}
                              placeholder="Enter price"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
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
                            <th>Price</th>
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
                              <td>{dep.price ? `₹${dep.price.toLocaleString()}` : '-'}</td>
                              <td>
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => handleRemoveDeparture(idx)}
                                >
                                  remove
                                </Button>
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
                {/* <Row className="align-items-end">
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
                              </Row> */}

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
                        <th></th>
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
                            <Button variant="link" size="sm" onClick={() => removeCostRow(idx)}>remove</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
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
                        <th></th>
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
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => removeOptionalTourRow(idx)}
                            >
                              remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ======== EMI OPTIONS ======== */}
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
                    {/* <Button
        variant="primary"
        onClick={() => {
          console.log('EMI Options before validation:', emiOptions);
          handleAddEMIOptions();
        }}
      >
        Save EMI Options
      </Button> */}
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
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => handleRemoveInclusion(idx)}
                            >
                              remove
                            </Button>
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
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => handleRemoveExclusion(idx)}
                            >
                              remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* ======== TRANSPORT TAB - GROUP TOUR ======== */}
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

                {/* ================= ADD BUTTON ================= */}
                <Button className="mt-3" onClick={addTransportRow}>
                  Add
                </Button>

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
                        <th></th>
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
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => removeTransportRow(i)}
                            >
                              remove
                            </Button>
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
                        <th></th>
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
                            <Button variant="link" size="sm" onClick={() => removeHotelRow(idx)}>remove</Button>
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
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingPois.map((p, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{p.item}</td>
                          <td>{p.amount_details}</td>
                          <td>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => removePoi(idx)}
                            >
                              remove
                            </Button>
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
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cancelPolicies.map((c, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{c.cancellation_policy}</td>
                          <td>{c.charges || "-"}</td>
                          <td>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => removeCancelRow(idx)}
                            >
                              remove
                            </Button>
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
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructions.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item}</td>
                          <td>
                            <Button variant="link" size="sm" onClick={() => removeInstruction(idx)}>remove</Button>
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
                {isLastTab ? (loading ? 'Saving...' : 'Save All') : 'Save & Continue'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddSeniorTour;