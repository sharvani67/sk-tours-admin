import React from 'react';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { Pencil, Trash, Plus } from 'react-bootstrap-icons';
import "./Inclusion.css"

const Inclusions = ({ inclusions = [], onEditInclusions, onAddInclusion, onDeleteInclusion }) => {
  return (
    <div className="tab-pane-content">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            Tour Inclusions ({inclusions.length})
          </h4>
          <div className="d-flex gap-2">
            {/* <Button 
              variant="outline-primary" 
              size="sm"
              onClick={onEditInclusions}
              className="d-flex align-items-center"
            >
              <Pencil size={16} className="me-1" />
              Bulk Edit
            </Button> */}
            <Button 
              variant="primary" 
              size="sm"
              onClick={onAddInclusion}
              className="d-flex align-items-center"
            >
              <Plus size={16} className="me-1" />
              Add Inclusion
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {inclusions.length > 0 ? (
            <ListGroup variant="flush">
              {inclusions.map((inclusion, index) => (
                <ListGroup.Item key={inclusion.inclusion_id || index} className="d-flex align-items-center justify-content-between py-3">
                  <div className="d-flex align-items-start flex-grow-1">
                    <Badge bg="success" className="me-3 mt-1 p-2 inclusion-badge">✓</Badge>
                    <div className="flex-grow-1">
                      <span className="fs-6">{inclusion.item}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2 ms-3">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => onEditInclusions(inclusion)}
                      title="Edit Inclusion"
                      className="action-btn"
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDeleteInclusion(inclusion.inclusion_id || index)}
                      title="Delete Inclusion"
                      className="action-btn"
                    >
                      <Trash size={12} />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-3">
                {inclusions ? 'No inclusions listed for this tour.' : 'Loading inclusions...'}
              </p>
              <Button 
                variant="primary"
                onClick={onAddInclusion}
                className="d-flex align-items-center mx-auto"
              >
                <Plus size={16} className="me-2" />
                Add First Inclusion
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Inclusions;