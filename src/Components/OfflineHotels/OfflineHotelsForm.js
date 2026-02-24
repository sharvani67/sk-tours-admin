import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button, InputGroup, Alert, Spinner, Tab, Nav } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import axios from 'axios';
import { baseurl } from '../../Api/Baseurl';
import { useNavigate, useParams } from 'react-router-dom';

// Country data for dropdown
const countries = [
  { id: 1, name: 'India', code: 'IN' },
  { id: 2, name: 'United Arab Emirates', code: 'AE' },
  { id: 3, name: 'Thailand', code: 'TH' },
  { id: 4, name: 'Singapore', code: 'SG' },
  { id: 5, name: 'Malaysia', code: 'MY' },
  { id: 6, name: 'Indonesia', code: 'ID' },
  { id: 7, name: 'Sri Lanka', code: 'LK' },
  { id: 8, name: 'Maldives', code: 'MV' },
  { id: 9, name: 'Nepal', code: 'NP' },
  { id: 10, name: 'Bhutan', code: 'BT' },
  { id: 11, name: 'Bangladesh', code: 'BD' },
  { id: 12, name: 'Myanmar', code: 'MM' },
  { id: 13, name: 'Vietnam', code: 'VN' },
  { id: 14, name: 'Cambodia', code: 'KH' },
  { id: 15, name: 'Laos', code: 'LA' },
  { id: 16, name: 'Philippines', code: 'PH' },
  { id: 17, name: 'China', code: 'CN' },
  { id: 18, name: 'Japan', code: 'JP' },
  { id: 19, name: 'South Korea', code: 'KR' },
  { id: 20, name: 'Turkey', code: 'TR' },
  { id: 21, name: 'Egypt', code: 'EG' },
  { id: 22, name: 'South Africa', code: 'ZA' },
  { id: 23, name: 'Kenya', code: 'KE' },
  { id: 24, name: 'Mauritius', code: 'MU' },
  { id: 25, name: 'Seychelles', code: 'SC' },
  { id: 26, name: 'United Kingdom', code: 'GB' },
  { id: 27, name: 'France', code: 'FR' },
  { id: 28, name: 'Italy', code: 'IT' },
  { id: 29, name: 'Spain', code: 'ES' },
  { id: 30, name: 'Switzerland', code: 'CH' },
  { id: 31, name: 'Germany', code: 'DE' },
  { id: 32, name: 'Netherlands', code: 'NL' },
  { id: 33, name: 'Greece', code: 'GR' },
  { id: 34, name: 'Portugal', code: 'PT' },
  { id: 35, name: 'Austria', code: 'AT' },
  { id: 36, name: 'United States', code: 'US' },
  { id: 37, name: 'Canada', code: 'CA' },
  { id: 38, name: 'Mexico', code: 'MX' },
  { id: 39, name: 'Brazil', code: 'BR' },
  { id: 40, name: 'Argentina', code: 'AR' },
  { id: 41, name: 'Australia', code: 'AU' },
  { id: 42, name: 'New Zealand', code: 'NZ' },
  { id: 43, name: 'Fiji', code: 'FJ' },
  { id: 44, name: 'Russia', code: 'RU' }
];

function OfflineHotels() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if editing
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Image upload states
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Hotel Search Details (Based on images 1-4)
  const [searchDetails, setSearchDetails] = useState({
    country: '',
    city: '',
    location: '',
    propertyName: '',
    checkInDate: '',
    checkOutDate: '',
    rooms: 1,
    adults: 2,
    children: 0,
    pets: false
  });

  // Children ages state
  const [childrenAges, setChildrenAges] = useState([]);

  // Hotel Details (Based on image 5)
  const [hotelDetails, setHotelDetails] = useState({
    hotelName: '',
    location: '',
    starRating: 3,
    mainImage: '',
    additionalImages: [],
    rating: 0,
    totalRatings: 0,
    price: '',
    taxes: '',
    amenities: '',
    status: 'Available',
    freeStayForKids: false,
    limitedTimeSale: false,
    salePrice: '',
    originalPrice: '',
    loginToBook: false,
    payLater: false
  });

  // Description Content (Based on image 6)
  const [descriptions, setDescriptions] = useState({
    overview: '',
    hotelFacilities: '',
    airportTransfers: '',
    mealPlan: '',
    taxesDescription: ''
  });

  // Filters (Based on images 7-8)
  const [filters, setFilters] = useState({
    searchLocality: '',
    priceRanges: [
      { id: 1, range: '₹0 - ₹2500', min: 0, max: 2500, count: 509, selected: false },
      { id: 2, range: '₹2500 - ₹4500', min: 2500, max: 4500, count: 781, selected: false },
      { id: 3, range: '₹4500 - ₹7500', min: 4500, max: 7500, count: 418, selected: false },
      { id: 4, range: '₹7500 - ₹10000', min: 7500, max: 10000, count: 169, selected: false },
      { id: 5, range: '₹10000 - ₹15000', min: 10000, max: 15000, count: 299, selected: false },
      { id: 6, range: '₹15000 - ₹30000', min: 15000, max: 30000, count: 342, selected: false },
      { id: 7, range: '₹30000+', min: 30000, max: null, count: 163, selected: false }
    ],
    budget: {
      min: '',
      max: ''
    },
    starCategories: [
      { id: 1, stars: 3, count: 676, selected: false },
      { id: 2, stars: 4, count: 368, selected: false },
      { id: 3, stars: 5, count: 206, selected: false }
    ]
  });

  // Fetch hotel data if editing
  useEffect(() => {
    if (id) {
      fetchHotelData(id);
    }
  }, [id]);

  const fetchHotelData = async (hotelId) => {
    setFetchLoading(true);
    setError('');

    try {
      const response = await axios.get(`${baseurl}/api/offline-hotels/${hotelId}`);
      
      if (response.data.success) {
        const hotelData = response.data.data;
        
        // Set search details
        setSearchDetails({
          country: hotelData.country || '',
          city: hotelData.city || '',
          location: hotelData.location || '',
          propertyName: hotelData.property_name || '',
          checkInDate: hotelData.check_in_date ? hotelData.check_in_date.split('T')[0] : '',
          checkOutDate: hotelData.check_out_date ? hotelData.check_out_date.split('T')[0] : '',
          rooms: hotelData.rooms || 1,
          adults: hotelData.adults || 2,
          children: hotelData.children || 0,
          pets: hotelData.pets === 1 || hotelData.pets === true
        });

        // Set children ages
        if (hotelData.children_ages && hotelData.children_ages.length > 0) {
          setChildrenAges(hotelData.children_ages);
        }

        // Set hotel details
        setHotelDetails({
          hotelName: hotelData.hotel_name || '',
          location: hotelData.hotel_location || '',
          starRating: hotelData.star_rating || 3,
          mainImage: hotelData.main_image || '',
          additionalImages: hotelData.additional_images || [],
          rating: hotelData.rating || 0,
          totalRatings: hotelData.total_ratings || 0,
          price: hotelData.price || '',
          taxes: hotelData.taxes || '',
          amenities: hotelData.amenities || '',
          status: hotelData.status || 'Available',
          freeStayForKids: hotelData.free_stay_for_kids === 1 || hotelData.free_stay_for_kids === true,
          limitedTimeSale: hotelData.limited_time_sale === 1 || hotelData.limited_time_sale === true,
          salePrice: hotelData.sale_price || '',
          originalPrice: hotelData.original_price || '',
          loginToBook: hotelData.login_to_book === 1 || hotelData.login_to_book === true,
          payLater: hotelData.pay_later === 1 || hotelData.pay_later === true
        });

        // Set descriptions
        setDescriptions({
          overview: hotelData.overview_description || '',
          hotelFacilities: hotelData.hotel_facilities_description || '',
          airportTransfers: hotelData.airport_transfers_description || '',
          mealPlan: hotelData.meal_plan_description || '',
          taxesDescription: hotelData.taxes_description || ''
        });

       // Set main image preview if exists
if (hotelData.main_image) {
  // Remove any duplicate baseurl if the image path already starts with /uploads
  const imageUrl = hotelData.main_image.startsWith('http') 
    ? hotelData.main_image 
    : `${baseurl}${hotelData.main_image}`;
  setMainImagePreview(imageUrl);
}

// Set additional images
if (hotelData.additional_images && hotelData.additional_images.length > 0) {
  const imageUrls = hotelData.additional_images.map(img => {
    return img.startsWith('http') ? img : `${baseurl}${img}`;
  });
  setAdditionalImagePreviews(imageUrls);
  setExistingImages(hotelData.additional_images);
}

        // Set filters if available
        if (hotelData.filters) {
          const { priceRanges, starCategories, budget, searchLocalities } = hotelData.filters;

          // Update price ranges selection
          if (priceRanges && priceRanges.length > 0) {
            setFilters(prev => ({
              ...prev,
              priceRanges: prev.priceRanges.map((range, index) => ({
                ...range,
                selected: priceRanges[index]?.is_selected === 1
              }))
            }));
          }

          // Update star categories selection
          if (starCategories && starCategories.length > 0) {
            setFilters(prev => ({
              ...prev,
              starCategories: prev.starCategories.map((star, index) => ({
                ...star,
                selected: starCategories[index]?.is_selected === 1
              }))
            }));
          }

          // Update budget
          if (budget) {
            setFilters(prev => ({
              ...prev,
              budget: {
                min: budget.min_budget || '',
                max: budget.max_budget || ''
              }
            }));
          }

          // Update search locality
          if (searchLocalities && searchLocalities.length > 0) {
            setFilters(prev => ({
              ...prev,
              searchLocality: searchLocalities[0]?.locality_name || ''
            }));
          }
        }
      }
    } catch (err) {
      console.error('Error fetching hotel data:', err);
      setError(err.response?.data?.message || 'Failed to fetch hotel data');
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle search details change
  const handleSearchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle children count and ages
  const handleChildrenChange = (operation) => {
    setSearchDetails(prev => {
      let newCount = prev.children;
      
      if (operation === 'increase') {
        newCount = prev.children + 1;
      } else if (operation === 'decrease' && prev.children > 0) {
        newCount = prev.children - 1;
      }

      // Update children ages array
      if (newCount > childrenAges.length) {
        setChildrenAges([...childrenAges, 5]); // Default age 5
      } else if (newCount < childrenAges.length) {
        setChildrenAges(childrenAges.slice(0, newCount));
      }

      return { ...prev, children: newCount };
    });
  };

  const handleChildAgeChange = (index, age) => {
    const newAges = [...childrenAges];
    newAges[index] = parseInt(age);
    setChildrenAges(newAges);
  };

  // Handle hotel details change
  const handleHotelDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle main image upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, JPG, PNG, GIF, and WEBP images are allowed');
        return;
      }

      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear the URL field when file is uploaded
      setHotelDetails(prev => ({ ...prev, mainImage: '' }));
    }
  };

  // Handle additional images upload
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const validPreviews = [];

    for (const file of files) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image should be less than 5MB');
        continue;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, JPG, PNG, GIF, and WEBP images are allowed');
        continue;
      }

      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        validPreviews.push(reader.result);
        if (validPreviews.length === validFiles.length) {
          setAdditionalImagePreviews([...additionalImagePreviews, ...validPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setAdditionalImageFiles([...additionalImageFiles, ...validFiles]);
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    const newFiles = [...additionalImageFiles];
    const newPreviews = [...additionalImagePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setAdditionalImageFiles(newFiles);
    setAdditionalImagePreviews(newPreviews);
  };

  // Handle descriptions change
  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setDescriptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle filters change
  const handleFilterChange = (category, index, field, value) => {
    if (category === 'priceRanges') {
      setFilters(prev => ({
        ...prev,
        priceRanges: prev.priceRanges.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else if (category === 'starCategories') {
      setFilters(prev => ({
        ...prev,
        starCategories: prev.starCategories.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    }
  };

  // Handle budget change
  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      budget: { ...prev.budget, [name]: value }
    }));
  };

  // Validation function
  const validateForm = () => {
    if (!searchDetails.country) {
      setError('Please select a country');
      return false;
    }
    if (!searchDetails.city) {
      setError('Please enter city');
      return false;
    }
    if (!searchDetails.checkInDate) {
      setError('Please select check-in date');
      return false;
    }
    if (!searchDetails.checkOutDate) {
      setError('Please select check-out date');
      return false;
    }
    if (!hotelDetails.hotelName) {
      setError('Please enter hotel name');
      return false;
    }
    if (!hotelDetails.price) {
      setError('Please enter price');
      return false;
    }
    return true;
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Submit handler with FormData for file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append all data as JSON strings
      formData.append('searchDetails', JSON.stringify(searchDetails));
      formData.append('childrenAges', JSON.stringify(childrenAges));
      
      // Update hotelDetails with existing images
      const updatedHotelDetails = {
        ...hotelDetails,
        additionalImages: existingImages
      };
      formData.append('hotelDetails', JSON.stringify(updatedHotelDetails));
      
      formData.append('descriptions', JSON.stringify(descriptions));
      formData.append('filters', JSON.stringify(filters));
      
      // Append main image file if exists
      if (mainImageFile) {
        formData.append('mainImage', mainImageFile);
      }
      
      // Append additional image files
      if (additionalImageFiles.length > 0) {
        additionalImageFiles.forEach((file) => {
          formData.append('additionalImages', file);
        });
      }

      let response;
      if (id) {
        // Update existing hotel
        response = await axios.put(`${baseurl}/api/offline-hotels/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new hotel
        response = await axios.post(`${baseurl}/api/offline-hotels`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        setSuccess(id ? 'Hotel updated successfully!' : 'Hotel saved successfully!');
        setTimeout(() => {
          navigate('/offline-hotels-table');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting hotel:', error);
      if (error.response) {
        setError(error.response.data.message || `Failed to ${id ? 'update' : 'save'} hotel`);
      } else if (error.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError(`Error ${id ? 'updating' : 'submitting'} form. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSearchDetails({
      country: '',
      city: '',
      location: '',
      propertyName: '',
      checkInDate: '',
      checkOutDate: '',
      rooms: 1,
      adults: 2,
      children: 0,
      pets: false
    });
    setChildrenAges([]);
    setHotelDetails({
      hotelName: '',
      location: '',
      starRating: 3,
      mainImage: '',
      additionalImages: [],
      rating: 0,
      totalRatings: 0,
      price: '',
      taxes: '',
      amenities: '',
      status: 'Available',
      freeStayForKids: false,
      limitedTimeSale: false,
      salePrice: '',
      originalPrice: '',
      loginToBook: false,
      payLater: false
    });
    setDescriptions({
      overview: '',
      hotelFacilities: '',
      airportTransfers: '',
      mealPlan: '',
      taxesDescription: ''
    });
    setFilters({
      searchLocality: '',
      priceRanges: filters.priceRanges.map(p => ({ ...p, selected: false })),
      budget: { min: '', max: '' },
      starCategories: filters.starCategories.map(s => ({ ...s, selected: false }))
    });
    setMainImageFile(null);
    setMainImagePreview(null);
    setAdditionalImageFiles([]);
    setAdditionalImagePreviews([]);
    setExistingImages([]);
    setSuccess('');
  };

  if (fetchLoading) {
    return (
      <Navbar>
        <Container fluid className="py-4 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading hotel data...</p>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <Container fluid className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{id ? 'Edit Offline Hotel' : 'Add Offline Hotel'}</h2>
        </div>

        {/* Alert Messages */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Hotel Search Section - Based on images 1-4 */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Hotel Search Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="country"
                      value={searchDetails.country}
                      onChange={handleSearchChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>City <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="e.g., Goa, Mumbai, Delhi"
                      value={searchDetails.city}
                      onChange={handleSearchChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Property Name / Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="propertyName"
                      placeholder="e.g., Beachfront stays Goa"
                      value={searchDetails.propertyName}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Check-In Date <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="date"
                      name="checkInDate"
                      value={searchDetails.checkInDate}
                      onChange={handleSearchChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Check-Out Date <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="date"
                      name="checkOutDate"
                      value={searchDetails.checkOutDate}
                      onChange={handleSearchChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Rooms</Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchDetails(prev => ({ ...prev, rooms: Math.max(1, prev.rooms - 1) }))}
                        disabled={searchDetails.rooms <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={searchDetails.rooms}
                        readOnly
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchDetails(prev => ({ ...prev, rooms: prev.rooms + 1 }))}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Adults</Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchDetails(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                        disabled={searchDetails.adults <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={searchDetails.adults}
                        readOnly
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchDetails(prev => ({ ...prev, adults: prev.adults + 1 }))}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Children (0-17)</Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleChildrenChange('decrease')}
                        disabled={searchDetails.children <= 0}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={searchDetails.children}
                        readOnly
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleChildrenChange('increase')}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Pets</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Travelling with pets?"
                      name="pets"
                      checked={searchDetails.pets}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Children Ages - Shown when children > 0 */}
              {searchDetails.children > 0 && (
                <Row className="mt-3">
                  <Col md={12}>
                    <Card bg="light" className="p-3">
                      <h6>Children Ages</h6>
                      <Row>
                        {childrenAges.map((age, index) => (
                          <Col md={3} key={index} className="mb-2">
                            <Form.Group>
                              <Form.Label>Child {index + 1} Age</Form.Label>
                              <Form.Select
                                value={age}
                                onChange={(e) => handleChildAgeChange(index, e.target.value)}
                              >
                                {[...Array(18).keys()].map(age => (
                                  <option key={age} value={age}>{age} years</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Hotel Details Section - Based on image 5 */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Hotel Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Hotel Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="hotelName"
                      placeholder="e.g., Estrela Do Mar Beach Resort"
                      value={hotelDetails.hotelName}
                      onChange={handleHotelDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      placeholder="e.g., North Goa | About a minute walk to Calangute Beach"
                      value={hotelDetails.location}
                      onChange={handleHotelDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Star Rating</Form.Label>
                    <Form.Select
                      name="starRating"
                      value={hotelDetails.starRating}
                      onChange={handleHotelDetailChange}
                    >
                      <option value={3}>3 Star</option>
                      <option value={4}>4 Star</option>
                      <option value={5}>5 Star</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Rating (0-5)</Form.Label>
                    <Form.Control
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={hotelDetails.rating}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Total Ratings</Form.Label>
                    <Form.Control
                      type="number"
                      name="totalRatings"
                      placeholder="e.g., 8205"
                      value={hotelDetails.totalRatings}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={hotelDetails.status}
                      onChange={handleHotelDetailChange}
                    >
                      <option value="Available">Available</option>
                      <option value="Limited Availability">Limited Availability</option>
                      <option value="Booked">Booked</option>
                      <option value="Under Renovation">Under Renovation</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Main Image Upload</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                    />
                    {mainImagePreview && (
                      <div className="mt-2 position-relative">
                        <img 
                          src={mainImagePreview} 
                          alt="Preview" 
                          style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }} 
                          className="border rounded"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 start-0"
                          onClick={() => {
                            setMainImageFile(null);
                            setMainImagePreview(null);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      Max 5MB. JPEG, JPG, PNG, GIF, WEBP only.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Or Main Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="mainImage"
                      placeholder="https://example.com/image.jpg"
                      value={hotelDetails.mainImage}
                      onChange={handleHotelDetailChange}
                      disabled={!!mainImageFile}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Additional Images</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                    />
                    {additionalImagePreviews.length > 0 && (
                      <Row className="mt-3">
                        {additionalImagePreviews.map((preview, index) => (
                          <Col md={3} key={index} className="mb-2">
                            <div className="position-relative">
                              <img 
                                src={preview} 
                                alt={`Additional ${index + 1}`} 
                                style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                                className="border rounded"
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0"
                                onClick={() => removeAdditionalImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    )}
                    <Form.Text className="text-muted">
                      You can select multiple images. Max 5MB each.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Amenities</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="amenities"
                      placeholder="e.g., Near Calangute Beach, swimming pool and jacuzzi, live music during meals"
                      value={hotelDetails.amenities}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Price (₹) <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="price"
                      placeholder="10,518"
                      value={hotelDetails.price}
                      onChange={handleHotelDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Taxes & Fees (₹)</Form.Label>
                    <Form.Control
                      type="text"
                      name="taxes"
                      placeholder="1,205"
                      value={hotelDetails.taxes}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Original Price (₹)</Form.Label>
                    <Form.Control
                      type="text"
                      name="originalPrice"
                      placeholder="17,099"
                      value={hotelDetails.originalPrice}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Sale Price (₹)</Form.Label>
                    <Form.Control
                      type="text"
                      name="salePrice"
                      placeholder="10,518"
                      value={hotelDetails.salePrice}
                      onChange={handleHotelDetailChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Free Stay for Kids"
                    name="freeStayForKids"
                    checked={hotelDetails.freeStayForKids}
                    onChange={handleHotelDetailChange}
                  />
                </Col>
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Limited Time Sale"
                    name="limitedTimeSale"
                    checked={hotelDetails.limitedTimeSale}
                    onChange={handleHotelDetailChange}
                  />
                </Col>
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Login to Book"
                    name="loginToBook"
                    checked={hotelDetails.loginToBook}
                    onChange={handleHotelDetailChange}
                  />
                </Col>
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Pay Later Option"
                    name="payLater"
                    checked={hotelDetails.payLater}
                    onChange={handleHotelDetailChange}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Description Tabs Section - Based on image 6 */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Hotel Descriptions</h5>
            </Card.Header>
            <Card.Body>
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="overview">Overview</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="facilities">Hotel Facilities</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="transfers">Airport Transfers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="meal">Meal Plan</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="taxes">Taxes</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="overview">
                    <Form.Group>
                      <Form.Label>Overview Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="overview"
                        placeholder="Enter hotel overview, highlights, and key information..."
                        value={descriptions.overview}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>

                  <Tab.Pane eventKey="facilities">
                    <Form.Group>
                      <Form.Label>Hotel Facilities</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="hotelFacilities"
                        placeholder="List all hotel facilities: swimming pool, spa, gym, restaurant, wifi, parking, etc..."
                        value={descriptions.hotelFacilities}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>

                  <Tab.Pane eventKey="transfers">
                    <Form.Group>
                      <Form.Label>Airport Transfers</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="airportTransfers"
                        placeholder="Describe airport transfer options, costs, pickup points, etc..."
                        value={descriptions.airportTransfers}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>

                  <Tab.Pane eventKey="meal">
                    <Form.Group>
                      <Form.Label>Meal Plan</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="mealPlan"
                        placeholder="Describe meal plans available: Bed & Breakfast, Half Board, Full Board, All Inclusive, etc..."
                        value={descriptions.mealPlan}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>

                  <Tab.Pane eventKey="taxes">
                    <Form.Group>
                      <Form.Label>Taxes Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="taxesDescription"
                        placeholder="Describe tax details: GST, service charges, city tax, resort fees, etc..."
                        value={descriptions.taxesDescription}
                        onChange={handleDescriptionChange}
                      />
                    </Form.Group>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>

          {/* Filters Section - Based on images 7-8 */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Hotel Filters</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6 className="mb-3">Search Locality / Hotel Name</h6>
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Enter locality or hotel"
                      value={filters.searchLocality}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchLocality: e.target.value }))}
                    />
                  </Form.Group>

                  <h6 className="mb-3">Price Per Night</h6>
                  {filters.priceRanges.map((range, index) => (
                    <Form.Group key={range.id} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={`${range.range} (${range.count})`}
                        checked={range.selected}
                        onChange={(e) => handleFilterChange('priceRanges', index, 'selected', e.target.checked)}
                      />
                    </Form.Group>
                  ))}
                </Col>

                <Col md={6}>
                  <h6 className="mb-3">Your Budget</h6>
                  <Row className="mb-4">
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Min (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          name="min"
                          placeholder="Min"
                          value={filters.budget.min}
                          onChange={handleBudgetChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-center justify-content-center">
                      <span>to</span>
                    </Col>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Max (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          name="max"
                          placeholder="Max"
                          value={filters.budget.max}
                          onChange={handleBudgetChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h6 className="mb-3">Star Category</h6>
                  {filters.starCategories.map((star, index) => (
                    <Form.Group key={star.id} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={`${star.stars} Star (${star.count})`}
                        checked={star.selected}
                        onChange={(e) => handleFilterChange('starCategories', index, 'selected', e.target.checked)}
                      />
                    </Form.Group>
                  ))}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Submit Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="secondary" 
              type="button"
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {id ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                id ? 'Update Hotel' : 'Save Hotel'
              )}
            </Button>
          </div>
        </Form>
      </Container>
    </Navbar>
  );
}

export default OfflineHotels;