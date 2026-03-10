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
import { Pencil, Trash, PlusCircle, XCircle, Tree } from 'react-bootstrap-icons';

const AddOneDayPicnic = () => {
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
    picnic_code: '',
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

  // Related Picnics
  const [relatedPicnics, setRelatedPicnics] = useState([]);
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
  const [allPicnics, setAllPicnics] = useState([]);

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
    loadAllPicnics();
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

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (relatedImagePreview && relatedImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(relatedImagePreview);
      }
    };
  }, [relatedImagePreview]);

  const loadAllPicnics = async () => {
    try {
      const response = await fetch(`${baseurl}/api/one-day-picnic`);
      if (response.ok) {
        const data = await response.json();
        setAllPicnics(data);
      }
    } catch (err) {
      console.error('Failed to load picnics for dropdown:', err);
    }
  };

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
        price: data.picnic.price || '',
        overview: data.picnic.overview || '',
        inclusive: data.picnic.inclusive || '',
        exclusive: data.picnic.exclusive || '',
        places_nearby: data.picnic.places_nearby || '',
        booking_policy: data.picnic.booking_policy || '',
        per_pax_twin: data.picnic.per_pax_twin || '',
        per_pax_triple: data.picnic.per_pax_triple || '',
        child_with_bed: data.picnic.child_with_bed || '',
        child_without_bed: data.picnic.child_without_bed || '',
        infant: data.picnic.infant || '',
        per_pax_single: data.picnic.per_pax_single || ''
      });

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
      
      // Fix related picnic image URLs
      if (data.related_picnics && data.related_picnics.length > 0) {
        console.log('Related picnics from API:', data.related_picnics);
        
        const relatedWithFullUrl = data.related_picnics.map(rel => ({
          ...rel,
          relation_id: rel.relation_id,
          related_name: rel.related_name,
          related_price: rel.related_price,
          related_image: rel.related_image && !rel.related_image.startsWith('blob:')
            ? (rel.related_image.startsWith('http') 
                ? rel.related_image 
                : `${baseurl}${rel.related_image}`)
            : null,
          sort_order: rel.sort_order || 0
        }));
        
        console.log('Processed related picnics:', relatedWithFullUrl);
        setRelatedPicnics(relatedWithFullUrl);
      } else {
        console.log('No related picnics found');
        setRelatedPicnics([]);
      }
      
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

  // Related Picnic Handlers
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

  const handleSelectRelatedPicnic = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    
    const selected = allPicnics.find(p => p.picnic_id === parseInt(selectedId));
    if (selected) {
      setRelatedItem({
        related_name: selected.name,
        related_price: selected.price,
        related_image: selected.main_image || '',
        related_image_file: null,
        sort_order: relatedPicnics.length,
        relation_id: null
      });
      setRelatedImagePreview(selected.main_image 
        ? (selected.main_image.startsWith('http') 
            ? selected.main_image 
            : `${baseurl}${selected.main_image}`)
        : null);
    }
  };

  const uploadRelatedImage = async (picnicId, imageFile) => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${baseurl}/api/one-day-picnic/upload-related/${picnicId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload related image');
    
    const data = await response.json();
    return data.image_url;
  };

  const addRelatedPicnic = () => {
    if (!relatedItem.related_name.trim()) {
      alert('Please enter a picnic name');
      return;
    }
    
    const newRelated = {
      ...relatedItem,
      sort_order: relatedPicnics.length,
      relation_id: null // Ensure new items don't have an ID
    };
    
    setRelatedPicnics(prev => [...prev, newRelated]);
    resetRelatedForm();
    setShowRelatedForm(false);
  };

  const editRelatedPicnic = (idx) => {
    const itemToEdit = relatedPicnics[idx];
    console.log('Editing related picnic:', itemToEdit);
    
    setEditingRelated({ ...itemToEdit, index: idx });
    setRelatedItem({
      related_name: itemToEdit.related_name || '',
      related_price: itemToEdit.related_price || '',
      related_image: itemToEdit.related_image || '',
      related_image_file: null,
      sort_order: itemToEdit.sort_order || 0,
      relation_id: itemToEdit.relation_id || null
    });
    setRelatedImagePreview(itemToEdit.related_image || null);
    setShowRelatedForm(true);
  };

  const updateRelatedPicnic = () => {
    if (!editingRelated) return;
    
    const updated = [...relatedPicnics];
    updated[editingRelated.index] = { 
      ...relatedItem, 
      sort_order: editingRelated.index,
      relation_id: editingRelated.relation_id
    };
    setRelatedPicnics(updated);
    
    resetRelatedForm();
    setShowRelatedForm(false);
  };

  const deleteRelatedPicnic = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this related picnic?');
    if (confirmDelete) {
      setRelatedPicnics(prev => prev.filter((_, i) => i !== idx));
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
  const createPicnic = async () => {
    if (!formData.name.trim()) {
      setError('Picnic name is required');
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
      
      const response = await fetch(`${baseurl}/api/one-day-picnic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create picnic');
      
      const result = await response.json();
      const picnicId = result.picnic_id;

      if (imageFiles.length > 0) {
        await uploadImages(picnicId);
      }

      if (relatedPicnics.length > 0) {
        for (let i = 0; i < relatedPicnics.length; i++) {
          const related = relatedPicnics[i];
          
          let imageUrl = null;
          if (related.related_image_file) {
            imageUrl = await uploadRelatedImage(picnicId, related.related_image_file);
          } else if (related.related_image && !related.related_image.startsWith('blob:')) {
            imageUrl = related.related_image;
          }
          
          await fetch(`${baseurl}/api/one-day-picnic/related/${picnicId}`, {
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
      
      const response = await fetch(`${baseurl}/api/one-day-picnic/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update picnic');

      if (imageFiles.length > 0) {
        await uploadImages(id);
      }

      const relatedResponse = await fetch(`${baseurl}/api/one-day-picnic/related/${id}`);
      const existingRelated = await relatedResponse.json();

      // Delete related picnics that are no longer in the list
      for (const existing of existingRelated) {
        const stillExists = relatedPicnics.some(r => r.relation_id === existing.relation_id);
        if (!stillExists && existing.relation_id) {
          await fetch(`${baseurl}/api/one-day-picnic/related/${existing.relation_id}`, {
            method: 'DELETE'
          });
        }
      }

      // Update or create related picnics
      for (let i = 0; i < relatedPicnics.length; i++) {
        const related = relatedPicnics[i];
        
        let imageUrl = related.related_image;
        if (related.related_image_file) {
          imageUrl = await uploadRelatedImage(id, related.related_image_file);
        } else if (related.related_image && !related.related_image.startsWith('blob:')) {
          // Keep existing image URL
          imageUrl = related.related_image;
        } else {
          imageUrl = null;
        }
        
        if (related.relation_id) {
          // Update existing
          await fetch(`${baseurl}/api/one-day-picnic/related/${related.relation_id}`, {
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
          // Create new
          await fetch(`${baseurl}/api/one-day-picnic/related/${id}`, {
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

      setSuccess('One Day Picnic updated successfully!');
      setTimeout(() => navigate('/one-day-picnic'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update picnic');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (isEditMode) {
      updatePicnic();
    } else {
      createPicnic();
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

              {/* Booking Policy Tab with Booking Form */}
              <Tab eventKey="bookingPolicy" title="Booking Policy">
                <Row>
                  {/* <Col md={6}> */}
                    {/* <Card className="mb-4">
                      <Card.Header as="h5">Booking Form</Card.Header>
                      <Card.Body>
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Name of the City *</Form.Label>
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

                          <Form.Group className="mb-3">
                            <Form.Label>Picnic No</Form.Label>
                            <Form.Control
                              type="text"
                              name="picnic_no"
                              value={bookingForm.picnic_no}
                              readOnly
                              style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Contact Person *</Form.Label>
                            <Form.Control
                              type="text"
                              name="contact_person"
                              value={bookingForm.contact_person}
                              onChange={handleBookingChange}
                              placeholder="Enter contact person name"
                            />
                          </Form.Group>

                          <Row>
                            <Col md={6}>
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
                            <Col md={6}>
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

                          <Row>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Pin Code</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="pin_code"
                                  value={bookingForm.pin_code}
                                  onChange={handleBookingChange}
                                  placeholder="Enter pin code"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="state"
                                  value={bookingForm.state}
                                  onChange={handleBookingChange}
                                  placeholder="Enter state"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="country"
                                  value={bookingForm.country}
                                  onChange={handleBookingChange}
                                  placeholder="Enter country"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label>No of People *</Form.Label>
                            <Form.Control
                              type="number"
                              min="1"
                              max="10"
                              name="no_of_people"
                              value={bookingForm.no_of_people}
                              onChange={handleBookingChange}
                            />
                          </Form.Group>

                          {guestDetails.length > 0 && (
                            <div className="mt-4">
                              <h6>Guest Details</h6>
                              <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th>Name *</th>
                                    <th>Age *</th>
                                    <th>Cell No *</th>
                                    <th>Email ID *</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {guestDetails.map((guest, idx) => (
                                    <tr key={idx}>
                                      <td>
                                        <Form.Control
                                          type="text"
                                          size="sm"
                                          value={guest.name}
                                          onChange={(e) => handleGuestChange(idx, 'name', e.target.value)}
                                          placeholder="Name"
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          size="sm"
                                          value={guest.age}
                                          onChange={(e) => handleGuestChange(idx, 'age', e.target.value)}
                                          placeholder="Age"
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="tel"
                                          size="sm"
                                          value={guest.cell_no}
                                          onChange={(e) => handleGuestChange(idx, 'cell_no', e.target.value)}
                                          placeholder="Cell No"
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="email"
                                          size="sm"
                                          value={guest.email_id}
                                          onChange={(e) => handleGuestChange(idx, 'email_id', e.target.value)}
                                          placeholder="Email"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          )}

                          <div className="d-flex gap-2 justify-content-end mt-3">
                            <Button variant="secondary" size="sm" onClick={resetBookingForm}>
                              Reset
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              onClick={handleBookingSubmit}
                              disabled={loading}
                            >
                              {loading ? 'Submitting...' : 'Submit Booking'}
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card> */}
                  {/* </Col> */}
                  
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
                </Row>
              </Tab>

              {/* Related Picnics Tab */}
              <Tab eventKey="related" title="Related Picnics">
                {!showRelatedForm ? (
                  <div className="mb-3">
                    <Button
                      variant="primary"
                      onClick={() => {
                        resetRelatedForm();
                        setShowRelatedForm(true);
                      }}
                    >
                      <PlusCircle className="me-2" /> Add Related Picnic
                    </Button>
                  </div>
                ) : (
                  <Card className="mb-4">
                    <Card.Header>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">{editingRelated ? 'Edit Related Picnic' : 'Add New Related Picnic'}</h5>
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
                              <Form.Label>Select from existing picnics (optional)</Form.Label>
                              <Form.Select
                                onChange={handleSelectRelatedPicnic}
                                value=""
                              >
                                <option value="">-- Choose a picnic --</option>
                                {allPicnics
                                  .filter(p => isEditMode ? p.picnic_id !== parseInt(id) : true)
                                  .map(p => (
                                    <option key={p.picnic_id} value={p.picnic_id}>
                                      {p.name} - ₹{parseFloat(p.price).toLocaleString('en-IN')}
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
                                placeholder="Enter picnic name"
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
                            onClick={editingRelated ? updateRelatedPicnic : addRelatedPicnic}
                            disabled={!relatedItem.related_name.trim()}
                          >
                            {editingRelated ? 'Update' : 'Add'} Related Picnic
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                )}

                {relatedPicnics.length > 0 ? (
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
                      {relatedPicnics.map((rel, idx) => (
                        <tr key={rel.relation_id || idx}>
                          <td>{idx + 1}</td>
                          <td>{rel.related_name}</td>
                          <td>₹{parseFloat(rel.related_price || 0).toLocaleString('en-IN')}</td>
                          <td>
                            {rel.related_image ? (
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
                                  e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                                }}
                              />
                            ) : (
                              <span className="text-muted">No image</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                size="sm"
                                variant="outline-warning"
                                onClick={() => editRelatedPicnic(idx)}
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => deleteRelatedPicnic(idx)}
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
                    <p className="text-muted text-center py-4">No related picnics added yet</p>
                  )
                )}
              </Tab>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/one-day-picnic')}
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
                {loading ? 'Saving...' : isLastTab ? (isEditMode ? 'Update Picnic' : 'Save Picnic') : 'Next'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddOneDayPicnic;