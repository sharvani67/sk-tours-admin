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

const AddBungalow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const TAB_LIST = ['basic', 'images', 'overview', 'inclusiveExclusive', 'placesNearby', 'bookingPolicy', 'related'];

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Basic Details
  const [formData, setFormData] = useState({
    bungalow_code: '',
    name: '',
    price: '',
    overview: '',
    inclusive: '',
    exclusive: '',
    places_nearby: '',
    booking_policy: ''
  });

  // Images
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);

  // Related Bungalows
  const [relatedBungalows, setRelatedBungalows] = useState([]);
  const [relatedItem, setRelatedItem] = useState({
    related_name: '',
    related_price: '',
    related_image: '',
    related_image_file: null,
    sort_order: 0
  });
  const [relatedImagePreview, setRelatedImagePreview] = useState(null);
  const [editingRelated, setEditingRelated] = useState(null);
  const [showRelatedForm, setShowRelatedForm] = useState(false);
  const [allBungalows, setAllBungalows] = useState([]);

  // Load bungalow data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadBungalowData();
    } else {
      getNextBungalowCode();
    }
    loadAllBungalows();
  }, [id]);

  const loadAllBungalows = async () => {
    try {
      const response = await fetch(`${baseurl}/api/bungalows`);
      if (response.ok) {
        const data = await response.json();
        setAllBungalows(data);
      }
    } catch (err) {
      console.error('Failed to load bungalows for dropdown:', err);
    }
  };

  const getNextBungalowCode = async () => {
    try {
      const response = await fetch(`${baseurl}/api/bungalows/next-bungalow-code`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          bungalow_code: data.next_bungalow_code
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
        overview: data.bungalow.overview || '',
        inclusive: data.bungalow.inclusive || '',
        exclusive: data.bungalow.exclusive || '',
        places_nearby: data.bungalow.places_nearby || '',
        booking_policy: data.bungalow.booking_policy || ''
      });

      setExistingImages(data.images || []);
      setRelatedBungalows(data.related_bungalows || []);
      
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

  // Related Bungalow Handlers
  const handleRelatedChange = (e) => {
    const { name, value } = e.target;
    setRelatedItem(prev => ({ ...prev, [name]: value }));
  };

  const handleRelatedImageChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const preview = URL.createObjectURL(file);
      setRelatedImagePreview(preview);
      setRelatedItem(prev => ({
        ...prev,
        related_image: preview,
        related_image_file: file
      }));
    }
  };

  const handleSelectRelatedBungalow = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    
    const selected = allBungalows.find(b => b.bungalow_id === parseInt(selectedId));
    if (selected) {
      setRelatedItem({
        related_name: selected.name,
        related_price: selected.price,
        related_image: selected.main_image || '',
        related_image_file: null,
        sort_order: relatedBungalows.length
      });
      setRelatedImagePreview(selected.main_image || null);
    }
  };

  const uploadRelatedImage = async (bungalowId, imageFile) => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${baseurl}/api/bungalows/upload-related/${bungalowId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload related image');
    
    const data = await response.json();
    return data.image_url;
  };

  const addRelatedBungalow = () => {
    if (!relatedItem.related_name.trim()) {
      alert('Please enter a bungalow name');
      return;
    }
    
    setRelatedBungalows(prev => [...prev, { ...relatedItem, sort_order: prev.length }]);
    resetRelatedForm();
    setShowRelatedForm(false);
  };

  const editRelatedBungalow = (idx) => {
    setEditingRelated({ ...relatedBungalows[idx], index: idx });
    setRelatedItem({
      ...relatedBungalows[idx],
      related_image_file: null
    });
    setRelatedImagePreview(relatedBungalows[idx].related_image);
    setShowRelatedForm(true);
  };

  const updateRelatedBungalow = () => {
    if (!editingRelated) return;
    
    const updated = [...relatedBungalows];
    updated[editingRelated.index] = { ...relatedItem, sort_order: editingRelated.index };
    setRelatedBungalows(updated);
    
    resetRelatedForm();
    setShowRelatedForm(false);
  };

  const deleteRelatedBungalow = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this related bungalow?');
    if (confirmDelete) {
      setRelatedBungalows(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const cancelRelatedForm = () => {
    resetRelatedForm();
    setShowRelatedForm(false);
  };

  const resetRelatedForm = () => {
    setEditingRelated(null);
    setRelatedItem({
      related_name: '',
      related_price: '',
      related_image: '',
      related_image_file: null,
      sort_order: 0
    });
    setRelatedImagePreview(null);
  };

  // Save Functions
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
      
      // Create bungalow
      const response = await fetch(`${baseurl}/api/bungalows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create bungalow');
      
      const result = await response.json();
      const bungalowId = result.bungalow_id;

      // Upload main bungalow images
      if (imageFiles.length > 0) {
        await uploadImages(bungalowId);
      }

      // Save related bungalows
      if (relatedBungalows.length > 0) {
        for (let i = 0; i < relatedBungalows.length; i++) {
          const related = relatedBungalows[i];
          
          // Upload image if exists
          let imageUrl = related.related_image;
          if (related.related_image_file) {
            imageUrl = await uploadRelatedImage(bungalowId, related.related_image_file);
          } else if (related.related_image && !related.related_image.startsWith('blob:')) {
            imageUrl = related.related_image;
          } else {
            imageUrl = null;
          }
          
          // Save related bungalow
          await fetch(`${baseurl}/api/bungalows/related/${bungalowId}`, {
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
      
      // Update bungalow
      const response = await fetch(`${baseurl}/api/bungalows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update bungalow');

      // Upload new images for main bungalow
      if (imageFiles.length > 0) {
        await uploadImages(id);
      }

      // Get existing related bungalows
      const relatedResponse = await fetch(`${baseurl}/api/bungalows/related/${id}`);
      const existingRelated = await relatedResponse.json();

      // Delete removed related bungalows
      for (const existing of existingRelated) {
        const stillExists = relatedBungalows.some(r => r.relation_id === existing.relation_id);
        if (!stillExists && existing.relation_id) {
          await fetch(`${baseurl}/api/bungalows/related/${existing.relation_id}`, {
            method: 'DELETE'
          });
        }
      }

      // Add or update related bungalows
      for (let i = 0; i < relatedBungalows.length; i++) {
        const related = relatedBungalows[i];
        
        // Upload image if exists
        let imageUrl = related.related_image;
        if (related.related_image_file) {
          imageUrl = await uploadRelatedImage(id, related.related_image_file);
        } else if (related.related_image && !related.related_image.startsWith('blob:')) {
          imageUrl = related.related_image;
        } else {
          imageUrl = null;
        }
        
        if (related.relation_id) {
          // Update existing
          await fetch(`${baseurl}/api/bungalows/related/${related.relation_id}`, {
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
          // Add new
          await fetch(`${baseurl}/api/bungalows/related/${id}`, {
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
                                    alt="bungalow"
                                    style={{
                                      width: '100%',
                                      height: '150px',
                                      objectFit: 'cover',
                                      borderRadius: '6px'
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
                <Form.Group className="mb-3">
                  <Form.Label>Booking Policy</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="booking_policy"
                    value={formData.booking_policy}
                    onChange={handleBasicChange}
                    placeholder="Enter booking policy..."
                  />
                </Form.Group>
              </Tab>

              {/* Related Bungalows Tab */}
              <Tab eventKey="related" title="Related Bungalows">
                {!showRelatedForm ? (
                  <div className="mb-3">
                    <Button
                      variant="primary"
                      onClick={() => {
                        resetRelatedForm();
                        setShowRelatedForm(true);
                      }}
                    >
                      <PlusCircle className="me-2" /> Add Related Bungalow
                    </Button>
                  </div>
                ) : (
                  <Card className="mb-4">
                    <Card.Header>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">{editingRelated ? 'Edit Related Bungalow' : 'Add New Related Bungalow'}</h5>
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
                              <Form.Label>Select from existing bungalows (optional)</Form.Label>
                              <Form.Select
                                onChange={handleSelectRelatedBungalow}
                                value=""
                              >
                                <option value="">-- Choose a bungalow --</option>
                                {allBungalows
                                  .filter(b => isEditMode ? b.bungalow_id !== parseInt(id) : true)
                                  .map(b => (
                                    <option key={b.bungalow_id} value={b.bungalow_id}>
                                      {b.name} - ₹{parseFloat(b.price).toLocaleString('en-IN')}
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
                                placeholder="Enter bungalow name"
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
                            onClick={editingRelated ? updateRelatedBungalow : addRelatedBungalow}
                            disabled={!relatedItem.related_name.trim()}
                          >
                            {editingRelated ? 'Update' : 'Add'} Related Bungalow
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}

                {relatedBungalows.length > 0 ? (
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
                      {relatedBungalows.map((rel, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{rel.related_name}</td>
                          <td>₹{parseFloat(rel.related_price).toLocaleString('en-IN')}</td>
                          <td>
                            {rel.related_image && !rel.related_image.startsWith('blob:') && (
                              <img
                                src={rel.related_image}
                                alt={rel.related_name}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                size="sm"
                                variant="outline-warning"
                                onClick={() => editRelatedBungalow(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => deleteRelatedBungalow(idx)}
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
                    <p className="text-muted text-center py-4">No related bungalows added yet</p>
                  )
                )}
              </Tab>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/bungalows')}
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
                {loading ? 'Saving...' : isLastTab ? (isEditMode ? 'Update Bungalow' : 'Save Bungalow') : 'Next'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddBungalow;