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
    total_seats: 40
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
    const { departure_date, adult_price } = departureForm;

    if (!departure_date || !adult_price) return;

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
      total_seats: 40
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
