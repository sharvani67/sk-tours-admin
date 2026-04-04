// DomesticMiceForm.js
import React from 'react';
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { baseurl } from '../../Api/Baseurl';
import { FaPlus, FaTrash } from 'react-icons/fa';

const DomesticMiceForm = ({ 
  domesticForm, 
  setDomesticForm, 
  loading,
  handleCancel,
  fetchData,
  setShowForm,
  setError,
  setSuccessMessage,
  resetForms,
  cityEntries,
  setCityEntries,
  showCitySection,
  setShowCitySection,
  getImageUrl
}) => {
  
  const MICE_TYPE = 0; // 0 = domestic, 1 = international

  const addCityEntry = () => {
    setCityEntries([
      ...cityEntries,
      { id: Date.now(), stateName: '', cityName: '', price: '', image: null, imagePreview: '', existingImage: '' }
    ]);
    setShowCitySection(true);
  };

  const removeCityEntry = (id) => {
    if (cityEntries.length > 1) {
      setCityEntries(cityEntries.filter(entry => entry.id !== id));
    } else {
      setCityEntries([]);
      setShowCitySection(false);
    }
  };

  const handleCityChange = (id, field, value) => {
    setCityEntries(cityEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleCityImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCityEntries(cityEntries.map(entry => 
          entry.id === id ? { 
            ...entry, 
            image: file, 
            imagePreview: reader.result,
            existingImage: ''
          } : entry
        ));
      };
      reader.readAsDataURL(file);
    }
  };

// In DomesticMiceForm.js - fix the handleSubmit function

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccessMessage('');

  if (cityEntries.length === 0) {
    setError('Please add at least one city');
    return;
  }

  const validEntries = cityEntries.filter(entry => 
    entry.cityName.trim() !== '' && entry.price > 0
  );

  if (validEntries.length === 0) {
    setError('Please fill in city details');
    return;
  }

  const formData = new FormData();
  
  const stateNames = validEntries.map(entry => entry.stateName.trim());
  const cityNames = validEntries.map(entry => entry.cityName.trim());
  const prices = validEntries.map(entry => entry.price);
  const existingImages = validEntries.map(entry => entry.existingImage || '').filter(img => img !== '');
  const existingCityIds = validEntries.map(entry => entry.id).filter(id => typeof id === 'number');
  
  formData.append('stateNames', JSON.stringify(stateNames));
  formData.append('cityNames', JSON.stringify(cityNames));
  formData.append('prices', JSON.stringify(prices));
  formData.append('existingImages', JSON.stringify(existingImages));
  formData.append('existingCityIds', JSON.stringify(existingCityIds));
  formData.append('mice_type', MICE_TYPE);
  
  validEntries.forEach(entry => {
    if (entry.image) {
      formData.append('images', entry.image);
    }
  });

  try {
    let response;
    let savedId = domesticForm.id;
    
    if (domesticForm.id) {
      // Update existing
      response = await fetch(`${baseurl}/api/mice/domestic/${domesticForm.id}`, {
        method: 'PUT',
        body: formData
      });
      savedId = domesticForm.id;
    } else {
      // Create new
      response = await fetch(`${baseurl}/api/mice/domestic`, {
        method: 'POST',
        body: formData
      });
    }

    // FIX: Read the response body only ONCE
    const result = await response.json();

    if (response.ok) {
      // For create operations, get the saved ID from the response
      if (!domesticForm.id && result.id) {
        savedId = result.id;
      }
      
      setSuccessMessage(domesticForm.id ? 'Domestic Mice updated successfully!' : 'Domestic Mice added successfully!');
      await fetchData();
      resetForms();
      setShowForm(false);
      
      // After saving, navigate to the full details page to edit other sections
      if (savedId) {
        setTimeout(() => {
          window.location.href = `/mice/domestic-details/${savedId}`;
        }, 1500);
      }
    } else {
      setError(result.error || 'Error processing request');
    }
  } catch (err) {
    console.error('Error submitting domestic form:', err);
    setError('Error submitting form. Please try again.');
  }
};

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="badge bg-success px-3 py-2" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
          🇮🇳 DOMESTIC
        </span>
        <h2 className="mb-0">{domesticForm.id ? 'Edit Domestic Mice' : 'Add Domestic Mice'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="cities-section mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Cities with State Name, Image and Price</h4>
            <Button type="button" onClick={addCityEntry} variant="outline-success" size="sm">
              <FaPlus /> Add City
            </Button>
          </div>

          {cityEntries.map((entry, index) => (
            <Card key={entry.id} className="mb-3 border-success">
              <Card.Header className="bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">City {index + 1}</h5>
                {cityEntries.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeCityEntry(entry.id)}
                  >
                    <FaTrash /> Remove
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter state name"
                        value={entry.stateName}
                        onChange={(e) => handleCityChange(entry.id, 'stateName', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City Name *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter city name"
                        value={entry.cityName}
                        onChange={(e) => handleCityChange(entry.id, 'cityName', e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (₹) *</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter price"
                        value={entry.price}
                        onChange={(e) => handleCityChange(entry.id, 'price', e.target.value)}
                        required
                        min="0"
                        step="0.01"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Image {!entry.existingImage && '*'}</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCityImageChange(entry.id, e)}
                    required={!entry.existingImage && !domesticForm.id}
                  />
                </Form.Group>
                
                {(entry.imagePreview || entry.existingImage) && (
                  <div className="mt-2">
                    <img 
                      src={entry.imagePreview || `${baseurl}/uploads/mice/domestic/${entry.existingImage}`}
                      alt={`City ${index + 1}`}
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="d-flex gap-2 mt-4">
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? <Spinner size="sm" /> : (domesticForm.id ? 'Update Domestic' : 'Save Domestic')}
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default DomesticMiceForm;