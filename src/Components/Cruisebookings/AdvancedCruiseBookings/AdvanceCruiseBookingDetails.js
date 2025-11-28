import React from 'react';
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaShip, FaMapMarkerAlt, FaEnvelope, FaPhone, FaMoneyBillWave, FaUsers } from 'react-icons/fa';
import Navbar from '../../../Shared/Navbar/Navbar';

const AdvancedCruiseBookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  // If no booking data is passed, show error
  if (!booking) {
    return (
      <Navbar>
        <Container>
          <div className="text-center py-5">
            <h3>No Booking Data Found</h3>
            <p>Please go back and select a booking to view details.</p>
            <Button onClick={() => navigate('/advanced-cruise-bookings')}>
              Go Back to Bookings
            </Button>
          </div>
        </Container>
      </Navbar>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Navbar>
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              className="me-3"
              onClick={() => navigate('/advanced-cruise-bookings')}
            >
              <FaArrowLeft className="me-2" />
              Back to Bookings
            </Button>
            <div>
              <h2 className="mb-0">Advance Cruise Booking Details</h2>
              <p className="text-muted mb-0">Booking Reference: #{booking.id}</p>
            </div>
          </div>
          <Badge bg="primary" className="fs-6">
            {formatDate(booking.created_at)}
          </Badge>
        </div>

        <Row>
          {/* Customer Information */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaUser className="me-2" />
                  Customer Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6}>
                    <strong>Full Name:</strong>
                    <p>{booking.name || "N/A"}</p>
                  </Col>
                  <Col sm={6}>
                    <strong>Contact Number:</strong>
                    <p>
                      <FaPhone className="me-2 text-muted" />
                      {booking.cell_no || "N/A"}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <strong>Email Address:</strong>
                    <p>
                      <FaEnvelope className="me-2 text-muted" />
                      {booking.email_id || "N/A"}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Booking Amount */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <FaMoneyBillWave className="me-2" />
                  Booking Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="text-center">
                  <Col xs={6}>
                    <div className="border rounded p-3 bg-light">
                      <h4 className="text-success mb-1">{formatCurrency(booking.booking_amount)}</h4>
                      <small className="text-muted">Total Amount</small>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="border rounded p-3 bg-light">
                      <h4 className="text-primary mb-1">{booking.no_of_people || 0}</h4>
                      <small className="text-muted">Total Passengers</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Cruise Details */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <FaShip className="me-2" />
                  Cruise Details
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={12} className="mb-3">
                    <strong>Cruise Name:</strong>
                    <p className="fs-5 text-primary">{booking.cruise_name || "N/A"}</p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <strong>Cabin Type:</strong>
                    <p>{booking.cabin_type || "N/A"}</p>
                  </Col>
                  <Col sm={6}>
                    <strong>Sailing Days:</strong>
                    <p>{booking.sailing_days || "N/A"}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Departure Information */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Departure Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={12}>
                    <strong>Departure Date:</strong>
                    <p>
                      <FaCalendarAlt className="me-2 text-muted" />
                      {formatDate(booking.departure_date)}
                    </p>
                  </Col>
                </Row>
                {booking.boarding_port && (
                  <Row>
                    <Col sm={12}>
                      <strong>Boarding Port:</strong>
                      <p>{booking.boarding_port}</p>
                    </Col>
                  </Row>
                )}
                {booking.exit_port && (
                  <Row>
                    <Col sm={12}>
                      <strong>Exit Port:</strong>
                      <p>{booking.exit_port}</p>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Information */}
        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Header className="bg-light">
                <h5 className="mb-0">Additional Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6}>
                    <strong>Booking Created:</strong>
                    <p>{formatDate(booking.created_at)}</p>
                  </Col>
                  <Col sm={6}>
                    <strong>Last Updated:</strong>
                    <p>{booking.updated_at ? formatDate(booking.updated_at) : "N/A"}</p>
                  </Col>
                </Row>
                {booking.remarks && (
                  <Row>
                    <Col sm={12}>
                      <strong>Remarks:</strong>
                      <p className="mb-0">{booking.remarks}</p>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default AdvancedCruiseBookingDetails;