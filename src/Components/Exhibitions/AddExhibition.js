// AddExhibition.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const AddExhibition = ({ exhibitionType = 'domestic' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    product_type: '',
    country: '',
    city: '',
    venue: '',
    start_date: '',
    end_date: '',
    organizer: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    image: null
  });

  // Determine configurations based on exhibition type
  const config = {
    domestic: {
      title: 'Domestic Exhibition',
      apiEndpoint: 'domestic-exhibitions',
      backRoute: '/domestic-exhibitions',
      productTypes: [
        "Agriculture", "Air Conditioner", "Building Material", "Bathroom Fittings",
        "Computer / Electro", "Cosmetics", "Furniture", "Gold & Jewellery",
        "Lingerie Products", "Gardening", "Machinery", "Machine Tools",
        "Pharmaceutical", "Paper Products", "Perfumes", "Plastics",
        "Rubber & Steel", "Textile", "Tourism"
      ]
    },
    international: {
      title: 'International Exhibition',
      apiEndpoint: 'international-exhibitions',
      backRoute: '/international-exhibitions',
      countries: ["Dubai", "United Kingdom", "Spain", "Germany", "China", "USA", "France"],
      productTypes: [
        "ATM", "Gulf Food", "Air Conditioners", "Tourism",
        "Hospitality", "Paints", "Toys", "Rubber & Plastic",
        "Pharmaceutical", "Steel", "Building Material", "Electronics"
      ]
    },
    about: {
      title: 'About Exhibition FAQ',
      apiEndpoint: 'exhibition-faqs',
      backRoute: '/about-exhibition'
    }
  };

  const currentConfig = config[exhibitionType];

  // Generate code for new exhibition
  const generateCode = () => {
    const prefix = exhibitionType === 'domestic' ? 'DOME' : 'INTE';
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
    return `${prefix}${randomNum}`;
  };

  // Fetch exhibition data if in edit mode
  const fetchExhibitionData = async () => {
    if (!id) return;
    
    try {
      setFetching(true);
      const response = await fetch(`${baseurl}/api/${currentConfig.apiEndpoint}/${id}`);
      const result = await response.json();

      if (response.ok) {
        setIsEditMode(true);
        setFormData({
          code: result.code || generateCode(),
          title: result.title || '',
          description: result.description || '',
          product_type: result.product_type || '',
          country: result.country || '',
          city: result.city || '',
          venue: result.venue || '',
          start_date: result.start_date || '',
          end_date: result.end_date || '',
          organizer: result.organizer || '',
          contact_email: result.contact_email || '',
          contact_phone: result.contact_phone || '',
          website: result.website || '',
          image: null
        });

        if (result.image_url) {
          setImagePreview(result.image_url);
        }
      } else {
        setError(result.message || 'Failed to fetch exhibition data');
        setTimeout(() => navigate(currentConfig.backRoute), 2000);
      }
    } catch (err) {
      console.error('Error fetching exhibition:', err);
      setError('Error loading exhibition data');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!id) {
      // For new exhibitions, generate a code
      setFormData(prev => ({
        ...prev,
        code: generateCode()
      }));
    } else {
      fetchExhibitionData();
    }
  }, [id, exhibitionType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => navigate(currentConfig.backRoute);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (exhibitionType !== 'about') {
      if (!formData.start_date || !formData.end_date) {
        setError("Start date and end date are required");
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const submitData = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      const url = isEditMode 
        ? `${baseurl}/api/${currentConfig.apiEndpoint}/${id}`
        : `${baseurl}/api/${currentConfig.apiEndpoint}`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: submitData
      });

      const result = await response.json();

      if (response.ok) {
        const message = isEditMode 
          ? `${currentConfig.title} updated successfully!` 
          : `${currentConfig.title} added successfully!`;
        
        setSuccess(message);

        setTimeout(() => {
          navigate(currentConfig.backRoute);
        }, 1500);
      } else {
        setError(result.message || result.error || 
          (isEditMode ? "Failed to update exhibition" : "Failed to add exhibition"));
      }
    } catch (err) {
      console.error("Save exhibition error:", err);
      setError(`Error ${isEditMode ? 'updating' : 'adding'} exhibition. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Render different forms based on exhibition type
  const renderForm = () => {
    if (exhibitionType === 'about') {
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Question *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="question"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="Enter the question..."
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Answer *</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Enter the answer..."
              required
              disabled={loading}
            />
          </Form.Group>
        </>
      );
    }

    return (
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              name="code"
              value={formData.code}
              readOnly
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Exhibition title..."
              required
              disabled={loading}
            />
          </Form.Group>

          {exhibitionType === 'domestic' ? (
            <Form.Group className="mb-3">
              <Form.Label>Product Type *</Form.Label>
              <Form.Select
                name="product_type"
                value={formData.product_type}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Product Type</option>
                {currentConfig.productTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Country *</Form.Label>
                <Form.Select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Country</option>
                  {currentConfig.countries.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Product Type *</Form.Label>
                <Form.Select
                  name="product_type"
                  value={formData.product_type}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Product Type</option>
                  {currentConfig.productTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label>City *</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City name..."
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Venue *</Form.Label>
            <Form.Control
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Venue location..."
              required
              disabled={loading}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Exhibition description..."
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Organizer</Form.Label>
            <Form.Control
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="Organizer name..."
              disabled={loading}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="Phone number..."
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="Email address..."
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          {exhibitionType === 'international' && (
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Website URL..."
                disabled={loading}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Exhibition Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="img-thumbnail" 
                  style={{ maxWidth: '200px' }} 
                />
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>
    );
  };

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">
            {isEditMode ? 'Edit' : 'Add'} {currentConfig.title}
          </h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card>
          <Card.Body>
            {fetching ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Loading {exhibitionType} data...
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                {renderForm()}

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button variant="outline-secondary" onClick={handleBack} disabled={loading}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant={isEditMode ? "warning" : "primary"} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> 
                        {isEditMode ? 'Updating...' : 'Saving...'}
                      </>
                    ) : isEditMode ? 'Update' : 'Save'}
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddExhibition;