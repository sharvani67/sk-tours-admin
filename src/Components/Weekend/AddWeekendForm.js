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

const AddWeekendGateway = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Updated TAB_LIST - removed related tab, added amenities
  const TAB_LIST = ['basic', 'images', 'overview', 'tourCost', 'inclusiveExclusive', 'placesNearby', 'amenities', 'bookingPolicy', 'cancellationPolicy'];

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Basic Details - WITH tour cost fields and amenities
  const [formData, setFormData] = useState({
    gateway_code: '',
    name: '',
    city_name: '',
    duration: '',
    price: '',
    emi_price: '',
    per_pax_twin: '',
    per_pax_triple: '',
    child_with_bed: '',
    child_without_bed: '',
    infant: '',
    per_pax_single: '',
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

  // Weekend Booking Form State
  const [bookingForm, setBookingForm] = useState({
    property_name: '',
    city: '',
    person_name: '',
    cell_no: '',
    email_id: '',
    address: '',
    city_location: '',
    pin_code: '',
    state: '',
    country: 'India',
    no_of_adults: 1,
    no_of_rooms: 1,
    no_of_child: 0
  });

  const [childDetails, setChildDetails] = useState([]);

  // Images
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);

  // Cities List
  const cities = [
    'Alibaug', 'Aamby Valley', 'Goa', 'Igatpuri', 'Karjat', 
    'Khopoli', 'Kashid', 'Lonavala', 'Mahabaleshwar', 'Murbad'
  ];

  useEffect(() => {
    if (isEditMode) {
      loadGatewayData();
    } else {
      getNextGatewayCode();
    }
  }, [id]);

  // Update child boxes when number of children changes
  useEffect(() => {
    const numChild = parseInt(bookingForm.no_of_child) || 0;
    const newChildren = [...childDetails];
    
    // Add rows if needed
    while (newChildren.length < numChild) {
      newChildren.push({ name: '', age: '', cell_no: '', email_id: '' });
    }
    
    // Remove rows if needed
    while (newChildren.length > numChild) {
      newChildren.pop();
    }
    
    setChildDetails(newChildren);
  }, [bookingForm.no_of_child]);

  const getNextGatewayCode = async () => {
    try {
      const response = await fetch(`${baseurl}/api/weekend-gateways/next-gateway-code`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          gateway_code: data.next_gateway_code
        }));
      }
    } catch (err) {
      setError('Failed to generate gateway code');
    }
  };

  const loadGatewayData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseurl}/api/weekend-gateways/${id}`);
      if (!response.ok) throw new Error('Failed to fetch gateway data');
      
      const data = await response.json();
      
      setFormData({
        gateway_code: data.gateway.gateway_code || '',
        name: data.gateway.name || '',
        city_name: data.gateway.city_name || '',
        duration: data.gateway.duration || '',
        price: data.gateway.price || '',
        emi_price: data.gateway.emi_price || '',
        per_pax_twin: data.gateway.per_pax_twin || '',
        per_pax_triple: data.gateway.per_pax_triple || '',
        child_with_bed: data.gateway.child_with_bed || '',
        child_without_bed: data.gateway.child_without_bed || '',
        infant: data.gateway.infant || '',
        per_pax_single: data.gateway.per_pax_single || '',
        overview: data.gateway.overview || '',
        inclusive: data.gateway.inclusive || '',
        exclusive: data.gateway.exclusive || '',
        amenities: data.gateway.amenities || '',
        booking_policy: data.gateway.booking_policy || '',
        cancellation_policy: data.gateway.cancellation_policy || ''
      });

      // Load places nearby Q&A if available
      if (data.gateway.places_nearby_qa && data.gateway.places_nearby_qa.length > 0) {
        setPlacesNearbyQA(data.gateway.places_nearby_qa.map((qa, index) => ({
          id: Date.now() + index,
          question: qa.question,
          answer: qa.answer
        })));
      }

      const imagesWithFullUrl = (data.images || []).map(img => ({
        ...img,
        image_url: img.image_url.startsWith('http') 
          ? img.image_url 
          : `${baseurl}${img.image_url}`
      }));
      setExistingImages(imagesWithFullUrl);
      
    } catch (err) {
      setError('Failed to load gateway data: ' + err.message);
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

  // Weekend Booking Form Handlers
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...childDetails];
    updatedChildren[index][field] = value;
    setChildDetails(updatedChildren);
  };

  const handleWeekendBookingSubmit = async () => {
    // Validate form
    if (!bookingForm.property_name) {
      alert('Property name is required');
      return;
    }
    if (!bookingForm.city) {
      alert('Please select a city');
      return;
    }
    if (!bookingForm.person_name) {
      alert('Please enter person name');
      return;
    }
    if (!bookingForm.cell_no) {
      alert('Please enter cell number');
      return;
    }

    // Validate child details if any
    for (let i = 0; i < childDetails.length; i++) {
      const child = childDetails[i];
      if (!child.name || !child.age) {
        alert(`Please fill name and age for child ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${baseurl}/api/weekend-gateways/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingForm,
          children: childDetails
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setSuccess('Weekend booking submitted successfully!');
      
      // Reset form
      resetWeekendBookingForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit booking');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const resetWeekendBookingForm = () => {
    setBookingForm({
      property_name: '',
      city: '',
      person_name: '',
      cell_no: '',
      email_id: '',
      address: '',
      city_location: '',
      pin_code: '',
      state: '',
      country: 'India',
      no_of_adults: 1,
      no_of_rooms: 1,
      no_of_child: 0
    });
    setChildDetails([]);
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
      const response = await fetch(`${baseurl}/api/weekend-gateways/images/main/${imageId}`, {
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
      const response = await fetch(`${baseurl}/api/weekend-gateways/images/${imageId}`, {
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
      
      await fetch(`${baseurl}/api/weekend-gateways/images/${imageId}`, {
        method: 'DELETE'
      });

      const formData = new FormData();
      formData.append('images', replacementFile);
      
      const uploadResponse = await fetch(`${baseurl}/api/weekend-gateways/upload/${id}`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload new image');
      
      await loadGatewayData();
      setSuccess('Image updated successfully');
      cancelEditImage();
    } catch (err) {
      setError('Failed to update image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (gatewayId) => {
    if (imageFiles.length === 0) return;

    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${baseurl}/api/weekend-gateways/upload/${gatewayId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload images');
  };

  // Save Functions
  const createGateway = async () => {
    if (!formData.name.trim()) {
      setError('Gateway name is required');
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
      
      const gatewayData = {
        ...formData,
        places_nearby_qa: validPlacesNearbyQA
      };
      
      const response = await fetch(`${baseurl}/api/weekend-gateways`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gatewayData)
      });

      if (!response.ok) throw new Error('Failed to create gateway');
      
      const result = await response.json();
      const gatewayId = result.gateway_id;

      if (imageFiles.length > 0) {
        await uploadImages(gatewayId);
      }

      setSuccess('Weekend Gateway created successfully!');
      setTimeout(() => navigate('/weekend-gateways'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create gateway');
    } finally {
      setLoading(false);
    }
  };

  const updateGateway = async () => {
    if (!formData.name.trim()) {
      setError('Gateway name is required');
      setActiveTab('basic');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare Q&A data for places nearby
      const validPlacesNearbyQA = placesNearbyQA.filter(qa => 
        qa.question.trim() !== '' && qa.answer.trim() !== ''
      );
      
      const gatewayData = {
        ...formData,
        places_nearby_qa: validPlacesNearbyQA
      };
      
      const response = await fetch(`${baseurl}/api/weekend-gateways/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gatewayData)
      });

      if (!response.ok) throw new Error('Failed to update gateway');

      if (imageFiles.length > 0) {
        await uploadImages(id);
      }

      setSuccess('Weekend Gateway updated successfully!');
      setTimeout(() => navigate('/weekend-gateways'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update gateway');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (isEditMode) {
      updateGateway();
    } else {
      createGateway();
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

  return (
    <Navbar>
      <Container fluid className="py-4">
        <h2 className="mb-4">{isEditMode ? 'Edit Weekend Gateway' : 'Add Weekend Gateway'}</h2>

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
                      <Form.Label>Gateway Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="gateway_code"
                        value={formData.gateway_code}
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
                      <Form.Label>Gateway Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleBasicChange}
                        placeholder="Enter gateway name"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
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
                  <Col md={4}>
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
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tour Price (₹) *</Form.Label>
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
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>EMI Price (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="emi_price"
                        value={formData.emi_price}
                        onChange={handleBasicChange}
                        placeholder="Enter EMI price (optional)"
                      />
                      <Form.Text className="text-muted">
                        Monthly EMI amount if applicable
                      </Form.Text>
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
                                    alt="gateway"
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

              {/* Tour Cost Tab */}
              <Tab eventKey="tourCost" title="Tour Cost">
                <Card>
                  <Card.Header>Tour Cost Details</Card.Header>
                  <Card.Body>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Particulars - Cost in INR</th>
                          <th>Rate (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Per pax on Twin Basis</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="per_pax_twin"
                              value={formData.per_pax_twin}
                              onChange={handleBasicChange}
                              placeholder="Enter rate"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Per pax on Triple Basis</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="per_pax_triple"
                              value={formData.per_pax_triple}
                              onChange={handleBasicChange}
                              placeholder="Enter rate"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Child with Bed</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="child_with_bed"
                              value={formData.child_with_bed}
                              onChange={handleBasicChange}
                              placeholder="Enter rate"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Child without Bed</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="child_without_bed"
                              value={formData.child_without_bed}
                              onChange={handleBasicChange}
                              placeholder="Enter rate"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Infant</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="infant"
                              value={formData.infant}
                              onChange={handleBasicChange}
                              placeholder="Enter rate"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Per pax Single Occupancy</td>
                          <td>
                            <Form.Control
                              type="number"
                              name="per_pax_single"
                              value={formData.per_pax_single}
                              onChange={handleBasicChange}
                              placeholder="Enter rate"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <Form.Text className="text-muted">
                      Enter the tour cost rates in Indian Rupees (₹)
                    </Form.Text>
                  </Card.Body>
                </Card>
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
                              placeholder="e.g., What are the nearby attractions?"
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
                              placeholder="e.g., The gateway is close to beaches, forts, and local markets..."
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
                      placeholder={`Enter amenities and facilities available at the weekend gateway...
Examples:
• Swimming Pool
• Spa & Wellness Center
• Multi-cuisine Restaurant
• Bar & Lounge
• Kids Play Area
• Free Wi-Fi
• Parking Space
• 24/7 Room Service
• Travel Desk
• Laundry Service`}
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
                  {loading ? 'Saving...' : isLastTab ? (isEditMode ? 'Update Gateway' : 'Save Gateway') : 'Next'}
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddWeekendGateway;