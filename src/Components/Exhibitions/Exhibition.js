// Exhibition.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Card, Table, Badge, Button } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, Eye, Plus } from 'react-bootstrap-icons';
import './Exhibition.css';

const Exhibition = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState('about');

  // Dummy data for About Exhibition FAQs
  const dummyFAQs = [
    {
      id: 1,
      serial_no: 1,
      question: "What are the exhibition timings?",
      answer: "The exhibition is open from 10:00 AM to 6:00 PM daily.",
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      serial_no: 2,
      question: "How can I register for the exhibition?",
      answer: "You can register online through our website or at the venue registration desk.",
      created_at: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      serial_no: 3,
      question: "Is there parking available?",
      answer: "Yes, we have ample parking space available for all visitors.",
      created_at: "2024-01-13T09:15:00Z"
    },
    {
      id: 4,
      serial_no: 4,
      question: "Are children allowed?",
      answer: "Children above 12 years are allowed with adult supervision.",
      created_at: "2024-01-12T16:45:00Z"
    },
    {
      id: 5,
      serial_no: 5,
      question: "What safety measures are in place?",
      answer: "We have security personnel, CCTV surveillance, and emergency medical facilities.",
      created_at: "2024-01-11T11:10:00Z"
    }
  ];

  // Dummy data for Domestic Exhibitions
  const dummyDomesticExhibitions = [
    {
      id: 1,
      serial_no: 1,
      code: "DOME00001",
      title: "National Textile Expo 2024",
      product_type: "Textile",
      city: "Mumbai",
      start_date: "2024-03-15",
      end_date: "2024-03-18",
      created_at: "2024-01-10T10:00:00Z"
    },
    {
      id: 2,
      serial_no: 2,
      code: "DOME00002",
      title: "AgriTech India 2024",
      product_type: "Agriculture",
      city: "Delhi",
      start_date: "2024-04-05",
      end_date: "2024-04-08",
      created_at: "2024-01-09T14:30:00Z"
    },
    {
      id: 3,
      serial_no: 3,
      code: "DOME00003",
      title: "Indian Pharma Expo",
      product_type: "Pharmaceutical",
      city: "Hyderabad",
      start_date: "2024-05-12",
      end_date: "2024-05-15",
      created_at: "2024-01-08T09:45:00Z"
    },
    {
      id: 4,
      serial_no: 4,
      code: "DOME00004",
      title: "Tourism & Hospitality Summit",
      product_type: "Tourism",
      city: "Goa",
      start_date: "2024-06-20",
      end_date: "2024-06-23",
      created_at: "2024-01-07T16:20:00Z"
    },
    {
      id: 5,
      serial_no: 5,
      code: "DOME00005",
      title: "Electronics Manufacturing Expo",
      product_type: "Computer / Electro",
      city: "Bangalore",
      start_date: "2024-07-10",
      end_date: "2024-07-13",
      created_at: "2024-01-06T11:15:00Z"
    }
  ];

  // Dummy data for International Exhibitions
  const dummyInternationalExhibitions = [
    {
      id: 1,
      serial_no: 1,
      code: "INTE00001",
      title: "Dubai Gulf Food Expo 2024",
      country: "Dubai",
      product_type: "Gulf Food",
      city: "Dubai",
      start_date: "2024-02-15",
      end_date: "2024-02-18",
      created_at: "2024-01-05T13:00:00Z"
    },
    {
      id: 2,
      serial_no: 2,
      code: "INTE00002",
      title: "London Tourism Fair",
      country: "United Kingdom",
      product_type: "Tourism",
      city: "London",
      start_date: "2024-03-22",
      end_date: "2024-03-25",
      created_at: "2024-01-04T15:30:00Z"
    },
    {
      id: 3,
      serial_no: 3,
      code: "INTE00003",
      title: "German Industrial Expo",
      country: "Germany",
      product_type: "Steel",
      city: "Berlin",
      start_date: "2024-04-18",
      end_date: "2024-04-21",
      created_at: "2024-01-03T10:45:00Z"
    },
    {
      id: 4,
      serial_no: 4,
      code: "INTE00004",
      title: "China Electronics Fair",
      country: "China",
      product_type: "Electronics",
      city: "Shanghai",
      start_date: "2024-05-25",
      end_date: "2024-05-28",
      created_at: "2024-01-02T14:20:00Z"
    },
    {
      id: 5,
      serial_no: 5,
      code: "INTE00005",
      title: "Spain Hospitality Summit",
      country: "Spain",
      product_type: "Hospitality",
      city: "Barcelona",
      start_date: "2024-06-30",
      end_date: "2024-07-03",
      created_at: "2024-01-01T09:10:00Z"
    }
  ];

  // Handle actions
  const handleView = (id, type) => {
    console.log(`View ${type} with ID: ${id}`);
    // navigate(`/exhibition/${type}/${id}`);
  };

  const handleEdit = (id, type) => {
    console.log(`Edit ${type} with ID: ${id}`);
    if (type === 'about') {
      navigate(`/edit-exhibition-faq/${id}`);
    } else if (type === 'domestic') {
      navigate(`/edit-exhibition/domestic/${id}`);
    } else {
      navigate(`/edit-exhibition/international/${id}`);
    }
  };

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type} exhibition?`)) {
      console.log(`Delete ${type} with ID: ${id}`);
      // Add API call here
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateRange = (start, end) => {
    if (!start || !end) return 'N/A';
    const startDate = formatDate(start);
    const endDate = formatDate(end);
    return `${startDate} - ${endDate}`;
  };

  const renderFAQsTable = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">FAQs List</h5>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => navigate('/add-exhibition-faq')}
        >
          <Plus className="me-1" /> Add FAQ
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Question</th>
              <th>Answer Preview</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyFAQs.map((faq) => (
              <tr key={faq.id}>
                <td className="fw-bold text-center">{faq.serial_no}</td>
                <td>{faq.question}</td>
                <td>
                  {faq.answer.length > 50 
                    ? `${faq.answer.substring(0, 50)}...` 
                    : faq.answer}
                </td>
                <td>{formatDate(faq.created_at)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => handleView(faq.id, 'about')}
                      title="View"
                    >
                      <Eye />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(faq.id, 'about')}
                      title="Edit"
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(faq.id, 'about')}
                      title="Delete"
                    >
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  const renderDomesticTable = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Domestic Exhibitions</h5>
        <Button 
          variant="success" 
          size="sm"
          onClick={() => navigate('/add-exhibition/domestic')}
        >
          <Plus className="me-1" /> Add Domestic Exhibition
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Code</th>
              <th>Title</th>
              <th>Product Type</th>
              <th>City</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyDomesticExhibitions.map((exhibition) => (
              <tr key={exhibition.id}>
                <td className="fw-bold text-center">{exhibition.serial_no}</td>
                <td>
                  <Badge bg="primary">{exhibition.code}</Badge>
                </td>
                <td>{exhibition.title}</td>
                <td>{exhibition.product_type}</td>
                <td>{exhibition.city}</td>
                <td>{formatDateRange(exhibition.start_date, exhibition.end_date)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => handleView(exhibition.id, 'domestic')}
                      title="View"
                    >
                      <Eye />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(exhibition.id, 'domestic')}
                      title="Edit"
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(exhibition.id, 'domestic')}
                      title="Delete"
                    >
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  const renderInternationalTable = () => (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">International Exhibitions</h5>
        <Button 
          variant="info" 
          size="sm"
          onClick={() => navigate('/add-exhibition/international')}
        >
          <Plus className="me-1" /> Add International Exhibition
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Code</th>
              <th>Title</th>
              <th>Country</th>
              <th>Product Type</th>
              <th>City</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyInternationalExhibitions.map((exhibition) => (
              <tr key={exhibition.id}>
                <td className="fw-bold text-center">{exhibition.serial_no}</td>
                <td>
                  <Badge bg="info">{exhibition.code}</Badge>
                </td>
                <td>{exhibition.title}</td>
                <td>{exhibition.country}</td>
                <td>{exhibition.product_type}</td>
                <td>{exhibition.city}</td>
                <td>{formatDateRange(exhibition.start_date, exhibition.end_date)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => handleView(exhibition.id, 'international')}
                      title="View"
                    >
                      <Eye />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(exhibition.id, 'international')}
                      title="Edit"
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(exhibition.id, 'international')}
                      title="Delete"
                    >
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  return (
    <Navbar>
      <Container className="exhibition-container py-4">
        <Row>
          <Col>
            <h1 className="mb-4">Exhibition Management</h1>
            <p className="text-muted mb-4">Manage all exhibition related content from here</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Tabs
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="exhibition-tabs"
            >
              <Tab eventKey="about" title="About Exhibition">
                <div className="py-3">
                  <div className="mb-3">
                    <h5>About Exhibition FAQs</h5>
                    <p className="text-muted">Manage Frequently Asked Questions for exhibitions</p>
                  </div>
                  {renderFAQsTable()}
                </div>
              </Tab>
              <Tab eventKey="domestic" title="Domestic Exhibition">
                <div className="py-3">
                  <div className="mb-3">
                    <h5>Domestic Exhibitions</h5>
                    <p className="text-muted">Manage domestic exhibitions within the country</p>
                  </div>
                  {renderDomesticTable()}
                </div>
              </Tab>
              <Tab eventKey="international" title="International Exhibition">
                <div className="py-3">
                  <div className="mb-3">
                    <h5>International Exhibitions</h5>
                    <p className="text-muted">Manage international exhibitions across the globe</p>
                  </div>
                  {renderInternationalTable()}
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Exhibition;