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

  const TAB_LIST = ['basic', 'images', 'overview', 'tourCost', 'inclusiveExclusive', 'placesNearby', 'bookingPolicy', 'related'];

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Basic Details
  const [formData, setFormData] = useState({
    gateway_code: '',
    name: '',
    price: '',
    overview: '',
    inclusive: '',
    exclusive: '',
    places_nearby: '',
    booking_policy: '',
    per_pax_twin: '',
    per_pax_triple: '',
    child_with_bed: '',
    child_without_bed: '',
    infant: '',
    per_pax_single: ''
  });

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

  // Related Gateways
  const [relatedGateways, setRelatedGateways] = useState([]);
  const [relatedItem, setRelatedItem] = useState({
    related_name: '',
    related_price: '',
    related_image: '',
    related_image_file: null,
    sort_order: 0,
    relation_id: null
  });
  const [relatedImagePreview, setRelatedImagePreview] = useState(null);
  const [editingRelated, setEditingRelated] = useState(null);
  const [showRelatedForm, setShowRelatedForm] = useState(false);
  const [allGateways, setAllGateways] = useState([]);

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
    loadAllGateways();
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

  useEffect(() => {
    return () => {
      if (relatedImagePreview && relatedImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(relatedImagePreview);
      }
    };
  }, [relatedImagePreview]);

  const loadAllGateways = async () => {
    try {
      const response = await fetch(`${baseurl}/api/weekend-gateways`);
      if (response.ok) {
        const data = await response.json();
        setAllGateways(data);
      }
    } catch (err) {
      console.error('Failed to load gateways for dropdown:', err);
    }
  };

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
        price: data.gateway.price || '',
        overview: data.gateway.overview || '',
        inclusive: data.gateway.inclusive || '',
        exclusive: data.gateway.exclusive || '',
        places_nearby: data.gateway.places_nearby || '',
        booking_policy: data.gateway.booking_policy || '',
        per_pax_twin: data.gateway.per_pax_twin || '',
        per_pax_triple: data.gateway.per_pax_triple || '',
        child_with_bed: data.gateway.child_with_bed || '',
        child_without_bed: data.gateway.child_without_bed || '',
        infant: data.gateway.infant || '',
        per_pax_single: data.gateway.per_pax_single || ''
      });

      // Note: Property name is NOT automatically set from gateway name
      // User will enter it manually in the booking form

      const imagesWithFullUrl = (data.images || []).map(img => ({
        ...img,
        image_url: img.image_url.startsWith('http') 
          ? img.image_url 
          : `${baseurl}${img.image_url}`
      }));
      setExistingImages(imagesWithFullUrl);
      
      const relatedWithFullUrl = (data.related_gateways || []).map(rel => ({
        ...rel,
        related_image: rel.related_image && !rel.related_image.startsWith('blob:')
          ? (rel.related_image.startsWith('http') 
              ? rel.related_image 
              : `${baseurl}${rel.related_image}`)
          : null
      }));
      setRelatedGateways(relatedWithFullUrl);
      
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

  // Related Gateway Handlers
  const handleRelatedChange = (e) => {
    const { name, value } = e.target;
    setRelatedItem(prev => ({ ...prev, [name]: value }));
  };

  const handleRelatedImageChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    
    if (relatedImagePreview && relatedImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(relatedImagePreview);
    }
    
    if (file) {
      const preview = URL.createObjectURL(file);
      setRelatedImagePreview(preview);
      setRelatedItem(prev => ({
        ...prev,
        related_image: preview,
        related_image_file: file
      }));
    } else {
      setRelatedImagePreview(null);
      setRelatedItem(prev => ({
        ...prev,
        related_image: '',
        related_image_file: null
      }));
    }
  };

  const handleSelectRelatedGateway = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    
    const selected = allGateways.find(g => g.gateway_id === parseInt(selectedId));
    if (selected) {
      setRelatedItem({
        related_name: selected.name,
        related_price: selected.price,
        related_image: selected.main_image || '',
        related_image_file: null,
        sort_order: relatedGateways.length,
        relation_id: null
      });
      setRelatedImagePreview(selected.main_image 
        ? (selected.main_image.startsWith('http') 
            ? selected.main_image 
            : `${baseurl}${selected.main_image}`)
        : null);
    }
  };

  const uploadRelatedImage = async (gatewayId, imageFile) => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${baseurl}/api/weekend-gateways/upload-related/${gatewayId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload related image');
    
    const data = await response.json();
    return data.image_url;
  };

  const addRelatedGateway = () => {
    if (!relatedItem.related_name.trim()) {
      alert('Please enter a gateway name');
      return;
    }
    
    const newRelated = {
      ...relatedItem,
      sort_order: relatedGateways.length
    };
    
    setRelatedGateways(prev => [...prev, newRelated]);
    resetRelatedForm();
    setShowRelatedForm(false);
  };

  const editRelatedGateway = (idx) => {
    const itemToEdit = relatedGateways[idx];
    setEditingRelated({ ...itemToEdit, index: idx });
    setRelatedItem({
      ...itemToEdit,
      related_image_file: null
    });
    setRelatedImagePreview(itemToEdit.related_image || null);
    setShowRelatedForm(true);
  };

  const updateRelatedGateway = () => {
    if (!editingRelated) return;
    
    const updated = [...relatedGateways];
    updated[editingRelated.index] = { 
      ...relatedItem, 
      sort_order: editingRelated.index,
      relation_id: editingRelated.relation_id
    };
    setRelatedGateways(updated);
    
    resetRelatedForm();
    setShowRelatedForm(false);
  };

  const deleteRelatedGateway = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this related gateway?');
    if (confirmDelete) {
      setRelatedGateways(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const cancelRelatedForm = () => {
    resetRelatedForm();
    setShowRelatedForm(false);
  };

  const resetRelatedForm = () => {
    if (relatedImagePreview && relatedImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(relatedImagePreview);
    }
    
    setEditingRelated(null);
    setRelatedItem({
      related_name: '',
      related_price: '',
      related_image: '',
      related_image_file: null,
      sort_order: 0,
      relation_id: null
    });
    setRelatedImagePreview(null);
  };

  // Save Functions
  const createGateway = async () => {
    if (!formData.name.trim()) {
      setError('Gateway name is required');
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
      
      const response = await fetch(`${baseurl}/api/weekend-gateways`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create gateway');
      
      const result = await response.json();
      const gatewayId = result.gateway_id;

      if (imageFiles.length > 0) {
        await uploadImages(gatewayId);
      }

      if (relatedGateways.length > 0) {
        for (let i = 0; i < relatedGateways.length; i++) {
          const related = relatedGateways[i];
          
          let imageUrl = null;
          if (related.related_image_file) {
            imageUrl = await uploadRelatedImage(gatewayId, related.related_image_file);
          } else if (related.related_image && !related.related_image.startsWith('blob:')) {
            imageUrl = related.related_image;
          }
          
          await fetch(`${baseurl}/api/weekend-gateways/related/${gatewayId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              related_name: related.related_name,
              related_price: related.related_price,
              related_image: imageUrl,
              sort_order: i
            })
          });
        }
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
      
      const response = await fetch(`${baseurl}/api/weekend-gateways/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update gateway');

      if (imageFiles.length > 0) {
        await uploadImages(id);
      }

      const relatedResponse = await fetch(`${baseurl}/api/weekend-gateways/related/${id}`);
      const existingRelated = await relatedResponse.json();

      for (const existing of existingRelated) {
        const stillExists = relatedGateways.some(r => r.relation_id === existing.relation_id);
        if (!stillExists && existing.relation_id) {
          await fetch(`${baseurl}/api/weekend-gateways/related/${existing.relation_id}`, {
            method: 'DELETE'
          });
        }
      }

      for (let i = 0; i < relatedGateways.length; i++) {
        const related = relatedGateways[i];
        
        let imageUrl = related.related_image;
        if (related.related_image_file) {
          imageUrl = await uploadRelatedImage(id, related.related_image_file);
        } else if (related.related_image && !related.related_image.startsWith('blob:')) {
          imageUrl = related.related_image;
        } else {
          imageUrl = null;
        }
        
        if (related.relation_id) {
          await fetch(`${baseurl}/api/weekend-gateways/related/${related.relation_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              related_name: related.related_name,
              related_price: related.related_price,
              related_image: imageUrl,
              sort_order: i
            })
          });
        } else {
          await fetch(`${baseurl}/api/weekend-gateways/related/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              related_name: related.related_name,
              related_price: related.related_price,
              related_image: imageUrl,
              sort_order: i
            })
          });
        }
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
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (₹) *</Form.Label>
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

              {/* Booking Policy Tab with Weekend Booking Form */}
              <Tab eventKey="bookingPolicy" title="Booking Policy">
                <Row>
                    <Col md={6}>
                    <Card className="mb-4">
                      <Card.Header as="h5">Weekend Gateway Booking Form</Card.Header>
                      <Card.Body>
                        <Form>
                          {/* Property Name and City */}
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Name of the Property *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="property_name"
                                  value={bookingForm.property_name}
                                  onChange={handleBookingChange}
                                  placeholder="Enter property name"
                                  style={{ fontWeight: 'bold' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>City *</Form.Label>
                                <Form.Select
                                  name="city"
                                  value={bookingForm.city}
                                  onChange={handleBookingChange}
                                >
                                  <option value="">Select City</option>
                                  {cities.map((city, idx) => (
                                    <option key={idx} value={city}>{city}</option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>

                          {/* Person Name, Cell No, Email */}
                          <Row>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Person Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="person_name"
                                  value={bookingForm.person_name}
                                  onChange={handleBookingChange}
                                  placeholder="Enter person name"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Cell No *</Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="cell_no"
                                  value={bookingForm.cell_no}
                                  onChange={handleBookingChange}
                                  placeholder="Enter cell number"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Email ID</Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email_id"
                                  value={bookingForm.email_id}
                                  onChange={handleBookingChange}
                                  placeholder="Enter email"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          {/* Address */}
                          <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="address"
                              value={bookingForm.address}
                              onChange={handleBookingChange}
                              placeholder="Enter address"
                            />
                          </Form.Group>

                          {/* City, Pin Code, State, Country */}
                          <Row>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="city_location"
                                  value={bookingForm.city_location}
                                  onChange={handleBookingChange}
                                  placeholder="City"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <Form.Label>Pin Code</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="pin_code"
                                  value={bookingForm.pin_code}
                                  onChange={handleBookingChange}
                                  placeholder="Pin code"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="state"
                                  value={bookingForm.state}
                                  onChange={handleBookingChange}
                                  placeholder="State"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="country"
                                  value={bookingForm.country}
                                  onChange={handleBookingChange}
                                  placeholder="Country"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          {/* No of Adults, Rooms, Children */}
                          <Row>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>No of Adults</Form.Label>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  max="20"
                                  name="no_of_adults"
                                  value={bookingForm.no_of_adults}
                                  onChange={handleBookingChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>No of Rooms</Form.Label>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  max="10"
                                  name="no_of_rooms"
                                  value={bookingForm.no_of_rooms}
                                  onChange={handleBookingChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>No of Child</Form.Label>
                                <Form.Control
                                  type="number"
                                  min="0"
                                  max="10"
                                  name="no_of_child"
                                  value={bookingForm.no_of_child}
                                  onChange={handleBookingChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          {/* Child Details Table */}
                          {childDetails.length > 0 && (
                            <div className="mt-4">
                              <h6>Child Details</h6>
                              <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Cell No</th>
                                    <th>Email ID</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {childDetails.map((child, idx) => (
                                    <tr key={idx}>
                                      <td>
                                        <Form.Control
                                          type="text"
                                          size="sm"
                                          value={child.name}
                                          onChange={(e) => handleChildChange(idx, 'name', e.target.value)}
                                          placeholder="Name"
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          size="sm"
                                          value={child.age}
                                          onChange={(e) => handleChildChange(idx, 'age', e.target.value)}
                                          placeholder="Age"
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="tel"
                                          size="sm"
                                          value={child.cell_no}
                                          onChange={(e) => handleChildChange(idx, 'cell_no', e.target.value)}
                                          placeholder="Cell No"
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="email"
                                          size="sm"
                                          value={child.email_id}
                                          onChange={(e) => handleChildChange(idx, 'email_id', e.target.value)}
                                          placeholder="Email"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          )}

                          {/* Form Buttons */}
                          <div className="d-flex gap-2 justify-content-end mt-3">
                            <Button variant="secondary" size="sm" onClick={resetWeekendBookingForm}>
                              Reset
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              onClick={handleWeekendBookingSubmit}
                              disabled={loading}
                            >
                              {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6}>
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
                </Row>
              </Tab>

              {/* Related Gateways Tab */}
              <Tab eventKey="related" title="Related Gateways">
                {!showRelatedForm ? (
                  <div className="mb-3">
                    <Button
                      variant="primary"
                      onClick={() => {
                        resetRelatedForm();
                        setShowRelatedForm(true);
                      }}
                    >
                      <PlusCircle className="me-2" /> Add Related Gateway
                    </Button>
                  </div>
                ) : (
                  <Card className="mb-4">
                    <Card.Header>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">{editingRelated ? 'Edit Related Gateway' : 'Add New Related Gateway'}</h5>
                        <Button variant="outline-secondary" size="sm" onClick={cancelRelatedForm}>
                          <XCircle size={16} /> Cancel
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Select from existing gateways (optional)</Form.Label>
                              <Form.Select
                                onChange={handleSelectRelatedGateway}
                                value=""
                              >
                                <option value="">-- Choose a gateway --</option>
                                {allGateways
                                  .filter(g => isEditMode ? g.gateway_id !== parseInt(id) : true)
                                  .map(g => (
                                    <option key={g.gateway_id} value={g.gateway_id}>
                                      {g.name} - ₹{parseFloat(g.price).toLocaleString('en-IN')}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Text className="text-muted">
                                Or enter custom details below
                              </Form.Text>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Name *</Form.Label>
                              <Form.Control
                                type="text"
                                name="related_name"
                                value={relatedItem.related_name}
                                onChange={handleRelatedChange}
                                placeholder="Enter gateway name"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Price (₹)</Form.Label>
                              <Form.Control
                                type="number"
                                name="related_price"
                                value={relatedItem.related_price}
                                onChange={handleRelatedChange}
                                placeholder="Enter price"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label>Image</Form.Label>
                              <Form.Control
                                type="file"
                                onChange={handleRelatedImageChange}
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                              />
                              {relatedImagePreview && (
                                <div className="mt-3 text-center">
                                  <p className="mb-2">Preview:</p>
                                  <img
                                    src={relatedImagePreview}
                                    alt="preview"
                                    style={{
                                      maxWidth: '200px',
                                      maxHeight: '200px',
                                      objectFit: 'cover',
                                      borderRadius: '8px',
                                      border: '1px solid #ddd'
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
                                    }}
                                  />
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex gap-2 justify-content-end">
                          <Button variant="secondary" onClick={cancelRelatedForm}>
                            Cancel
                          </Button>
                          <Button 
                            variant="primary" 
                            onClick={editingRelated ? updateRelatedGateway : addRelatedGateway}
                            disabled={!relatedItem.related_name.trim()}
                          >
                            {editingRelated ? 'Update' : 'Add'} Related Gateway
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}

                {relatedGateways.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price (₹)</th>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedGateways.map((rel, idx) => (
                        <tr key={rel.relation_id || idx}>
                          <td>{idx + 1}</td>
                          <td>{rel.related_name}</td>
                          <td>₹{parseFloat(rel.related_price).toLocaleString('en-IN')}</td>
                          <td>
                            {rel.related_image && (
                              <img
                                src={rel.related_image}
                                alt={rel.related_name}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  const parent = e.target.parentNode;
                                  if (parent) {
                                    const placeholder = document.createElement('span');
                                    placeholder.className = 'text-muted';
                                    placeholder.innerText = 'No image';
                                    parent.appendChild(placeholder);
                                  }
                                }}
                              />
                            )}
                            {!rel.related_image && (
                              <span className="text-muted">No image</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                size="sm"
                                variant="outline-warning"
                                onClick={() => editRelatedGateway(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => deleteRelatedGateway(idx)}
                                title="Delete"
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  !showRelatedForm && (
                    <p className="text-muted text-center py-4">No related gateways added yet</p>
                  )
                )}
              </Tab>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/weekend-gateways')}
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

              <Button
                variant="primary"
                onClick={isLastTab ? handleSave : goNext}
                disabled={loading}
              >
                {loading ? 'Saving...' : isLastTab ? (isEditMode ? 'Update Gateway' : 'Save Gateway') : 'Next'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddWeekendGateway;