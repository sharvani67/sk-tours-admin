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
  Tab
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

  // DEPARTURE (single)
  const [departureData, setDepartureData] = useState({
    departure_date: '',
    return_date: '',
    adult_price: '',
    child_price: '',
    total_seats: 40
  });

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
    meals: ''
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
    const { name, value, type } = e.target;

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

  // DEPARTURE CHANGE
  const handleDepartureChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['adult_price', 'child_price', 'total_seats'];

    setDepartureData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === '' ? '' : Number(value)
        : value
    }));
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

  const handleAddItinerary = () => {
    const { day, title, description, meals } = itineraryItem;
    if (!day || !title.trim()) return;

    setItineraries((prev) => [
      ...prev,
      {
        day: Number(day),
        title: title.trim(),
        description: description.trim(),
        meals: meals.trim()
      }
    ]);

    setItineraryItem({
      day: '',
      title: '',
      description: '',
      meals: ''
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

      // 2) DEPARTURE
      if (departureData.departure_date && departureData.adult_price) {
        const depData = {
          tour_id: tourId,
          departure_date: departureData.departure_date,
          return_date: departureData.return_date || null,
          adult_price: departureData.adult_price,
          child_price: departureData.child_price || null,
          total_seats:
            departureData.total_seats === '' ? 40 : departureData.total_seats
        };

        const depRes = await fetch(`${baseurl}/api/departures`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(depData)
        });

        if (!depRes.ok) {
          const err = await depRes.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to save departure');
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
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Departure Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="departure_date"
                        value={departureData.departure_date}
                        onChange={handleDepartureChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Return Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="return_date"
                        value={departureData.return_date}
                        onChange={handleDepartureChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Seats</Form.Label>
                      <Form.Control
                        type="number"
                        name="total_seats"
                        value={departureData.total_seats}
                        onChange={handleDepartureChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Adult Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="adult_price"
                        value={departureData.adult_price}
                        onChange={handleDepartureChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Child Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="child_price"
                        value={departureData.child_price}
                        onChange={handleDepartureChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
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
                  <ul>
                    {exclusions.map((item, idx) => (
                      <li key={idx}>
                        {item}{' '}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleRemoveExclusion(idx)}
                        >
                          remove
                        </Button>
                      </li>
                    ))}
                  </ul>
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
                  <ul>
                    {inclusions.map((item, idx) => (
                      <li key={idx}>
                        {item}{' '}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleRemoveInclusion(idx)}
                        >
                          remove
                        </Button>
                      </li>
                    ))}
                  </ul>
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
                      <Form.Control
                        type="text"
                        name="meals"
                        value={itineraryItem.meals}
                        onChange={handleItineraryChange}
                        placeholder="Breakfast, Lunch..."
                      />
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
                  <ul className="mt-3">
                    {itineraries
                      .sort((a, b) => a.day - b.day)
                      .map((item, idx) => (
                        <li key={idx}>
                          <strong>Day {item.day}:</strong> {item.title}{' '}
                          {item.meals && <em>({item.meals})</em>}
                          {item.description && ` - ${item.description}`}{' '}
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleRemoveItinerary(idx)}
                          >
                            remove
                          </Button>
                        </li>
                      ))}
                  </ul>
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
