import React from 'react';

const MiceInternationalTable = ({ miceEvents, onEdit, onDelete, onAddNew, onBookNow }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>International MICE Events</h2>
        <button className="btn btn-primary" onClick={onAddNew}>
          <i className="fas fa-plus me-2"></i>Add New MICE Event
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Event Name</th>
                  <th>Country</th>
                  <th>Category</th>
                  <th>Dates</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {miceEvents.map((event) => (
                  <tr key={event.id}>
                    <td><span className="badge bg-secondary">{event.id}</span></td>
                    <td className="fw-semibold">{event.name}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {event.country}
                      </span>
                    </td>
                    <td><span className="badge bg-info">{event.category}</span></td>
                    <td>
                      {event.startDate} to {event.endDate}
                    </td>
                    <td>{event.participants}</td>
                    <td>
                      <span className={`badge ${event.status === 'Upcoming' ? 'bg-success' : 'bg-secondary'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-sm btn-info me-1" 
                          onClick={() => onEdit(event)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger me-1"
                          onClick={() => onDelete(event.id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-success me-1"
                          onClick={() => onBookNow(event.id)}
                          title="Book Now"
                        >
                          <i className="fas fa-calendar-check"></i>
                        </button>
                        <button className="btn btn-sm btn-secondary" title="Download">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiceInternationalTable;