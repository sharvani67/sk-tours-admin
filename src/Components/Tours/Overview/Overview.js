import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';

const Overview = ({ tour, onEditTour }) => {
  return (
    <div className="tab-pane-content">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Basic Information</h4>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={onEditTour}
            className="edit-btn"
          >
            <Pencil size={16} className="me-1" />
          </Button>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Tour ID:</strong> {tour.tour_id}</p>
              <p><strong>Tour Code:</strong> {tour.tour_code}</p>
              <p><strong>Title:</strong> {tour.title}</p>
              <p><strong>Category:</strong> {tour.category_name}</p>
              <p><strong>Primary Destination:</strong> {tour.primary_destination_name}</p>
            </Col>
            <Col md={6}>
              <p><strong>Duration:</strong> {tour.duration_days} days</p>
              <p><strong>Base Price:</strong> ₹{tour.base_price_adult}</p>
              <p><strong>International:</strong> 
                <Badge bg={tour.is_international ? 'info' : 'secondary'} className="ms-2">
                  {tour.is_international ? 'Yes' : 'No'}
                </Badge>
              </p>
              <p><strong>Active:</strong> 
                <Badge bg={tour.is_active ? 'success' : 'danger'} className="ms-2">
                  {tour.is_active ? 'Yes' : 'No'}
                </Badge>
              </p>
              <p><strong>Created:</strong> {new Date(tour.created_at).toLocaleDateString()}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p><strong>Overview:</strong></p>
              <p>{tour.overview || 'No overview provided.'}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Overview;