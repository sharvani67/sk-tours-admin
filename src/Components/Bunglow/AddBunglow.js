import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import { Pencil, Trash, PlusCircle, XCircle, Plus, Save } from 'react-bootstrap-icons';

const AddBungalow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const TAB_LIST = ['basic', 'images', 'overview', 'bungalowRate', 'inclusiveExclusive', 'placesNearby', 'bookingPolicy', 'cancellationPolicy'];
  const BUNGALOW_RATE_SUB_TABS = ['weekDayRate', 'weekendRate', 'longHolidays', 'festivalHolidays'];

  const [activeTab, setActiveTab] = useState('basic');
  const [activeSubTab, setActiveSubTab] = useState('weekDayRate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Basic Details
  const [formData, setFormData] = useState({
    bungalow_code: '',
    name: '',
    price: '',
    bungalow_rate: '',
    overview: '',
    inclusive: '',
    exclusive: '',
    places_nearby: '',
    booking_policy: '',
    cancellation_policy: ''
  });

  // Description texts for each rate type
  const [rateDescriptions, setRateDescriptions] = useState({
    week_day_rate_desc: '',
    weekend_rate_desc: '',
    long_holidays_desc: '',
    festival_holidays_desc: ''
  });

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    city: '',
    bungalow_no: 'BUNG0001',
    contact_person: '',
    cell_no: '',
    email_id: '',
    address: '',
    pin_code: '',
    state: '',
    country: 'India',
    no_of_people: 1
  });

  const [guestDetails, setGuestDetails] = useState([]);

  // Images
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);

  // Cities List
  const cities = [
    'Alibaug', 'Aamby Valley', 'Goa', 'Igatpuri', 'Karjat', 
    'Khopoli', 'Kashid', 'Lonavala', 'Mahabaleshwar', 'Murbad', 'Neral'
  ];

  // Load bungalow data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadBungalowData();
    } else {
      getNextBungalowCode();
    }
  }, [id]);

  // Update guest boxes when number of people changes
  useEffect(() => {
    const numPeople = parseInt(bookingForm.no_of_people) || 0;
    const newGuests = [...guestDetails];
    
    while (newGuests.length < numPeople) {
      newGuests.push({ name: '', age: '', cell_no: '', email_id: '' });
    }
    
    while (newGuests.length > numPeople) {
      newGuests.pop();
    }
    
    setGuestDetails(newGuests);
  }, [bookingForm.no_of_people]);

  const getNextBungalowCode = async () => {
    try {
      const response = await fetch(`${baseurl}/api/bungalows/next-bungalow-code`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          bungalow_code: data.next_bungalow_code
        }));
        setBookingForm(prev => ({
          ...prev,
          bungalow_no: data.next_bungalow_code
        }));
      }
    } catch (err) {
      setError('Failed to generate bungalow code');
    }
  };

  const loadBungalowData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseurl}/api/bungalows/${id}`);
      if (!response.ok) throw new Error('Failed to fetch bungalow data');
      
      const data = await response.json();
      
      setFormData({
        bungalow_code: data.bungalow.bungalow_code || '',
        name: data.bungalow.name || '',
        price: data.bungalow.price || '',
        bungalow_rate: data.bungalow.bungalow_rate || '',
        overview: data.bungalow.overview || '',
        inclusive: data.bungalow.inclusive || '',
        exclusive: data.bungalow.exclusive || '',
        places_nearby: data.bungalow.places_nearby || '',
        booking_policy: data.bungalow.booking_policy || '',
        cancellation_policy: data.bungalow.cancellation_policy || ''
      });

      // Load rate descriptions if available
      if (data.rate_descriptions) {
        setRateDescriptions(data.rate_descriptions);
      }

      setBookingForm(prev => ({
        ...prev,
        bungalow_no: data.bungalow.bungalow_code || 'BUNG0001'
      }));

      const imagesWithFullUrl = (data.images || []).map(img => ({
        ...img,
        image_url: img.image_url.startsWith('http') 
          ? img.image_url 
          : `${baseurl}${img.image_url}`
      }));
      setExistingImages(imagesWithFullUrl);
      
    } catch (err) {
      setError('Failed to load bungalow data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Use useCallback with empty dependency array to keep function reference stable
  const handleWeekDayRateChange = useCallback((e) => {
    const { value } = e.target;
    setRateDescriptions(prev => ({ ...prev, week_day_rate_desc: value }));
  }, []);

  const handleWeekendRateChange = useCallback((e) => {
    const { value } = e.target;
    setRateDescriptions(prev => ({ ...prev, weekend_rate_desc: value }));
  }, []);

  const handleLongHolidaysChange = useCallback((e) => {
    const { value } = e.target;
    setRateDescriptions(prev => ({ ...prev, long_holidays_desc: value }));
  }, []);

  const handleFestivalHolidaysChange = useCallback((e) => {
    const { value } = e.target;
    setRateDescriptions(prev => ({ ...prev, festival_holidays_desc: value }));
  }, []);

  // Booking Form Handlers
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...guestDetails];
    updatedGuests[index][field] = value;
    setGuestDetails(updatedGuests);
  };

  const handleBookingSubmit = async () => {
    if (!bookingForm.city) {
      alert('Please select a city');
      return;
    }
    if (!bookingForm.contact_person) {
      alert('Please enter contact person name');
      return;
    }
    if (!bookingForm.cell_no) {
      alert('Please enter cell number');
      return;
    }

    for (let i = 0; i < guestDetails.length; i++) {
      const guest = guestDetails[i];
      if (!guest.name || !guest.age || !guest.cell_no || !guest.email_id) {
        alert(`Please fill all details for guest ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);
      
      const bookingData = {
        bungalow_code: bookingForm.bungalow_no,
        city: bookingForm.city,
        contact_person: bookingForm.contact_person,
        cell_no: bookingForm.cell_no,
        email_id: bookingForm.email_id,
        address: bookingForm.address,
        pin_code: bookingForm.pin_code,
        state: bookingForm.state,
        country: bookingForm.country || 'India',
        no_of_people: parseInt(bookingForm.no_of_people),
        guests: guestDetails.map(guest => ({
          name: guest.name,
          age: parseInt(guest.age),
          cell_no: guest.cell_no,
          email_id: guest.email_id
        }))
      };

      const response = await fetch(`${baseurl}/api/bungalows/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit booking');
      }

      setSuccess('Booking submitted successfully!');
      resetBookingForm();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error submitting booking:', err);
      setError('Failed to submit booking: ' + err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setBookingForm(prev => ({
      city: '',
      bungalow_no: prev.bungalow_no,
      contact_person: '',
      cell_no: '',
      email_id: '',
      address: '',
      pin_code: '',
      state: '',
      country: 'India',
      no_of_people: 1
    }));
    setGuestDetails([]);
  };

  // Image Handlers
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
  };

  const setMainImage = async (imageId) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseurl}/api/bungalows/images/main/${imageId}`, {
        method: 'PUT'
      });
      
      if (!response.ok) throw new Error('Failed to set main image');
      
      setExistingImages(prev => 
        prev.map(img => ({
          ...img,
          is_main: img.image_id === imageId ? 1 : 0
        }))
      );
      
      setSuccess('Main image updated successfully');
    } catch (err) {
      setError('Failed to set main image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`${baseurl}/api/bungalows/images/${imageId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete image');
      
      setExistingImages(prev => prev.filter(img => img.image_id !== imageId));
      setSuccess('Image deleted successfully');
    } catch (err) {
      setError('Failed to delete image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateImage = async (imageId) => {
    if (!replacementFile) {
      alert('Please select a new image file');
      return;
    }

    try {
      setLoading(true);
      
      await fetch(`${baseurl}/api/bungalows/images/${imageId}`, {
        method: 'DELETE'
      });

      const formData = new FormData();
      formData.append('images', replacementFile);
      
      const uploadResponse = await fetch(`${baseurl}/api/bungalows/upload/${id}`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload new image');
      
      await loadBungalowData();
      setSuccess('Image updated successfully');
      cancelEditImage();
    } catch (err) {
      setError('Failed to update image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (bungalowId) => {
    if (imageFiles.length === 0) return;

    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${baseurl}/api/bungalows/upload/${bungalowId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload images');
  };

  // Save Functions
  const saveRateDetails = async () => {
    if (!id && !isEditMode) {
      return true;
    }

    try {
      const payload = {
        descriptions: rateDescriptions
      };

      const response = await fetch(`${baseurl}/api/bungalows/${id}/rate-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save rate details');
      return true;
    } catch (err) {
      setError('Failed to save rate details: ' + err.message);
      return false;
    }
  };

  const createBungalow = async () => {
    if (!formData.name.trim()) {
      setError('Bungalow name is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.price) {
      setError('Price is required');
      setActiveTab('basic');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${baseurl}/api/bungalows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...rateDescriptions })
      });

      if (!response.ok) throw new Error('Failed to create bungalow');
      
      const result = await response.json();
      const bungalowId = result.bungalow_id;

      if (imageFiles.length > 0) {
        await uploadImages(bungalowId);
      }

      // Save rate details after bungalow is created
      const tempId = id || bungalowId;
      const payload = {
        descriptions: rateDescriptions
      };

      const rateSaveResponse = await fetch(`${baseurl}/api/bungalows/${tempId}/rate-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!rateSaveResponse.ok) {
        console.warn('Failed to save rate details');
      }

      setSuccess('Bungalow created successfully!');
      setTimeout(() => navigate('/bungalows'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create bungalow');
    } finally {
      setLoading(false);
    }
  };

  const updateBungalow = async () => {
    if (!formData.name.trim()) {
      setError('Bungalow name is required');
      setActiveTab('basic');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${baseurl}/api/bungalows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...rateDescriptions })
      });

      if (!response.ok) throw new Error('Failed to update bungalow');

      if (imageFiles.length > 0) {
        await uploadImages(id);
      }

      // Save rate details
      await saveRateDetails();

      setSuccess('Bungalow updated successfully!');
      setTimeout(() => navigate('/bungalows'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update bungalow');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (isEditMode) {
      updateBungalow();
    } else {
      createBungalow();
    }
  };

  const handleSaveAndContinue = async () => {
    // Save the current rate description data
    if (isEditMode && id) {
      try {
        await saveRateDetails();
      } catch (err) {
        console.error('Failed to save rate details:', err);
      }
    }
    
    // Move to next sub-tab within Bungalow Rent
    const currentSubTabIndex = BUNGALOW_RATE_SUB_TABS.indexOf(activeSubTab);
    if (currentSubTabIndex < BUNGALOW_RATE_SUB_TABS.length - 1) {
      setActiveSubTab(BUNGALOW_RATE_SUB_TABS[currentSubTabIndex + 1]);
    } else {
      // If we're at the last sub-tab, move to the next main tab
      const currentMainTabIndex = TAB_LIST.indexOf(activeTab);
      if (currentMainTabIndex < TAB_LIST.length - 1) {
        setActiveTab(TAB_LIST[currentMainTabIndex + 1]);
      }
    }
  };

  const goBack = () => {
    const currentIndex = TAB_LIST.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(TAB_LIST[currentIndex - 1]);
    }
  };

  const goNext = () => {
    const currentIndex = TAB_LIST.indexOf(activeTab);
    if (currentIndex < TAB_LIST.length - 1) {
      setActiveTab(TAB_LIST[currentIndex + 1]);
    }
  };

  const isLastTab = activeTab === TAB_LIST[TAB_LIST.length - 1];
  const isBungalowRentTab = activeTab === 'bungalowRate';
  const isLastSubTab = activeSubTab === BUNGALOW_RATE_SUB_TABS[BUNGALOW_RATE_SUB_TABS.length - 1];

  // Create memoized components OUTSIDE of the render function
  // Use React.memo with custom comparison to prevent unnecessary re-renders
  const WeekDayRateTab = memo(({ value, onChange }) => (
    <div>
      <h5 className="mb-3">Week Day Rates</h5>
      <Form.Group className="mb-4">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="week_day_rate_desc"
          value={value}
          onChange={onChange}
          placeholder="Enter description for week day rates..."
        />
      </Form.Group>
    </div>
  ), (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
  });

  const WeekendRateTab = memo(({ value, onChange }) => (
    <div>
      <h5 className="mb-3">Weekend Rates</h5>
      <Form.Group className="mb-4">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="weekend_rate_desc"
          value={value}
          onChange={onChange}
          placeholder="Enter description for weekend rates..."
        />
      </Form.Group>
    </div>
  ), (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
  });

  const LongHolidaysTab = memo(({ value, onChange }) => (
    <div>
      <h5 className="mb-3">Long Holidays</h5>
      <Form.Group className="mb-4">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="long_holidays_desc"
          value={value}
          onChange={onChange}
          placeholder="Enter description for long holidays rates..."
        />
      </Form.Group>
    </div>
  ), (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
  });

  const FestivalHolidaysTab = memo(({ value, onChange }) => (
    <div>
      <h5 className="mb-3">Festival Holidays</h5>
      <Form.Group className="mb-4">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="festival_holidays_desc"
          value={value}
          onChange={onChange}
          placeholder="Enter description for festival holidays rates..."
        />
      </Form.Group>
    </div>
  ), (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
  });

  return (
    <Navbar>
      <Container fluid className="py-4">
        <h2 className="mb-4">{isEditMode ? 'Edit Bungalow' : 'Add Bungalow'}</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              {/* Basic Details Tab */}
              <Tab eventKey="basic" title="Basic Details">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bungalow Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="bungalow_code"
                        value={formData.bungalow_code}
                        readOnly
                        disabled={isEditMode}
                        style={{
                          backgroundColor: '#f8f9fa',
                          fontWeight: 'bold'
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bungalow Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleBasicChange}
                        placeholder="Enter bungalow name"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (₹) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleBasicChange}
                        placeholder="Enter price per night"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              {/* Images Tab */}
              <Tab eventKey="images" title="Images">
                <Card className="mb-4">
                  <Card.Header>Upload New Images</Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Images</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                      />
                      <Form.Text className="text-muted">
                        First image will be set as main image. Supported formats: JPEG, PNG, WebP
                      </Form.Text>
                    </Form.Group>
                    
                    {imageFiles.length > 0 && (
                      <Row className="mt-3">
                        {imageFiles.map((file, idx) => (
                          <Col md={3} key={idx} className="mb-3">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${idx}`}
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>Existing Images</Card.Header>
                  <Card.Body>
                    {existingImages.length === 0 ? (
                      <p className="text-muted text-center py-4">No images uploaded yet</p>
                    ) : (
                      <Row>
                        {existingImages.map((image) => (
                          <Col md={4} lg={3} key={image.image_id} className="mb-4">
                            <Card>
                              <Card.Body className="p-2">
                                <div className="position-relative">
                                  <img
                                    src={image.image_url}
                                    alt="bungalow"
                                    style={{
                                      width: '100%',
                                      height: '150px',
                                      objectFit: 'cover',
                                      borderRadius: '6px'
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                                    }}
                                  />
                                  {image.is_main === 1 && (
                                    <div className="position-absolute top-0 start-0 bg-warning text-dark px-2 py-1 rounded-end">
                                      ★ Main
                                    </div>
                                  )}
                                  
                                  {editingImageId === image.image_id ? (
                                    <div className="mt-3">
                                      <Form.Group>
                                        <Form.Label>Replace with:</Form.Label>
                                        <Form.Control
                                          type="file"
                                          onChange={handleReplacementFileChange}
                                          accept="image/*"
                                        />
                                      </Form.Group>
                                      {replacementPreview && (
                                        <img
                                          src={replacementPreview}
                                          alt="preview"
                                          style={{
                                            width: '100%',
                                            height: '80px',
                                            objectFit: 'cover',
                                            marginTop: '10px'
                                          }}
                                        />
                                      )}
                                      <div className="d-flex gap-2 mt-2">
                                        <Button
                                          size="sm"
                                          variant="success"
                                          onClick={() => updateImage(image.image_id)}
                                          disabled={!replacementFile}
                                        >
                                          Update
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          onClick={cancelEditImage}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="d-flex gap-1 mt-2 justify-content-center">
                                      {image.is_main === 0 && (
                                        <Button
                                          size="sm"
                                          variant="outline-warning"
                                          onClick={() => setMainImage(image.image_id)}
                                          title="Set as Main"
                                        >
                                          ★
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => startEditImage(image)}
                                        title="Replace"
                                      >
                                        <Pencil size={14} />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => deleteImage(image.image_id)}
                                        title="Delete"
                                      >
                                        <Trash size={14} />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              </Tab>

              {/* Overview Tab */}
              <Tab eventKey="overview" title="Overview">
                <Form.Group className="mb-3">
                  <Form.Label>Overview Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="overview"
                    value={formData.overview}
                    onChange={handleBasicChange}
                    placeholder="Enter overview description..."
                  />
                </Form.Group>
              </Tab>

              {/* Bungalow Rate Tab with Sub-tabs */}
              <Tab eventKey="bungalowRate" title="Bungalow Rent">
                <Tabs 
                  activeKey={activeSubTab} 
                  onSelect={(k) => setActiveSubTab(k)}
                  className="mb-3"
                >
                  <Tab eventKey="weekDayRate" title="Week Day Rate">
                    <WeekDayRateTab 
                      value={rateDescriptions.week_day_rate_desc} 
                      onChange={handleWeekDayRateChange}
                    />
                  </Tab>
                  <Tab eventKey="weekendRate" title="Weekend Rate">
                    <WeekendRateTab 
                      value={rateDescriptions.weekend_rate_desc}
                      onChange={handleWeekendRateChange}
                    />
                  </Tab>
                  <Tab eventKey="longHolidays" title="Long Holidays">
                    <LongHolidaysTab 
                      value={rateDescriptions.long_holidays_desc}
                      onChange={handleLongHolidaysChange}
                    />
                  </Tab>
                  <Tab eventKey="festivalHolidays" title="Festival Holidays">
                    <FestivalHolidaysTab 
                      value={rateDescriptions.festival_holidays_desc}
                      onChange={handleFestivalHolidaysChange}
                    />
                  </Tab>
                </Tabs>
              </Tab>

              {/* Inclusive & Exclusive Tab */}
              <Tab eventKey="inclusiveExclusive" title="Inclusive & Exclusive">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Inclusive</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={8}
                        name="inclusive"
                        value={formData.inclusive}
                        onChange={handleBasicChange}
                        placeholder="Enter inclusive items..."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Exclusive</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={8}
                        name="exclusive"
                        value={formData.exclusive}
                        onChange={handleBasicChange}
                        placeholder="Enter exclusive items..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              {/* Places Nearby Tab */}
              <Tab eventKey="placesNearby" title="Places Nearby">
                <Form.Group className="mb-3">
                  <Form.Label>Places Nearby Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="places_nearby"
                    value={formData.places_nearby}
                    onChange={handleBasicChange}
                    placeholder="Enter places nearby description..."
                  />
                </Form.Group>
              </Tab>

              {/* Booking Policy Tab */}
              <Tab eventKey="bookingPolicy" title="Booking Policy">
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Booking Policy Text</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="booking_policy"
                      value={formData.booking_policy}
                      onChange={handleBasicChange}
                      placeholder="Enter booking policy..."
                    />
                  </Form.Group>
                </Col>
              </Tab>

              {/* Cancellation Policy Tab */}
              <Tab eventKey="cancellationPolicy" title="Cancellation Policy">
                <Form.Group className="mb-3">
                  <Form.Label>Cancellation Policy Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="cancellation_policy"
                    value={formData.cancellation_policy}
                    onChange={handleBasicChange}
                    placeholder="Enter cancellation policy details, deadlines, refund percentages, etc..."
                  />
                  <Form.Text className="text-muted">
                    Specify cancellation terms, deadlines, refund percentages, and any other cancellation-related information.
                  </Form.Text>
                </Form.Group>
              </Tab>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between gap-2 mt-4">
              <div>
                {/* <Button
                  variant="secondary"
                  onClick={() => navigate('/bungalows')}
                  disabled={loading}
                >
                  Cancel
                </Button> */}
              </div>
              
              <div className="d-flex gap-2">
                {!isBungalowRentTab ? (
                  // Regular navigation for non-Bungalow Rent tabs
                  <>
                    <Button
                      variant="secondary"
                      onClick={goBack}
                      disabled={activeTab === 'basic' || loading}
                    >
                      Back
                    </Button>

                    {!isLastTab && (
                      <Button
                        variant="primary"
                        onClick={goNext}
                        disabled={loading}
                      >
                        Next
                      </Button>
                    )}

                    {isLastTab && (
                      <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Bungalow' : 'Save Bungalow')}
                      </Button>
                    )}
                  </>
                ) : (
                  // Special navigation for Bungalow Rent tab
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const currentSubTabIndex = BUNGALOW_RATE_SUB_TABS.indexOf(activeSubTab);
                        if (currentSubTabIndex > 0) {
                          setActiveSubTab(BUNGALOW_RATE_SUB_TABS[currentSubTabIndex - 1]);
                        } else {
                          // If at first sub-tab, go back to previous main tab
                          const currentMainTabIndex = TAB_LIST.indexOf(activeTab);
                          if (currentMainTabIndex > 0) {
                            setActiveTab(TAB_LIST[currentMainTabIndex - 1]);
                          }
                        }
                      }}
                      disabled={loading}
                    >
                      Back
                    </Button>

                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        onClick={handleSaveAndContinue}
                        disabled={loading}
                      >
                        <Save className="me-1" /> Save & Continue
                      </Button>
                      
                      {isLastSubTab && (
                        <Button
                          variant="primary"
                          onClick={() => {
                            const currentMainTabIndex = TAB_LIST.indexOf(activeTab);
                            if (currentMainTabIndex < TAB_LIST.length - 1) {
                              setActiveTab(TAB_LIST[currentMainTabIndex + 1]);
                            }
                          }}
                          disabled={loading}
                        >
                          Next Tab
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddBungalow;