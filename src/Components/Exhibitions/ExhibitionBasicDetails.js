import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import { FaPlus, FaArrowRight, FaTrash } from 'react-icons/fa';

const ExhibitionBasicDetails = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const isEditMode = !!id && id !== 'new';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCitySection, setShowCitySection] = useState(false);
  
  // Basic form data - ONLY category name (NOT exhibition title)
  const [formData, setFormData] = useState({
    id: id || null,
    domestic_category_name: '', // CATEGORY NAME ONLY
    international_category_name: '', // CATEGORY NAME ONLY
    cities: []
  });
  
  // City entries
  const [cityEntries, setCityEntries] = useState([]);
  
  // Load exhibition data for editing
  useEffect(() => {
    if (isEditMode && id) {
      loadExhibitionData();
    }
  }, [id, type]);
  
  const loadExhibitionData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const endpoint = type === 'domestic' 
        ? `${baseurl}/api/exhibitions/domestic/${id}`
        : `${baseurl}/api/exhibitions/international/${id}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch exhibition data');
      
      const data = await response.json();
      
      if (type === 'domestic') {
        // Set ONLY the category name, NOT the title
        setFormData({
          id: data.id,
          domestic_category_name: data.domestic_category_name || ''
        });
        
        if (data.cities && data.cities.length > 0) {
          const entries = data.cities.map(city => ({
            id: city.id,
            stateName: city.state_name || '',
            cityName: city.city_name,
            price: city.price,
            image: null,
            imagePreview: city.image ? `${baseurl}/uploads/exhibition/${city.image}` : '',
            existingImage: city.image || ''
          }));
          setCityEntries(entries);
          setShowCitySection(true);
        }
      } else {
        // Set ONLY the category name, NOT the title
        setFormData({
          id: data.id,
          international_category_name: data.international_category_name || ''
        });
        
        if (data.cities && data.cities.length > 0) {
          const entries = data.cities.map(city => ({
            id: city.id,
            countryName: city.country_name || '',
            cityName: city.city_name,
            price: city.price,
            image: null,
            imagePreview: city.image ? `${baseurl}/uploads/exhibition/${city.image}` : '',
            existingImage: city.image || ''
          }));
          setCityEntries(entries);
          setShowCitySection(true);
        }
      }
      
      setSuccess('Exhibition data loaded successfully');
    } catch (err) {
      console.error('Error loading exhibition data:', err);
      setError('Failed to load exhibition data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // City handlers
  const addCityEntry = () => {
    if (type === 'domestic') {
      setCityEntries([
        ...cityEntries,
        { id: Date.now(), stateName: '', cityName: '', price: '', image: null, imagePreview: '', existingImage: '' }
      ]);
    } else {
      setCityEntries([
        ...cityEntries,
        { id: Date.now(), countryName: '', cityName: '', price: '', image: null, imagePreview: '', existingImage: '' }
      ]);
    }
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
  
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    if (type === 'domestic') {
      setFormData({ ...formData, domestic_category_name: value });
    } else {
      setFormData({ ...formData, international_category_name: value });
    }
  };
  
 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  if (type === 'domestic' && !formData.domestic_category_name.trim()) {
    setError('Please enter category name');
    setLoading(false);
    return;
  }
  
  if (type === 'international' && !formData.international_category_name.trim()) {
    setError('Please enter category name');
    setLoading(false);
    return;
  }
  
  const formDataToSend = new FormData();
  
  if (type === 'domestic') {
    // For domestic: preserve original category name
    let categoryName = formData.domestic_category_name.trim();
    
    if (isEditMode && formData.id) {
      try {
        const checkResponse = await fetch(`${baseurl}/api/exhibitions/domestic/${formData.id}`);
        if (checkResponse.ok) {
          const originalData = await checkResponse.json();
          // Use the original category name from the database
          categoryName = originalData.domestic_category_name;
          console.log(`📌 Preserving domestic category: "${categoryName}"`);
        }
      } catch (err) {
        console.error('Error fetching original category:', err);
      }
    }
    
    formDataToSend.append('domestic_category_name', categoryName);
  } else {
    // For international: preserve original category name
    let categoryName = formData.international_category_name.trim();
    
    if (isEditMode && formData.id) {
      try {
        const checkResponse = await fetch(`${baseurl}/api/exhibitions/international/${formData.id}`);
        if (checkResponse.ok) {
          const originalData = await checkResponse.json();
          // Use the original category name from the database
          categoryName = originalData.international_category_name;
          console.log(`📌 Preserving international category: "${categoryName}"`);
        }
      } catch (err) {
        console.error('Error fetching original category:', err);
      }
    }
    
    formDataToSend.append('international_category_name', categoryName);
  }
  
  // Rest of your city handling code remains the same...
  if (showCitySection && cityEntries.length > 0) {
    const validEntries = cityEntries.filter(entry => 
      entry.cityName.trim() !== '' && entry.price > 0
    );
    
    if (validEntries.length === 0) {
      setError('Please fill in city details or disable cities section');
      setLoading(false);
      return;
    }
    
    if (type === 'domestic') {
      const stateNames = validEntries.map(entry => entry.stateName.trim());
      const cityNames = validEntries.map(entry => entry.cityName.trim());
      const prices = validEntries.map(entry => entry.price);
      const existingImages = validEntries.map(entry => entry.existingImage || '').filter(img => img !== '');
      const existingCityIds = validEntries.map(entry => entry.id).filter(id => typeof id === 'number');
      
      formDataToSend.append('stateNames', JSON.stringify(stateNames));
      formDataToSend.append('cityNames', JSON.stringify(cityNames));
      formDataToSend.append('prices', JSON.stringify(prices));
      formDataToSend.append('existingImages', JSON.stringify(existingImages));
      formDataToSend.append('existingCityIds', JSON.stringify(existingCityIds));
    } else {
      const countryNames = validEntries.map(entry => entry.countryName.trim());
      const cityNames = validEntries.map(entry => entry.cityName.trim());
      const prices = validEntries.map(entry => entry.price);
      const existingImages = validEntries.map(entry => entry.existingImage || '').filter(img => img !== '');
      const existingCityIds = validEntries.map(entry => entry.id).filter(id => typeof id === 'number');
      
      formDataToSend.append('countryNames', JSON.stringify(countryNames));
      formDataToSend.append('cityNames', JSON.stringify(cityNames));
      formDataToSend.append('prices', JSON.stringify(prices));
      formDataToSend.append('existingImages', JSON.stringify(existingImages));
      formDataToSend.append('existingCityIds', JSON.stringify(existingCityIds));
    }
    
    validEntries.forEach(entry => {
      if (entry.image) {
        formDataToSend.append('images', entry.image);
      }
    });
  } else {
    formDataToSend.append('cityNames', JSON.stringify([]));
    formDataToSend.append('prices', JSON.stringify([]));
  }
  
  try {
    let response;
    
    if (isEditMode && formData.id) {
      response = await fetch(`${baseurl}/api/exhibitions/${type}/${formData.id}`, {
        method: 'PUT',
        body: formDataToSend
      });
    } else {
      response = await fetch(`${baseurl}/api/exhibitions/${type}`, {
        method: 'POST',
        body: formDataToSend
      });
    }
    
    const result = await response.json();
    
    if (response.ok) {
      setSuccess(isEditMode ? 'Exhibition updated successfully!' : 'Exhibition added successfully!');
      
      setTimeout(() => {
        const exhibitionId = result.id || formData.id;
        navigate(`/exhibition/details/${exhibitionId}/${type}`);
      }, 1500);
    } else {
      setError(result.error || 'Error processing request');
    }
  } catch (err) {
    console.error('Error submitting form:', err);
    setError('Error submitting form. Please try again.');
  } finally {
    setLoading(false);
  }
};
  
  const handleCancel = () => {
    navigate('/exhibition');
  };
  
  if (loading && isEditMode) {
    return (
      <Navbar>
        <Container className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading exhibition details...</p>
        </Container>
      </Navbar>
    );
  }
  
  return (
    <Navbar>
      <Container>
        <h2 className="mb-4">
          {isEditMode ? 'Edit Exhibition - Basic Details' : 'Add New Exhibition'}
        </h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Form.Label><strong>Exhibition Category Name *</strong></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Agriculture, Pharmaceutical, Furniture, Domestic Plastics"
                  value={type === 'domestic' ? formData.domestic_category_name : formData.international_category_name}
                  onChange={handleCategoryChange}
                  required
                />
                <Form.Text className="text-muted">
                  This is the category/type of exhibition (e.g., "Domestic Plastics", "Pharma", "Furniture")
                </Form.Text>
              </div>
              
              <div className="mb-4">
                <Button 
                  type="button" 
                  variant={showCitySection ? "danger" : "primary"}
                  onClick={() => setShowCitySection(!showCitySection)}
                >
                  {showCitySection ? 'Remove Cities Section' : '+ Add Cities with Details'}
                </Button>
                {showCitySection && (
                  <p className="text-muted small mt-2">
                    {type === 'domestic' 
                      ? 'Add cities with state name, city name, image, and price (optional)'
                      : 'Add cities with country name, city name, image, and price (optional)'}
                  </p>
                )}
              </div>
              
              {showCitySection && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Cities with Images and Prices</h4>
                    <Button type="button" onClick={addCityEntry} variant="outline-success" size="sm">
                      <FaPlus /> Add City
                    </Button>
                  </div>
                  
                  {cityEntries.map((entry, index) => (
                    <Card key={entry.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5>City {index + 1}</h5>
                          {cityEntries.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => removeCityEntry(entry.id)}
                            >
                              <FaTrash /> Remove City
                            </Button>
                          )}
                        </div>
                        
                        <Row>
                          {type === 'domestic' && (
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>State Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter state name"
                                  value={entry.stateName}
                                  onChange={(e) => handleCityChange(entry.id, 'stateName', e.target.value)}
                                  required={showCitySection}
                                />
                              </Form.Group>
                            </Col>
                          )}
                          
                          {type === 'international' && (
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Country Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter country name"
                                  value={entry.countryName}
                                  onChange={(e) => handleCityChange(entry.id, 'countryName', e.target.value)}
                                  required={showCitySection}
                                />
                              </Form.Group>
                            </Col>
                          )}
                          
                          <Col md={type === 'domestic' ? 4 : 4}>
                            <Form.Group className="mb-3">
                              <Form.Label>City Name *</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter city name"
                                value={entry.cityName}
                                onChange={(e) => handleCityChange(entry.id, 'cityName', e.target.value)}
                                required={showCitySection}
                              />
                            </Form.Group>
                          </Col>
                          
                          <Col md={type === 'domestic' ? 4 : 4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Price (₹) *</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={entry.price}
                                onChange={(e) => handleCityChange(entry.id, 'price', e.target.value)}
                                required={showCitySection}
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
                            required={!entry.existingImage && !isEditMode && showCitySection}
                          />
                        </Form.Group>
                        
                        {(entry.imagePreview || entry.existingImage) && (
                          <div className="mt-2">
                            <img 
                              src={entry.imagePreview || `${baseurl}/uploads/exhibition/${entry.existingImage}`}
                              alt={`City ${index + 1}`}
                              style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="d-flex gap-2 mt-4">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Saving...' : (isEditMode ? 'Update & Continue' : 'Save & Continue')}
                  {!loading && <FaArrowRight className="ms-2" />}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default ExhibitionBasicDetails;