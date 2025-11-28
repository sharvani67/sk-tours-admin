import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Pencil, Trash, Plus } from 'react-bootstrap-icons';
import "./Itinerary.css"

const Itinerary = ({ itineraries, onAddItinerary, onEditItinerary, onDeleteItinerary, onEditDay }) => {
  return (
    <div className="tab-pane-content">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Tour Itinerary ({itineraries.length} days)</h4>
          <Button 
            variant="primary" 
            size="sm"
            onClick={onAddItinerary}
            className="d-flex align-items-center"
          >
            <Plus size={16} className="me-1" />
            Add Day
          </Button>
        </Card.Header>
        <Card.Body>
          {itineraries.length > 0 ? (
            <div>
              {itineraries.map(itinerary => (
                <Card key={itinerary.itinerary_id} className="mb-3">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <strong>Day {itinerary.day}: {itinerary.title}</strong>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-warning" 
                        size="sm"
                        onClick={() => onEditDay(itinerary)}
                        title="Edit Day"
                        className="action-btn"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => onDeleteItinerary(itinerary.itinerary_id)}
                        title="Delete Day"
                        className="action-btn"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <p><strong>Description:</strong> {itinerary.description || 'No description provided.'}</p>
                    {itinerary.meals && (
                      <p><strong>Meals:</strong> {itinerary.meals}</p>
                    )}
                    {itinerary.accommodation && (
                      <p><strong>Accommodation:</strong> {itinerary.accommodation}</p>
                    )}
                    {itinerary.activities && (
                      <p><strong>Activities:</strong> {itinerary.activities}</p>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-3">No itinerary available for this tour.</p>
              <Button
                variant="outline-primary"
                onClick={onAddItinerary}
                className="d-flex align-items-center mx-auto"
              >
                <Plus size={16} className="me-1" />
                Add First Day
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Itinerary;