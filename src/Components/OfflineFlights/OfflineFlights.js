import React, { useState } from 'react';
import { Container, Card, Form, Row, Col, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { indianAirports, countries } from './airports';
import axios from 'axios';
import { baseurl } from '../../Api/Baseurl';
import { useNavigate } from 'react-router-dom';

function OfflineFlights() {
  const [bookingType, setBookingType] = useState('oneWay');
  const [selectedFromAirport, setSelectedFromAirport] = useState('');
  const [selectedToAirport, setSelectedToAirport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
   const navigate = useNavigate();
  
  // Get unique cities from airports
  const indianCities = [...new Set(indianAirports.map(airport => airport.city))].sort();
  
  // Get airports for selected city
  const getAirportsByCity = (city) => {
    return indianAirports.filter(airport => airport.city === city);
  };

  const [flightDetails, setFlightDetails] = useState({
    // Basic Flight Info
    fromCountry: 'IN',
    fromCity: '',
    fromAirport: '',
    fromAirportCode: '',
    toCountry: 'IN',
    toCity: '',
    toAirport: '',
    toAirportCode: '',
    departureDate: '',
    returnDate: '',
    
    // Travellers
    adults: 1,
    children: 0,
    infants: 0,
    travellerClass: 'Economy',
    
    // Flight Display Info
    flightTime: '',
    duration: '',
    arrivalTime: '',
    flightType: 'Non Stop',
    destination: '',
    airline: '',
    flightNumber: '',
    baggageAllowance: '',
    mealsSeatDescription: '',
    refundableStatusDescription: '', 
    mealsIncluded: false,
    pricePerAdult: '',
  });

  const [filters, setFilters] = useState({
    // Popular Filters
    nonStop: true,
    hideNearbyAirports: false,
    refundableFares: false,
    oneStop: false,
    
    // Departure Airports Filter
    departureAirports: [
      {
        id: 1,
        name: 'Indira Gandhi International Airport',
        code: 'DEL',
        price: '7,121',
        selected: false
      },
      {
        id: 2,
        name: 'Hindon Airport',
        code: 'HDO',
        distance: '32Km',
        price: '6,848',
        selected: false
      }
    ],
    
    // Stops Filter
    stops: [
      {
        id: 1,
        type: 'Non Stop',
        price: '6,848',
        selected: true
      },
      {
        id: 2,
        type: '1 Stop',
        price: '7,173',
        selected: false
      }
    ],
    
    // Departure Time Filters
    departureTimeRanges: [
      {
        id: 1,
        range: 'Before 6 AM to 12 PM',
        selected: true
      },
      {
        id: 2,
        range: 'After 6 PM to 12 PM',
        selected: false
      }
    ],
    
    // Arrival Time Filters
    arrivalTimeRanges: [
      {
        id: 1,
        range: 'Before 6 AM to 12 PM',
        selected: true
      },
      {
        id: 2,
        range: 'After 6 PM to 12 PM',
        selected: false
      }
    ],
    
    // Airlines Filter
    airlines: [
      {
        id: 1,
        name: 'Air India',
        code: 'AI',
        price: '7,171',
        selected: true
      },
      {
        id: 2,
        name: 'Air India Express',
        code: 'IX',
        price: '6,848',
        selected: false
      },
      {
        id: 3,
        name: 'Akasa Air',
        code: 'QP',
        price: '8,338',
        selected: false
      },
      {
        id: 4,
        name: 'IndiGo',
        code: '6E',
        price: '7,121',
        selected: false
      },
      {
        id: 5,
        name: 'SpiceJet',
        code: 'SG',
        price: '7,237',
        selected: false
      }
    ],
    
    // Aircraft Size Filter
    aircraftSizes: [
      {
        id: 1,
        size: 'Small / Mid-size aircraft',
        price: '6,848',
        selected: true
      },
      {
        id: 2,
        size: 'Large Aircraft',
        price: '7,173',
        selected: false
      }
    ],
    
    // One Way Price Range
    minPrice: '6,848',
    maxPrice: '28,800'
  });

  // Validation function
  const validateForm = () => {
    if (!flightDetails.fromCity) {
      setError('Please select departure city');
      return false;
    }
    if (!flightDetails.fromAirportCode) {
      setError('Please select departure airport');
      return false;
    }
    if (!flightDetails.toCity) {
      setError('Please select arrival city');
      return false;
    }
    if (!flightDetails.toAirportCode) {
      setError('Please select arrival airport');
      return false;
    }
    if (!flightDetails.departureDate) {
      setError('Please select departure date');
      return false;
    }
    if (bookingType === 'roundTrip' && !flightDetails.returnDate) {
      setError('Please select return date for round trip');
      return false;
    }
    if (!flightDetails.airline) {
      setError('Please enter airline name');
      return false;
    }
    if (!flightDetails.flightNumber) {
      setError('Please enter flight number');
      return false;
    }
    if (!flightDetails.pricePerAdult) {
      setError('Please enter price per adult');
      return false;
    }
    return true;
  };

  const handleFlightDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFlightDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFromCityChange = (e) => {
    const city = e.target.value;
    setFlightDetails(prev => ({
      ...prev,
      fromCity: city,
      fromAirport: '',
      fromAirportCode: ''
    }));
    setSelectedFromAirport('');
  };

  const handleToCityChange = (e) => {
    const city = e.target.value;
    setFlightDetails(prev => ({
      ...prev,
      toCity: city,
      toAirport: '',
      toAirportCode: ''
    }));
    setSelectedToAirport('');
  };

  const handleFromAirportChange = (e) => {
    const airportCode = e.target.value;
    const selectedAirport = indianAirports.find(airport => airport.code === airportCode);
    if (selectedAirport) {
      setFlightDetails(prev => ({
        ...prev,
        fromAirport: selectedAirport.airport,
        fromAirportCode: selectedAirport.code
      }));
      setSelectedFromAirport(airportCode);
    }
  };

  const handleToAirportChange = (e) => {
    const airportCode = e.target.value;
    const selectedAirport = indianAirports.find(airport => airport.code === airportCode);
    if (selectedAirport) {
      setFlightDetails(prev => ({
        ...prev,
        toAirport: selectedAirport.airport,
        toAirportCode: selectedAirport.code
      }));
      setSelectedToAirport(airportCode);
    }
  };

  const handleFilterChange = (category, index, field, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleTravellerChange = (type, operation) => {
    setFlightDetails(prev => {
      const currentValue = prev[type];
      let newValue = currentValue;
      
      if (operation === 'increase') {
        newValue = currentValue + 1;
      } else if (operation === 'decrease' && currentValue > 0) {
        if (type === 'adults' && currentValue > 1) {
          newValue = currentValue - 1;
        } else if (type !== 'adults') {
          newValue = currentValue - 1;
        }
      }
      
      return { ...prev, [type]: newValue };
    });
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Submit handler with backend connection
  // Submit handler with backend connection and navigation
const handleSubmit = async (e) => {
  e.preventDefault();
  clearMessages();

  // Validate form
  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const formData = {
      bookingType,
      flightDetails,
      filters
    };

    console.log('Submitting offline flight data:', formData);

    // API call to backend
    const response = await axios.post(`${baseurl}/api/offline-flights`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      setSuccess('Offline flight saved successfully!');
      
      // Navigate to offline flights table after successful submission
      setTimeout(() => {
        navigate('/offline-flights-table');
      }, 1500); // 1.5 second delay to show success message
    }
  } catch (error) {
    console.error('Error submitting offline flight:', error);
    
    if (error.response) {
      // Server responded with error
      setError(error.response.data.message || 'Failed to save offline flight');
    } else if (error.request) {
      // Request made but no response
      setError('No response from server. Please check if the server is running.');
    } else {
      // Something else happened
      setError('Error submitting form. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};


  // Reset form function
  const resetForm = () => {
    setBookingType('oneWay');
    setSelectedFromAirport('');
    setSelectedToAirport('');
    setFlightDetails({
      fromCountry: 'IN',
      fromCity: '',
      fromAirport: '',
      fromAirportCode: '',
      toCountry: 'IN',
      toCity: '',
      toAirport: '',
      toAirportCode: '',
      departureDate: '',
      returnDate: '',
      adults: 1,
      children: 0,
      infants: 0,
      travellerClass: 'Economy',
      flightTime: '',
      duration: '',
      arrivalTime: '',
      flightType: 'Non Stop',
      destination: '',
      airline: '',
      flightNumber: '',
      baggageAllowance: '',
      mealsSeatDescription: '',
      refundableStatusDescription: '',
      mealsIncluded: false,
      pricePerAdult: '',
    });
    setSuccess('');
  };

  return (
    <Navbar>
      <Container fluid className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Offline Flights</h2>
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
          {/* Basic Booking Information */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Flight Booking Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Booking Type <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      value={bookingType} 
                      onChange={(e) => setBookingType(e.target.value)}
                    >
                      <option value="oneWay">One Way</option>
                      <option value="roundTrip">Round Trip</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Traveller Class</Form.Label>
                    <Form.Select 
                      name="travellerClass"
                      value={flightDetails.travellerClass}
                      onChange={handleFlightDetailChange}
                    >
                      <option value="Economy">Economy</option>
                      <option value="Premium Economy">Premium Economy</option>
                      <option value="Business">Business</option>
                      <option value="First Class">First Class</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* From Section */}
              <Row className="mb-3">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>From City <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="fromCity"
                      value={flightDetails.fromCity}
                      onChange={handleFromCityChange}
                      required
                    >
                      <option value="">Select City</option>
                      {indianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Airport <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={selectedFromAirport}
                      onChange={handleFromAirportChange}
                      disabled={!flightDetails.fromCity}
                      required
                    >
                      <option value="">Select Airport</option>
                      {flightDetails.fromCity && getAirportsByCity(flightDetails.fromCity).map(airport => (
                        <option key={airport.code} value={airport.code}>
                          {airport.airport} ({airport.code})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Airport Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={flightDetails.fromAirportCode}
                      readOnly
                      placeholder="Auto-filled"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* To Section */}
              <Row className="mb-3">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>To City <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="toCity"
                      value={flightDetails.toCity}
                      onChange={handleToCityChange}
                      required
                    >
                      <option value="">Select City</option>
                      {indianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Airport <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={selectedToAirport}
                      onChange={handleToAirportChange}
                      disabled={!flightDetails.toCity}
                      required
                    >
                      <option value="">Select Airport</option>
                      {flightDetails.toCity && getAirportsByCity(flightDetails.toCity).map(airport => (
                        <option key={airport.code} value={airport.code}>
                          {airport.airport} ({airport.code})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Airport Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={flightDetails.toAirportCode}
                      readOnly
                      placeholder="Auto-filled"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Departure Date <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="date"
                      name="departureDate"
                      value={flightDetails.departureDate}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Return Date {bookingType === 'roundTrip' && <span className="text-danger">*</span>}</Form.Label>
                    <Form.Control
                      type="date"
                      name="returnDate"
                      value={flightDetails.returnDate}
                      onChange={handleFlightDetailChange}
                      disabled={bookingType === 'oneWay'}
                      required={bookingType === 'roundTrip'}
                    />
                    {bookingType === 'oneWay' && (
                      <Form.Text className="text-muted">
                        Disabled for One Way booking
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Travellers Information */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Travellers</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Adults (12y+)</Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('adults', 'decrease')}
                        disabled={flightDetails.adults <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={flightDetails.adults}
                        readOnly
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('adults', 'increase')}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Children (2-11y)</Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('children', 'decrease')}
                        disabled={flightDetails.children <= 0}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={flightDetails.children}
                        readOnly
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('children', 'increase')}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Infants (0-2y)</Form.Label>
                    <InputGroup>
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('infants', 'decrease')}
                        disabled={flightDetails.infants <= 0}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={flightDetails.infants}
                        readOnly
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('infants', 'increase')}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Flight Display Information */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Flight Details Display</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Departure Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="flightTime"
                      value={flightDetails.flightTime}
                      onChange={handleFlightDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                      type="text"
                      name="duration"
                      placeholder="02h 50m"
                      value={flightDetails.duration}
                      onChange={handleFlightDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Arrival Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="arrivalTime"
                      value={flightDetails.arrivalTime}
                      onChange={handleFlightDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Flight Type</Form.Label>
                    <Form.Select
                      name="flightType"
                      value={flightDetails.flightType}
                      onChange={handleFlightDetailChange}
                    >
                      <option value="Non Stop">Non Stop</option>
                      <option value="1 Stop">1 Stop</option>
                      <option value="2+ Stops">2+ Stops</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Airline <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="airline"
                      placeholder="Air India Express"
                      value={flightDetails.airline}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Flight Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="flightNumber"
                      placeholder="IX 2964"
                      value={flightDetails.flightNumber}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price Per Adult (₹) <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="pricePerAdult"
                      placeholder="6,848"
                      value={flightDetails.pricePerAdult}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Baggage Allowance Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="baggageAllowance"
                      placeholder="e.g., 15kg Check-in baggage, 7kg Cabin baggage, Additional handbag allowed"
                      value={flightDetails.baggageAllowance}
                      onChange={handleFlightDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Meals & Seat Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="mealsSeatDescription"
                      placeholder="e.g., Vegetarian meal available, Non-vegetarian meal available, Pre-paid meal, Standard seat with extra legroom available at additional cost"
                      value={flightDetails.mealsSeatDescription}
                      onChange={handleFlightDetailChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Refund Status Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="refundableStatusDescription"
                      placeholder="e.g., Fully refundable before 24 hours of departure, 50% cancellation fee within 24 hours, Non-refundable after check-in"
                      value={flightDetails.refundableStatusDescription}
                      onChange={handleFlightDetailChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Meals Included in Fare"
                      name="mealsIncluded"
                      checked={flightDetails.mealsIncluded}
                      onChange={handleFlightDetailChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Filters Section */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Flight Filters</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Popular Filters */}
                <Col md={6}>
                  <h6 className="mb-3">Popular Filters</h6>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label={`Non Stop (₹ ${filters.stops[0].price})`}
                      checked={filters.stops[0].selected}
                      onChange={(e) => handleFilterChange('stops', 0, 'selected', e.target.checked)}
                    />
                    <Form.Check
                      type="checkbox"
                      label={`Hide Nearby Airports (₹ 7,121)`}
                      checked={filters.hideNearbyAirports}
                      onChange={(e) => setFilters(prev => ({ ...prev, hideNearbyAirports: e.target.checked }))}
                    />
                    <Form.Check
                      type="checkbox"
                      label={`Refundable Fares (₹ 6,848)`}
                      checked={filters.refundableFares}
                      onChange={(e) => setFilters(prev => ({ ...prev, refundableFares: e.target.checked }))}
                    />
                    <Form.Check
                      type="checkbox"
                      label={`1 Stop (₹ ${filters.stops[1].price})`}
                      checked={filters.stops[1].selected}
                      onChange={(e) => handleFilterChange('stops', 1, 'selected', e.target.checked)}
                    />
                  </Form.Group>
                </Col>

                {/* Departure Airports */}
                <Col md={6}>
                  <h6 className="mb-3">Departure Airports</h6>
                  {filters.departureAirports.map((airport, index) => (
                    <Form.Group key={airport.id} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={`${airport.name} ${airport.distance ? `(${airport.distance})` : ''} - ₹ ${airport.price}`}
                        checked={airport.selected}
                        onChange={(e) => handleFilterChange('departureAirports', index, 'selected', e.target.checked)}
                      />
                    </Form.Group>
                  ))}
                </Col>
              </Row>

              <Row className="mt-4">
                {/* Departure Time */}
                <Col md={6}>
                  <h6 className="mb-3">Departure From {flightDetails.fromCity || 'New Delhi'}</h6>
                  {filters.departureTimeRanges.map((range, index) => (
                    <Form.Group key={range.id} className="mb-2">
                      <Form.Check
                        type="radio"
                        name="departureTime"
                        label={range.range}
                        checked={range.selected}
                        onChange={() => {
                          filters.departureTimeRanges.forEach((_, i) => {
                            handleFilterChange('departureTimeRanges', i, 'selected', i === index);
                          });
                        }}
                      />
                    </Form.Group>
                  ))}
                </Col>

                {/* Arrival Time */}
                <Col md={6}>
                  <h6 className="mb-3">Arrival at {flightDetails.toCity || 'Bengaluru'}</h6>
                  {filters.arrivalTimeRanges.map((range, index) => (
                    <Form.Group key={range.id} className="mb-2">
                      <Form.Check
                        type="radio"
                        name="arrivalTime"
                        label={range.range}
                        checked={range.selected}
                        onChange={() => {
                          filters.arrivalTimeRanges.forEach((_, i) => {
                            handleFilterChange('arrivalTimeRanges', i, 'selected', i === index);
                          });
                        }}
                      />
                    </Form.Group>
                  ))}
                </Col>
              </Row>

              <Row className="mt-4">
                {/* Airlines */}
                <Col md={6}>
                  <h6 className="mb-3">Airlines</h6>
                  {filters.airlines.map((airline, index) => (
                    <Form.Group key={airline.id} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={`${airline.name} - ₹ ${airline.price}`}
                        checked={airline.selected}
                        onChange={(e) => handleFilterChange('airlines', index, 'selected', e.target.checked)}
                      />
                    </Form.Group>
                  ))}
                </Col>

                {/* Aircraft Size */}
                <Col md={6}>
                  <h6 className="mb-3">Aircraft Size</h6>
                  {filters.aircraftSizes.map((size, index) => (
                    <Form.Group key={size.id} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={`${size.size} - ₹ ${size.price}`}
                        checked={size.selected}
                        onChange={(e) => handleFilterChange('aircraftSizes', index, 'selected', e.target.checked)}
                      />
                    </Form.Group>
                  ))}
                </Col>
              </Row>

              <Row className="mt-4">
                {/* Price Range */}
                <Col md={12}>
                  <h6 className="mb-3">One Way Price Range</h6>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Min Price (₹)</Form.Label>
                        <Form.Control
                          type="text"
                          value={filters.minPrice}
                          onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Max Price (₹)</Form.Label>
                        <Form.Control
                          type="text"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Submit Button */}
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
                  Saving...
                </>
              ) : (
                'Save Offline Flight'
              )}
            </Button>
          </div>
        </Form>
      </Container>
    </Navbar>
  );
}

export default OfflineFlights;