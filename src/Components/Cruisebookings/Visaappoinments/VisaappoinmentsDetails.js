import React from 'react';
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaUsers, FaCheck, FaTimes } from 'react-icons/fa';
import Navbar from '../../../Shared/Navbar/Navbar';

const VisaAppointmentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment;

  // If no appointment data is passed, show error
  if (!appointment) {
    return (
      <Navbar>
        <Container>
          <div className="text-center py-5">
            <h3>No Appointment Data Found</h3>
            <p>Please go back and select an appointment to view details.</p>
            <Button onClick={() => navigate('/visa-appointments')}>
              Go Back to Appointments
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

  return (
    <Navbar>
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              className="me-3"
              onClick={() => navigate('/visa-appointments')}
            >
              <FaArrowLeft className="me-2" />
              Back to Appointments
            </Button>
            <div>
              <h2 className="mb-0">Visa Appointment Details</h2>
              <p className="text-muted mb-0">Appointment ID: #{appointment.id}</p>
            </div>
          </div>
          <Badge bg={appointment.agreed_terms === 1 ? "success" : "danger"} className="fs-6">
            {appointment.agreed_terms === 1 ? "Terms Agreed" : "Terms Not Agreed"}
          </Badge>
        </div>

        <Row>
          {/* Personal Information */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaUser className="me-2" />
                  Personal Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6}>
                    <strong>Full Name:</strong>
                    <p>{appointment.name || "N/A"}</p>
                  </Col>
                  <Col sm={6}>
                    <strong>Contact Number:</strong>
                    <p>
                      <FaPhone className="me-2 text-muted" />
                      {appointment.cell_no || "N/A"}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <strong>Email Address:</strong>
                    <p>
                      <FaEnvelope className="me-2 text-muted" />
                      {appointment.email_id || "N/A"}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <strong>Number of People:</strong>
                    <p>
                      <FaUsers className="me-2 text-muted" />
                      {appointment.no_of_people || 0}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Appointment Details */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Appointment Details
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={12} className="mb-3">
                    <strong>Consultancy Country:</strong>
                    <p className="fs-5 text-primary">
                      <FaGlobe className="me-2" />
                      {appointment.consultancy_country || "N/A"}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <strong>Convenient Date:</strong>
                    <p>
                      <FaCalendarAlt className="me-2 text-muted" />
                      {formatDate(appointment.convenient_date)}
                    </p>
                  </Col>
                  <Col sm={6}>
                    <strong>Convenient Time:</strong>
                    <p>{appointment.convenient_time || "N/A"}</p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <strong>Terms & Conditions:</strong>
                    <p>
                      {appointment.agreed_terms === 1 ? (
                        <span className="text-success">
                          <FaCheck className="me-2" />
                          Agreed
                        </span>
                      ) : (
                        <span className="text-danger">
                          <FaTimes className="me-2" />
                          Not Agreed
                        </span>
                      )}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Address Information */}
          <Col md={12} className="mb-4">
            <Card>
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <FaMapMarkerAlt className="me-2" />
                  Address Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <strong>Address:</strong>
                    <p>{appointment.address || "N/A"}</p>
                  </Col>
                  <Col md={3}>
                    <strong>City:</strong>
                    <p>{appointment.city || "N/A"}</p>
                  </Col>
                  <Col md={3}>
                    <strong>Pincode:</strong>
                    <p>{appointment.pin_code || "N/A"}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <strong>State:</strong>
                    <p>{appointment.state || "N/A"}</p>
                  </Col>
                  <Col md={4}>
                    <strong>Country:</strong>
                    <p>{appointment.country || "N/A"}</p>
                  </Col>
                </Row>
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
                    <strong>Appointment Created:</strong>
                    <p>{formatDate(appointment.created_at)}</p>
                  </Col>
                  <Col sm={6}>
                    <strong>Last Updated:</strong>
                    <p>{appointment.updated_at ? formatDate(appointment.updated_at) : "N/A"}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default VisaAppointmentDetails;