import React from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { Pencil, Trash, Plus } from 'react-bootstrap-icons';
import "./Departures.css"

const Departures = ({ departures, onAddDeparture, onEditDeparture, onDeleteDeparture, onEditDepartures }) => {
  return (
    <div className="tab-pane-content">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Departure Dates ({departures.length})</h4>
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              size="sm"
              onClick={onAddDeparture}
              className="d-flex align-items-center"
            >
              <Plus size={16} className="me-1" />
              Add Departure
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {departures.length > 0 ? (
            <div className="table-responsive">
              <Table striped>
                <thead>
                  <tr>
                    <th>Departure Date</th>
                    <th>Return Date</th>
                    <th>Total Seats</th>
                    <th>Booked Seats</th>
                    <th>Available Seats</th>
                    <th>Adult Price</th>
                    <th>Child Price</th>
                    <th>Infant Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departures.map(departure => (
                    <tr key={departure.departure_id}>
                      <td>{new Date(departure.departure_date).toLocaleDateString()}</td>
                      <td>{new Date(departure.return_date).toLocaleDateString()}</td>
                      <td>{departure.total_seats}</td>
                      <td>{departure.booked_seats}</td>
                      <td>
                        <Badge bg={departure.available_seats > 0 ? 'success' : 'danger'}>
                          {departure.available_seats || (departure.total_seats - departure.booked_seats)}
                        </Badge>
                      </td>
                      <td>₹{departure.adult_price}</td>
                      <td>{departure.child_price ? `₹${departure.child_price}` : 'N/A'}</td>
                      <td>{departure.infant_price ? `₹${departure.infant_price}` : 'N/A'}</td>
                      <td>
                        <Badge bg={departure.status === 'Available' ? 'success' : 'warning'}>
                          {departure.status || 'Available'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => onEditDeparture(departure)}
                            title="Edit Departure"
                            className="action-btn"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDeleteDeparture(departure.departure_id)}
                            title="Delete Departure"
                            className="action-btn"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-3">No departure dates available for this tour.</p>
              <Button
                variant="outline-primary"
                onClick={onAddDeparture}
                className="d-flex align-items-center mx-auto"
              >
                <Plus size={16} className="me-1" />
                Add First Departure
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Departures;