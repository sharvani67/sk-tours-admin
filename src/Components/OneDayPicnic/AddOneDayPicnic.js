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
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import { Pencil, Trash, PlusCircle, XCircle } from 'react-bootstrap-icons';

const AddOneDayPicnic = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const TAB_LIST = ['basic', 'images', 'overview', 'propertyRate', 'inclusiveExclusive', 'placesNearby', 'amenities', 'bookingPolicy', 'cancellationPolicy'];

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Basic Details
  const [formData, setFormData] = useState({
    picnic_code: '',
    name: '',
    city_name: '',
    duration: '',
    price: '',
    property_rate: '',
    overview: '',
    inclusive: '',
    exclusive: '',
    amenities: '',
    booking_policy: '',
    cancellation_policy: ''
  });

  // Q&A structure for Places Nearby (similar to Exhibition About tab)
  const [placesNearbyQA, setPlacesNearbyQA] = useState([
    { id: Date.now(), question: '', answer: '' }
  ]);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    city: '',
    picnic_no: 'PICNIC0001',
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

  // Cities List (same as bungalows)
  const cities = [
    'Alibaug', 'Aamby Valley', 'Goa', 'Igatpuri', 'Karjat', 
    'Khopoli', 'Kashid', 'Lonavala', 'Mahabaleshwar', 'Murbad', 'Neral'
  ];

  // Load picnic data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadPicnicData();
    } else {
      getNextPicnicCode();
    }
  }, [id]);

  // Update guest boxes when number of people changes
  useEffect(() => {
    const numPeople = parseInt(bookingForm.no_of_people) || 0;
    const newGuests = [...guestDetails];
    
    // Add rows if needed
    while (newGuests.length < numPeople) {
      newGuests.push({ name: '', age: '', cell_no: '', email_id: '' });
    }
    
    // Remove rows if needed
    while (newGuests.length > numPeople) {
      newGuests.pop();
    }
    
    setGuestDetails(newGuests);
  }, [bookingForm.no_of_people]);

  const getNextPicnicCode = async () => {
    try {
      const response = await fetch(`${baseurl}/api/one-day-picnic/next-picnic-code`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          picnic_code: data.next_picnic_code
        }));
        // Update booking form picnic number
        setBookingForm(prev => ({
          ...prev,
          picnic_no: data.next_picnic_code
        }));
      }
    } catch (err) {
      setError('Failed to generate picnic code');
    }
  };

  const loadPicnicData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseurl}/api/one-day-picnic/${id}`);
      if (!response.ok) throw new Error('Failed to fetch picnic data');
      
      const data = await response.json();
      console.log('Loaded picnic data:', data);
      
      setFormData({
        picnic_code: data.picnic.picnic_code || '',
        name: data.picnic.name || '',
        city_name: data.picnic.city_name || '',
        duration: data.picnic.duration || '',
        price: data.picnic.price || '',
        property_rate: data.picnic.property_rate || '',
        overview: data.picnic.overview || '',
        inclusive: data.picnic.inclusive || '',
        exclusive: data.picnic.exclusive || '',
        amenities: data.picnic.amenities || '',
        booking_policy: data.picnic.booking_policy || '',
        cancellation_policy: data.picnic.cancellation_policy || ''
      });

      // Load places nearby Q&A if available
      if (data.picnic.places_nearby_qa && data.picnic.places_nearby_qa.length > 0) {
        setPlacesNearbyQA(data.picnic.places_nearby_qa.map((qa, index) => ({
          id: Date.now() + index,
          question: qa.question,
          answer: qa.answer
        })));
      }

      // Update booking form with picnic code
      setBookingForm(prev => ({
        ...prev,
        picnic_no: data.picnic.picnic_code || 'PICNIC0001'
      }));

      // Fix image URLs
      const imagesWithFullUrl = (data.images || []).map(img => ({
        ...img,
        image_url: img.image_url.startsWith('http') 
          ? img.image_url 
          : `${baseurl}${img.image_url}`
      }));
      setExistingImages(imagesWithFullUrl);
      
    } catch (err) {
      setError('Failed to load picnic data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Places Nearby Q&A Handlers (similar to Exhibition About tab)
  const handlePlacesNearbyQAChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQA = [...placesNearbyQA];
    
    if (name === 'question' || name === 'answer') {
      updatedQA[index] = {
        ...updatedQA[index],
        [name]: value
      };
      setPlacesNearbyQA(updatedQA);
    }
  };

  const addNewPlacesNearbyQA = () => {
    const newQA = { id: Date.now(), question: '', answer: '' };
    setPlacesNearbyQA([...placesNearbyQA, newQA]);
  };

  const removePlacesNearbyQA = (index) => {
    if (placesNearbyQA.length > 1) {
      const updatedQA = placesNearbyQA.filter((_, i) => i !== index);
      setPlacesNearbyQA(updatedQA);
    }
  };

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
    // Validate form
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

    // Validate guest details
    for (let i = 0; i < guestDetails.length; i++) {
      const guest = guestDetails[i];
      if (!guest.name || !guest.age || !guest.cell_no || !guest.email_id) {
        alert(`Please fill all details for guest ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);
      
      // Prepare the data for API
      const bookingData = {
        picnic_code: bookingForm.picnic_no,
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

      console.log('Sending booking data:', bookingData);

      // Send data to backend
      const response = await fetch(`${baseurl}/api/one-day-picnic/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit booking');
      }

      console.log('Booking saved successfully:', result);
      
      // Show success message
      setSuccess('Booking submitted successfully!');
      
      // Reset form after successful submission
      resetBookingForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting booking:', err);
      setError('Failed to submit booking: ' + err.message);
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const resetBookingForm = () => {
    setBookingForm(prev => ({
      city: '',
      picnic_no: prev.picnic_no,
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
      const response = await fetch(`${baseurl}/api/one-day-picnic/images/main/${imageId}`, {
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
      const response = await fetch(`${baseurl}/api/one-day-picnic/images/${imageId}`, {
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
      
      // Delete old image
      await fetch(`${baseurl}/api/one-day-picnic/images/${imageId}`, {
        method: 'DELETE'
      });

      // Upload new image
      const formData = new FormData();
      formData.append('images', replacementFile);
      
      const uploadResponse = await fetch(`${baseurl}/api/one-day-picnic/upload/${id}`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload new image');
      
      // Reload data to get updated images
      await loadPicnicData();
      setSuccess('Image updated successfully');
      cancelEditImage();
    } catch (err) {
      setError('Failed to update image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (picnicId) => {
    if (imageFiles.length === 0) return;

    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${baseurl}/api/one-day-picnic/upload/${picnicId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload images');
  };

  // Save Functions
  const createPicnic = async () => {
    if (!formData.name.trim()) {
      setError('Picnic name is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.city_name.trim()) {
      setError('City name is required');
      setActiveTab('basic');
      return;
    }
    if (!formData.duration.trim()) {
      setError('Duration is required');
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
      
      // Prepare Q&A data for places nearby
      const validPlacesNearbyQA = placesNearbyQA.filter(qa => 
        qa.question.trim() !== '' && qa.answer.trim() !== ''
      );
      
      const picnicData = {
        ...formData,
        places_nearby_qa: validPlacesNearbyQA
      };
      
      const response = await fetch(`${baseurl}/api/one-day-picnic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(picnicData)
      });

      if (!response.ok) throw new Error('Failed to create picnic');
      
      const result = await response.json();
      const picnicId = result.picnic_id;

      if (imageFiles.length > 0) {
        await uploadImages(picnicId);
      }

      setSuccess('One Day Picnic created successfully!');
      setTimeout(() => navigate('/one-day-picnic'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create picnic');
    } finally {
      setLoading(false);
    }
  };

  const updatePicnic = async () => {
    if (!formData.name.trim()) {
      setError('Picnic name is required');
      setActiveTab('basic');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare Q&A data for places nearby
      const validPlacesNearbyQA = placesNearbyQA.filter(qa => 
        qa.question.trim() !== '' && qa.answer.trim() !== ''
      );
      
      const picnicData = {
        ...formData,
        places_nearby_qa: validPlacesNearbyQA
      };
      
      const response = await fetch(`${baseurl}/api/one-day-picnic/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(picnicData)
      });

      if (!response.ok) throw new Error('Failed to update picnic');

      if (imageFiles.length > 0) {
        await uploadImages(id);
      }

      setSuccess('One Day Picnic updated successfully!');
      setTimeout(() => navigate('/one-day-picnic'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update picnic');
    } finally {
      setLoading(false);
    }
  };

 // Update the goNext and goBack functions
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

// Replace the existing handleSave function with this:
const handleSave = () => {
  // For Save All/Update All operations
  const confirmMessage = isEditMode 
    ? 'Are you sure you want to update this one day picnic with all changes?'
    : 'Are you sure you want to save this one day picnic with all data?';
  
  const confirmed = window.confirm(confirmMessage);
  
  if (confirmed) {
    if (isEditMode) {
      updatePicnic();
    } else {
      createPicnic();
    }
  }
};

  const isLastTab = activeTab === TAB_LIST[TAB_LIST.length - 1];

  return (
    <Navbar>
      <Container fluid className="py-4">
        <h2 className="mb-4">{isEditMode ? 'Edit One Day Picnic' : 'Add One Day Picnic'}</h2>

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
                      <Form.Label>Picnic Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="picnic_code"
                        value={formData.picnic_code}
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
                      <Form.Label>Picnic Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleBasicChange}
                        placeholder="Enter picnic name"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city_name"
                        value={formData.city_name}
                        onChange={handleBasicChange}
                        placeholder="Enter city name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duration (Days & Nights) *</Form.Label>
                      <Form.Control
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleBasicChange}
                        placeholder="e.g., 4N/5D"
                      />
                      <Form.Text className="text-muted">
                        Format: 4N/5D (4 Nights / 5 Days)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tour Price (₹) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleBasicChange}
                        placeholder="Enter price"
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
                                    alt="picnic"
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

              {/* Property Rate Tab */}
              <Tab eventKey="propertyRate" title="Property Rate">
                <Form.Group className="mb-3">
                  <Form.Label>Property Rate Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="property_rate"
                    value={formData.property_rate}
                    onChange={handleBasicChange}
                    placeholder="Enter property rate details..."
                  />
                  <Form.Text className="text-muted">
                    Enter property rates, seasonal pricing, or any other rate-related information
                  </Form.Text>
                </Form.Group>
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

              {/* Places Nearby Tab with Q&A Section */}
              <Tab eventKey="placesNearby" title="Places Nearby">
                <div className="places-nearby-section">
                  <div className="section-header mb-3">
                    <h5>Places Nearby - Questions & Answers</h5>
                  </div>

                  {/* Q&A Section (similar to Exhibition About tab) */}
                  <div className="qa-section mb-4">
                    <div className="qa-header d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Questions & Answers</h6>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={addNewPlacesNearbyQA}
                      >
                        <PlusCircle className="me-1" /> Add New Question
                      </Button>
                    </div>

                    {placesNearbyQA.map((item, index) => (
                      <Card key={item.id} className="qa-item mb-3">
                        <Card.Body>
                          <div className="qa-item-header d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold">Question {index + 1}</span>
                            {placesNearbyQA.length > 1 && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removePlacesNearbyQA(index)}
                              >
                                <XCircle size={16} className="me-1" /> Remove
                              </Button>
                            )}
                          </div>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Question</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="e.g., How far is the nearest beach?"
                              value={item.question}
                              onChange={(e) => handlePlacesNearbyQAChange(e, index)}
                              name="question"
                            />
                          </Form.Group>
                          
                          <Form.Group>
                            <Form.Label>Answer</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="e.g., The nearest beach is Alibaug Beach, located just 2 km away..."
                              value={item.answer}
                              onChange={(e) => handlePlacesNearbyQAChange(e, index)}
                              name="answer"
                            />
                          </Form.Group>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* Amenities Tab */}
              <Tab eventKey="amenities" title="Amenities">
                <div className="amenities-section">
                  <Form.Group className="mb-4">
                    <div className="section-header mb-3">
                      <h5>Amenities & Facilities</h5>
                    </div>
                    <Form.Control
                      as="textarea"
                      rows={12}
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleBasicChange}
                      placeholder={`Enter amenities and facilities available at the picnic spot...
Examples:
• Swimming Pool
• Rain Dance
• Kids Play Area
• Restaurant
• Parking Space
• Changing Rooms
• First Aid
• Security`}
                      style={{ 
                        fontFamily: 'inherit', 
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}
                    />
                  </Form.Group>
                </div>
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
                    placeholder="Enter cancellation policy details..."
                  />
                  <Form.Text className="text-muted">
                    Specify cancellation terms, deadlines, refund percentages, etc.
                  </Form.Text>
                </Form.Group>
              </Tab>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between gap-2 mt-4">
              <div>
                {/* Empty div for spacing */}
              </div>
              
              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  onClick={goBack}
                  disabled={activeTab === 'basic' || loading}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  onClick={isLastTab ? handleSave : goNext}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : isLastTab ? (isEditMode ? 'Update Picnic' : 'Save Picnic') : 'Next'}
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddOneDayPicnic;