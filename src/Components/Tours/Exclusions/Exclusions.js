import React from 'react';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { Pencil, Trash, Plus } from 'react-bootstrap-icons';
import "./Exclusions.css"

const Exclusions = ({ exclusions = [], onEditExclusions, onAddExclusion, onDeleteExclusion }) => {
  return (
    <div className="tab-pane-content">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            Tour Exclusions ({exclusions.length})
          </h4>
          <div className="d-flex gap-2">
            {/* <Button 
              variant="outline-primary" 
              size="sm"
              onClick={onEditExclusions}
              className="d-flex align-items-center"
            >
              <Pencil size={16} className="me-1" />
              Bulk Edit
            </Button> */}
            <Button 
              variant="primary" 
              size="sm"
              onClick={onAddExclusion}
              className="d-flex align-items-center"
            >
              <Plus size={16} className="me-1" />
              Add Exclusion
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {exclusions.length > 0 ? (
            <ListGroup variant="flush">
              {exclusions.map((exclusion, index) => (
                <ListGroup.Item key={exclusion.exclusion_id || index} className="d-flex align-items-center justify-content-between py-3">
                  <div className="d-flex align-items-start flex-grow-1">
                    <Badge bg="danger" className="me-3 mt-1 p-2 exclusion-badge">✗</Badge>
                    <div className="flex-grow-1">
                      <span className="fs-6">{exclusion.item}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2 ms-3">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => onEditExclusions(exclusion)}
                      title="Edit Exclusion"
                      className="action-btn"
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDeleteExclusion(exclusion.exclusion_id || index)}
                      title="Delete Exclusion"
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
              <p className="text-muted mb-3">No exclusions listed for this tour.</p>
              <Button 
                variant="primary"
                onClick={onAddExclusion}
                className="d-flex align-items-center mx-auto"
              >
                <Plus size={16} className="me-2" />
                Add First Exclusion
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Exclusions;