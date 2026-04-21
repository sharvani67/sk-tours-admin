import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import axios from 'axios';
import { baseurl } from '../../Api/Baseurl';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./OfflineFlights.css"

function OfflineFlights() {
  const [bookingType, setBookingType] = useState('oneWay');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Date picker states
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  const [flightDetails, setFlightDetails] = useState({
    fromCountry: '',
    fromCity: '',
    fromAirport: '',
    fromAirportCode: '',
    toCountry: '',
    toCity: '',
    toAirport: '',
    toAirportCode: '',
    adults: 1,
    children: 0,
    infants: 0,
    travellerClass: 'Economy',
    flightTime: '',
    duration: '',
    arrivalTime: '',
    flightType: 'Non Stop',
    airline: '',
    flightNumber: '',
    baggageAllowance: '',
    mealsSeatDescription: '',
    refundableStatusDescription: '', 
    mealsIncluded: false,
    pricePerAdult: '',
    pricePerChild: '',
    totalAmount: 0,
  });

  // Calculate total amount whenever relevant fields change
  useEffect(() => {
    const adultTotal = (flightDetails.adults || 0) * (parseFloat(flightDetails.pricePerAdult) || 0);
    const childTotal = (flightDetails.children || 0) * (parseFloat(flightDetails.pricePerChild) || 0);
    const total = adultTotal + childTotal;
    
    setFlightDetails(prev => ({
      ...prev,
      totalAmount: total
    }));
  }, [flightDetails.adults, flightDetails.children, flightDetails.pricePerAdult, flightDetails.pricePerChild]);

  useEffect(() => {
    if (id) {
      fetchFlightData(id);
    }
  }, [id]);

  const fetchFlightData = async (flightId) => {
    setFetchLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${baseurl}/api/offline-flights/${flightId}`);
      
      if (response.data.success) {
        const flightData = response.data.data;
        
        setBookingType(flightData.booking_type || 'oneWay');
        
        // Set date picker values
        if (flightData.departure_date) {
          setDepartureDate(new Date(flightData.departure_date));
        }
        if (flightData.return_date) {
          setReturnDate(new Date(flightData.return_date));
        }
        
        // Ensure totalAmount is a number
        const totalAmount = flightData.total_amount 
          ? parseFloat(flightData.total_amount) 
          : 0;
        
        setFlightDetails({
          fromCountry: flightData.from_country || '',
          fromCity: flightData.from_city || '',
          fromAirport: flightData.from_airport || '',
          fromAirportCode: flightData.from_airport_code || '',
          toCountry: flightData.to_country || '',
          toCity: flightData.to_city || '',
          toAirport: flightData.to_airport || '',
          toAirportCode: flightData.to_airport_code || '',
          adults: flightData.adults || 1,
          children: flightData.children || 0,
          infants: flightData.infants || 0,
          travellerClass: flightData.traveller_class || 'Economy',
          flightTime: flightData.flight_time || '',
          duration: flightData.duration || '',
          arrivalTime: flightData.arrival_time || '',
          flightType: flightData.flight_type || 'Non Stop',
          airline: flightData.airline || '',
          flightNumber: flightData.flight_number || '',
          baggageAllowance: flightData.baggage_allowance || '',
          mealsSeatDescription: flightData.meals_seat_description || '',
          refundableStatusDescription: flightData.refundable_status_description || '',
          mealsIncluded: flightData.meals_included === 1 || flightData.meals_included === true,
          pricePerAdult: flightData.price_per_adult || '',
          pricePerChild: flightData.price_per_child || '',
          totalAmount: totalAmount,
        });
      }
    } catch (err) {
      console.error('Error fetching flight data:', err);
      setError(err.response?.data?.message || 'Failed to fetch flight data');
    } finally {
      setFetchLoading(false);
    }
  };

  const validateForm = () => {
    if (!flightDetails.fromCountry) {
      setError('Please enter departure country');
      return false;
    }
    if (!flightDetails.fromCity) {
      setError('Please enter departure city');
      return false;
    }
    if (!flightDetails.fromAirport) {
      setError('Please enter departure airport');
      return false;
    }
    if (!flightDetails.fromAirportCode) {
      setError('Please enter departure airport code');
      return false;
    }
    if (!flightDetails.toCountry) {
      setError('Please enter arrival country');
      return false;
    }
    if (!flightDetails.toCity) {
      setError('Please enter arrival city');
      return false;
    }
    if (!flightDetails.toAirport) {
      setError('Please enter arrival airport');
      return false;
    }
    if (!flightDetails.toAirportCode) {
      setError('Please enter arrival airport code');
      return false;
    }
    if (!departureDate) {
      setError('Please select departure date');
      return false;
    }
    if (bookingType === 'roundTrip' && !returnDate) {
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

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Format dates to YYYY-MM-DD
      const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formData = {
        bookingType,
        flightDetails: {
          ...flightDetails,
          departureDate: formatDate(departureDate),
          returnDate: formatDate(returnDate)
        }
      };

      console.log('Submitting offline flight data:', formData);

      let response;
      if (id) {
        response = await axios.put(`${baseurl}/api/offline-flights/${id}`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post(`${baseurl}/api/offline-flights`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.data.success) {
        setSuccess(id ? 'Offline flight updated successfully!' : 'Offline flight saved successfully!');
        
        setTimeout(() => {
          navigate('/offline-flights-table');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting offline flight:', error);
      
      if (error.response) {
        setError(error.response.data.message || `Failed to ${id ? 'update' : 'save'} offline flight`);
      } else if (error.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError(`Error ${id ? 'updating' : 'submitting'} form. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBookingType('oneWay');
    setDepartureDate(null);
    setReturnDate(null);
    setFlightDetails({
      fromCountry: '',
      fromCity: '',
      fromAirport: '',
      fromAirportCode: '',
      toCountry: '',
      toCity: '',
      toAirport: '',
      toAirportCode: '',
      adults: 1,
      children: 0,
      infants: 0,
      travellerClass: 'Economy',
      flightTime: '',
      duration: '',
      arrivalTime: '',
      flightType: 'Non Stop',
      airline: '',
      flightNumber: '',
      baggageAllowance: '',
      mealsSeatDescription: '',
      refundableStatusDescription: '',
      mealsIncluded: false,
      pricePerAdult: '',
      pricePerChild: '',
      totalAmount: 0,
    });
    setSuccess('');
    setError('');
  };

  // Helper function to safely format total amount
  const formatTotalAmount = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '0.00';
    }
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toFixed(2);
  };

  if (fetchLoading) {
    return (
      <Navbar>
        <Container fluid className="py-4 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading flight data...</p>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <Container fluid className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{id ? 'Edit Offline Flight' : 'Add Offline Flight'}</h2>
        </div>

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
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>From Country <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="fromCountry"
                      placeholder="e.g., India, USA, UAE"
                      value={flightDetails.fromCountry}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>From City <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="fromCity"
                      placeholder="e.g., Mumbai, Dubai, New York"
                      value={flightDetails.fromCity}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Airport Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="fromAirport"
                      placeholder="e.g., Chhatrapati Shivaji International Airport"
                      value={flightDetails.fromAirport}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Airport Code <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="fromAirportCode"
                      placeholder="e.g., BOM"
                      value={flightDetails.fromAirportCode}
                      onChange={handleFlightDetailChange}
                      required
                      style={{ textTransform: 'uppercase' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* To Section */}
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>To Country <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="toCountry"
                      placeholder="e.g., India, USA, UAE"
                      value={flightDetails.toCountry}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>To City <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="toCity"
                      placeholder="e.g., Delhi, London, Singapore"
                      value={flightDetails.toCity}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Airport Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="toAirport"
                      placeholder="e.g., Indira Gandhi International Airport"
                      value={flightDetails.toAirport}
                      onChange={handleFlightDetailChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Airport Code <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="toAirportCode"
                      placeholder="e.g., DEL"
                      value={flightDetails.toAirportCode}
                      onChange={handleFlightDetailChange}
                      required
                      style={{ textTransform: 'uppercase' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Departure Date <span className="text-danger">*</span></Form.Label>
                    <div className="date-picker-wrapper">
                     <DatePicker
                          selected={departureDate}
                          onChange={(date) => setDepartureDate(date)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          placeholderText="Select departure date"
                          minDate={new Date()}
                          required
                          popperPlacement="bottom-start"
                          portalId="root"
                          popperClassName="offline-datepicker-popper"
                          calendarClassName="offline-datepicker-calendar"
                        />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Return Date {bookingType === 'roundTrip' && <span className="text-danger">*</span>}</Form.Label>
                    <div className="date-picker-wrapper">
                      <DatePicker
                          selected={returnDate}
                          onChange={(date) => setReturnDate(date)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          placeholderText="Select return date"
                          minDate={departureDate || new Date()}
                          disabled={bookingType === 'oneWay'}
                          required={bookingType === 'roundTrip'}
                          popperPlacement="bottom-start"
                          portalId="root"
                          popperClassName="offline-datepicker-popper"
                          calendarClassName="offline-datepicker-calendar"
                        />
                    </div>
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
                    <div className="d-flex">
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('adults', 'decrease')}
                        disabled={flightDetails.adults <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="text"
                        value={flightDetails.adults}
                        readOnly
                        className="text-center mx-2"
                        style={{ width: '60px' }}
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('adults', 'increase')}
                      >
                        +
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Children (2-11y)</Form.Label>
                    <div className="d-flex">
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('children', 'decrease')}
                        disabled={flightDetails.children <= 0}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="text"
                        value={flightDetails.children}
                        readOnly
                        className="text-center mx-2"
                        style={{ width: '60px' }}
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('children', 'increase')}
                      >
                        +
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Infants (0-2y)</Form.Label>
                    <div className="d-flex">
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('infants', 'decrease')}
                        disabled={flightDetails.infants <= 0}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="text"
                        value={flightDetails.infants}
                        readOnly
                        className="text-center mx-2"
                        style={{ width: '60px' }}
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => handleTravellerChange('infants', 'increase')}
                      >
                        +
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Flight Display Information */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Flight Details</h5>
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
                      placeholder="2h 30m"
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
              </Row>

              {/* Pricing Section */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Price Per Adult (₹) <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="pricePerAdult"
                        placeholder="Enter price per adult"
                        value={flightDetails.pricePerAdult}
                        onChange={handleFlightDetailChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Price Per Child (₹)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="pricePerChild"
                        placeholder="Enter price per child"
                        value={flightDetails.pricePerChild}
                        onChange={handleFlightDetailChange}
                        min="0"
                        step="0.01"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Optional - Leave empty if children travel free
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Total Amount (₹)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={formatTotalAmount(flightDetails.totalAmount)}
                        readOnly
                        className="bg-light"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Auto-calculated: (Adults × Adult Price) + (Children × Child Price)
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Baggage Allowance</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="baggageAllowance"
                      placeholder="e.g., 15kg Check-in baggage, 7kg Cabin baggage"
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
                      placeholder="e.g., Vegetarian meal available, Standard seat with extra legroom"
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
                      placeholder="e.g., Fully refundable before 24 hours of departure"
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
                  {id ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                id ? 'Update Offline Flight' : 'Save Offline Flight'
              )}
            </Button>
          </div>
        </Form>
      </Container>
    </Navbar>
  );
}

export default OfflineFlights;