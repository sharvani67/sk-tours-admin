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
  Table
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const AddTour = () => {
  const navigate = useNavigate();

 const TAB_LIST = [
    'basic',
    'departures',
    'costs',
    'hotels',
    'transport',
    'bookingPoi',
    'cancellation',
    'instructions',
    'exclusions',
    'images',
    'inclusions',
    'itineraries'
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
    title: '',
    category_id: '',
    primary_destination_id: '',
    duration_days: '',
    overview: '',
    base_price_adult: '',
    is_international: 0
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

const removeCostRow = (idx) => {
  setTourCosts(prev => prev.filter((_, i) => i !== idx));
};


// =======================
// HOTELS
// =======================
const [hotelItem, setHotelItem] = useState({
  city: '',
  hotel_name: '',
  room_type: '',
  nights: '',
  remarks: ''
});
const [hotelRows, setHotelRows] = useState([]);

const handleHotelChange = (e) => {
  const { name, value } = e.target;
  setHotelItem(prev => ({ ...prev, [name]: value }));
};

const addHotelRow = () => {
  if (!hotelItem.city.trim() || !hotelItem.hotel_name.trim()) return;
  setHotelRows(prev => [...prev, { ...hotelItem }]);
  setHotelItem({ city: '', hotel_name: '', room_type: '', nights: '', remarks: '' });
};

const removeHotelRow = (idx) => {
  setHotelRows(prev => prev.filter((_, i) => i !== idx));
};


// =======================
// TRANSPORT
// =======================
const [transportItem, setTransportItem] = useState({
  mode: 'Flight',
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
  if (!transportItem.from_city || !transportItem.to_city) return;
  setTransports(prev => [...prev, { ...transportItem }]);
  setTransportItem({
    mode: 'Flight',
    from_city: '',
    to_city: '',
    carrier: '',
    number_code: '',
    departure_datetime: '',
    arrival_datetime: '',
    description: ''
  });
};

const removeTransportRow = (idx) => {
  setTransports(prev => prev.filter((_, i) => i !== idx));
};


// =======================
// BOOKING POI
// =======================
const [poiText, setPoiText] = useState('');
const [bookingPois, setBookingPois] = useState([]);

const addPoi = () => {
  const txt = poiText.trim();
  if (!txt) return;
  setBookingPois(prev => [...prev, txt]);
  setPoiText('');
};

const removePoi = (idx) => {
  setBookingPois(prev => prev.filter((_, i) => i !== idx));
};


// =======================
// CANCELLATION
// =======================
const [cancelItem, setCancelItem] = useState({
  days_min: '',
  days_max: '',
  charge_percentage: ''
});
const [cancelPolicies, setCancelPolicies] = useState([]);

const handleCancelChange = (e) => {
  const { name, value } = e.target;
  setCancelItem(prev => ({ ...prev, [name]: value }));
};

const addCancelRow = () => {
  if (!cancelItem.charge_percentage) return;
  setCancelPolicies(prev => [...prev, { ...cancelItem }]);
  setCancelItem({ days_min: '', days_max: '', charge_percentage: '' });
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

  // Load dropdowns
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
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

    loadDropdowns();
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

  const isLastTab = activeTab === 'itineraries';

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
      const tourId =
        tourData.tour_id || tourData.id || tourData.insertId;

      // 2) DEPARTURES BULK
      if (departures.length > 0) {
        const depBody = {
          tour_id: tourId,
          departures
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

// 8) HOTELS BULK
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

// 9) TRANSPORT BULK
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

// 10) BOOKING POI BULK
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

// 11) CANCELLATION BULK
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

// 12) INSTRUCTIONS BULK
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

        const imgRes = await fetch(
          `${baseurl}/api/images/upload/${tourId}`,
          {
            method: 'POST',
            body: formDataImages
          }
        );

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

      setSuccess('Tour saved successfully!');
      setTimeout(() => navigate('/tours'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to save tour');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (isLastTab) {
      finalSubmit();
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

  // Add days
  const dateObj = new Date(departureDate);
  dateObj.setDate(dateObj.getDate() + Number(duration));

  const returnISO = dateObj.toISOString().split("T")[0];

  setDepartureForm(prev => ({
    ...prev,
    departure_date: departureDate,
    return_date: returnISO
  }));
};


  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">Add Tour</h2>

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
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleBasicChange}
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option
                            key={c.category_id}
                            value={c.category_id}
                          >
                            {c.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Primary Destination *</Form.Label>
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
                      <Form.Label>Price (Adult) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="base_price_adult"
                        value={formData.base_price_adult}
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

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Overview</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="overview"
                        value={formData.overview}
                        onChange={handleBasicChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              {/* ======== TAB 2: DEPARTURES ======== */}
              <Tab eventKey="departures" title="Departures">
                <Row>

                  <Col md={3}>
    <Form.Group className="mb-3">
      <Form.Label>Duration (Days)</Form.Label>
      <Form.Control
        type="number"
        value={formData.duration_days}
        readOnly
         style={{
    backgroundColor: "#e9ecef",
    cursor: "not-allowed"
  }}
      />
    </Form.Group>
  </Col>

                  <Col md={3}>
    <Form.Group className="mb-3">
      <Form.Label>Departure Date</Form.Label>
      <Form.Control
        type="date"
        name="departure_date"
        value={departureForm.departure_date}
        onChange={handleDepartureDateSelect}  /* <-- NEW FUNCTION */
      />
    </Form.Group>
  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Return Date</Form.Label>
                      <Form.Control
  type="date"
  name="return_date"
  value={departureForm.return_date}
  readOnly
   style={{
    backgroundColor: "#e9ecef",
    cursor: "not-allowed"
  }}
/>

                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Seats</Form.Label>
                      <Form.Control
                        type="number"
                        name="total_seats"
                        value={departureForm.total_seats}
                        onChange={handleDepartureChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Adult Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="adult_price"
                        value={departureForm.adult_price}
                        onChange={handleDepartureChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Child Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="child_price"
                        value={departureForm.child_price}
                        onChange={handleDepartureChange}
                      />
                    </Form.Group>
                  </Col>

                    <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Infant Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="infant_price"
                        value={departureForm.infant_price}
                        onChange={handleDepartureChange}
                      />
                    </Form.Group>
                  </Col>
                                      <Col md={6}>
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

                <Button size="sm" className="mb-3" onClick={handleAddDeparture}>
                  + Add Departure
                </Button>

                {departures.length > 0 && (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Departure Date</th>
                        <th>Return Date</th>
                        <th>Adult Price</th>
                        <th>Child Price</th>
                        <th>Infant Price</th>
                        <th>Description</th>
                        <th>Total Seats</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departures.map((dep, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{dep.departure_date}</td>
                          <td>{dep.return_date || '-'}</td>
                          <td>{dep.adult_price}</td>
                          <td>{dep.child_price || '-'}</td>
                           <td>{dep.infant_price || '-'}</td>
                           <td>{dep.description || '-'}</td>
                          <td>{dep.total_seats}</td>
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

<Col md={12}>
      <Form.Group>
        <Form.Label>Remarks</Form.Label>
        <Form.Control
           as="textarea"
            rows={3}
          name="remarks"
          value={tourCostItem.remarks}
          onChange={handleCostChange}
        />
      </Form.Group>
    </Col>

    <Col md={12} className="mt-3">
      <Button size="sm" onClick={addCostRow}>+ Add Cost Row</Button>
    </Col>
  </Row>

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
          <th>Remarks</th>
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
            <td>{c.remarks || 'NA'}</td>
            <td>
              <Button variant="link" size="sm" onClick={() => removeCostRow(idx)}>remove</Button>
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

    <Col md={12}>
  <Form.Group className="mt-2">
    <Form.Label>Remarks</Form.Label>
    <Form.Control
      as="textarea"
      rows={3}
      name="remarks"
      value={hotelItem.remarks}
      onChange={handleHotelChange}
    />
  </Form.Group>
</Col>


    <Col md={1}>
      <Button size="sm" className="mt-4" onClick={addHotelRow}>+ Add</Button>
    </Col>
  </Row>

  {hotelRows.length > 0 && (
    <Table striped bordered hover size="sm" className="mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>City</th>
          <th>Hotel</th>
          <th>Room</th>
          <th>Nights</th>
          <th>Remarks</th>

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
            <td>{h.remarks || 'NA'}</td>

            <td>
              <Button variant="link" size="sm" onClick={() => removeHotelRow(idx)}>remove</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )}
</Tab>

<Tab eventKey="transport" title="Transport">
  <Row className="align-items-end">
    <Col md={2}>
      <Form.Group>
        <Form.Label>Mode</Form.Label>
        <Form.Select name="mode" value={transportItem.mode} onChange={handleTransportChange}>
          <option>Flight</option>
          <option>Train</option>
          <option>Bus</option>
          <option>Ferry</option>
          <option>Cruise</option>
          <option>Car</option>
        </Form.Select>
      </Form.Group>
    </Col>

    <Col md={3}>
      <Form.Group>
        <Form.Label>From City *</Form.Label>
        <Form.Control
          type="text"
          name="from_city"
          value={transportItem.from_city}
          onChange={handleTransportChange}
        />
      </Form.Group>
    </Col>

    <Col md={3}>
      <Form.Group>
        <Form.Label>To City *</Form.Label>
        <Form.Control
          type="text"
          name="to_city"
          value={transportItem.to_city}
          onChange={handleTransportChange}
        />
      </Form.Group>
    </Col>

    <Col md={2}>
      <Form.Group>
        <Form.Label>Carrier</Form.Label>
        <Form.Control
          type="text"
          name="carrier"
          value={transportItem.carrier}
          onChange={handleTransportChange}
        />
      </Form.Group>
    </Col>

    <Col md={2}>
      <Form.Group>
        <Form.Label>Number</Form.Label>
        <Form.Control
          type="text"
          name="number_code"
          value={transportItem.number_code}
          onChange={handleTransportChange}
        />
      </Form.Group>
    </Col>
  </Row>

  <Row className="mt-3 align-items-end">
    <Col md={3}>
      <Form.Group>
        <Form.Label>Departure</Form.Label>
        <Form.Control
          type="datetime-local"
          name="departure_datetime"
          value={transportItem.departure_datetime}
          onChange={handleTransportChange}
        />
      </Form.Group>
    </Col>

    <Col md={3}>
      <Form.Group>
        <Form.Label>Arrival</Form.Label>
        <Form.Control
          type="datetime-local"
          name="arrival_datetime"
          value={transportItem.arrival_datetime}
          onChange={handleTransportChange}
        />
      </Form.Group>
    </Col>

    <Col md={5}>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={transportItem.description}
          onChange={handleTransportChange}
        />
      </Form.Group>
    </Col>

    <Col md={12} className="mt-2">
  <Form.Group>
    <Form.Label>Remarks</Form.Label>
    <Form.Control
      as="textarea"
      rows={3}
      name="remarks"
      value={transportItem.remarks}
      onChange={handleTransportChange}
    />
  </Form.Group>
</Col>


    <Col md={1}>
      <Button size="sm" className="mt-4" onClick={addTransportRow}>+ Add</Button>
    </Col>
  </Row>

  {transports.length > 0 && (
    <Table striped bordered hover size="sm" className="mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Mode</th>
          <th>From</th>
          <th>To</th>
          <th>Carrier</th>
          <th>Number</th>
          <th>Departure</th>
          <th>Arrival</th>
          <th>Remarks</th>

          <th></th>
        </tr>
      </thead>
      <tbody>
        {transports.map((t, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{t.mode}</td>
            <td>{t.from_city}</td>
            <td>{t.to_city}</td>
            <td>{t.carrier}</td>
            <td>{t.number_code}</td>
            <td>{t.departure_datetime}</td>
            <td>{t.arrival_datetime}</td>
            <td>{t.remarks || 'NA'}</td>

            <td>
              <Button variant="link" size="sm" onClick={() => removeTransportRow(idx)}>remove</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )}
</Tab>

<Tab eventKey="bookingPoi" title="Booking POI">
  <Form.Group className="mb-3">
    <Form.Label>Add POI Item</Form.Label>
    <Form.Control
      as="textarea"
      rows={3}
      value={poiText}
      onChange={(e) => setPoiText(e.target.value)}
      placeholder="Type and click Add"
    />
    <Button size="sm" className="mt-2" onClick={addPoi}>+ Add</Button>
  </Form.Group>

  {bookingPois.length > 0 && (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {bookingPois.map((p, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{p}</td>
            <td>
              <Button variant="link" size="sm" onClick={() => removePoi(idx)}>remove</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )}
</Tab>

<Tab eventKey="cancellation" title="Cancellation Policy">
  <Row className="align-items-end">
    <Col md={3}>
      <Form.Group>
        <Form.Label>Days Min</Form.Label>
        <Form.Control
          type="number"
          name="days_min"
          value={cancelItem.days_min}
          onChange={handleCancelChange}
        />
      </Form.Group>
    </Col>

    <Col md={3}>
      <Form.Group>
        <Form.Label>Days Max</Form.Label>
        <Form.Control
          type="number"
          name="days_max"
          value={cancelItem.days_max}
          onChange={handleCancelChange}
        />
      </Form.Group>
    </Col>

    <Col md={3}>
      <Form.Group>
        <Form.Label>Charge (%) *</Form.Label>
        <Form.Control
          type="number"
          name="charge_percentage"
          value={cancelItem.charge_percentage}
          onChange={handleCancelChange}
        />
      </Form.Group>
    </Col>

    <Col md={1}>
      <Button size="sm" className="mt-4" onClick={addCancelRow}>+ Add</Button>
    </Col>
  </Row>

  {cancelPolicies.length > 0 && (
    <Table striped bordered hover className="mt-3" size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Days Min</th>
          <th>Days Max</th>
          <th>Charge %</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {cancelPolicies.map((c, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{c.days_min || '-'}</td>
            <td>{c.days_max || '-'}</td>
            <td>{c.charge_percentage}</td>
            <td>
              <Button variant="link" size="sm" onClick={() => removeCancelRow(idx)}>remove</Button>
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
      placeholder="Type instruction and click Add"
    />
    <Button size="sm" className="mt-2" onClick={addInstruction}>+ Add</Button>
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



              {/* ======== TAB 3: EXCLUSIONS ======== */}
              <Tab eventKey="exclusions" title="Exclusions">
                <Form.Group className="mb-3">
                  <Form.Label>Add Exclusion</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={exclusionText}
                    onChange={(e) => setExclusionText(e.target.value)}
                    placeholder="Type an exclusion and click Add"
                  />
                  <Button className="mt-2" size="sm" onClick={handleAddExclusion}>
                    + Add Exclusion
                  </Button>
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

              {/* ======== TAB 4: IMAGES ======== */}
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

              {/* ======== TAB 5: INCLUSIONS ======== */}
              <Tab eventKey="inclusions" title="Inclusions">
                <Form.Group className="mb-3">
                  <Form.Label>Add Inclusion</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={inclusionText}
                    onChange={(e) => setInclusionText(e.target.value)}
                    placeholder="Type an inclusion and click Add"
                  />
                  <Button className="mt-2" size="sm" onClick={handleAddInclusion}>
                    + Add Inclusion
                  </Button>
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

              {/* ======== TAB 6: ITINERARIES ======== */}
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

                <Button size="sm" onClick={handleAddItinerary}>
                  + Add Day
                </Button>

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
            </Tabs>

            {/* ======== BUTTONS ======== */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" onClick={handleCancel}>
                Cancel
              </Button>

              <Button variant="secondary" onClick={goBack} disabled={activeTab === 'basic'}>
                Back
              </Button>

              <Button variant="primary" onClick={handleSaveClick} disabled={loading}>
                {isLastTab ? (loading ? 'Saving...' : 'Save All') : 'Save & Continue'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddTour;
