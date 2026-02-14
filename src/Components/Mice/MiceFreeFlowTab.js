import React from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

const FreeFlowTab = ({ miceFreeFlow, getImageUrl, handleAddNew }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Free Flow Entries</h3>
        <Button variant="success" onClick={handleAddNew}>
          {miceFreeFlow ? 'Edit Free Flow' : 'Add Free Flow'}
        </Button>
      </div>
      
      {miceFreeFlow ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Meeting</th>
              <th>Incentives</th>
              <th>Conference</th>
              <th>Events</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {miceFreeFlow.image && (
                  <img 
                    src={getImageUrl('freeflow', miceFreeFlow.image)}
                    alt="Free Flow" 
                    style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                )}
              </td>
              <td>{miceFreeFlow.meeting_text}</td>
              <td>{miceFreeFlow.incentives_text}</td>
              <td>{miceFreeFlow.conference_text}</td>
              <td>{miceFreeFlow.events_text}</td>
              <td className="actions">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={handleAddNew}
                  className="edit-btn me-2"
                >
                  <FaEdit />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="text-center py-5">
          <p>No Free Flow Entry found.</p>
          <Button variant="primary" onClick={handleAddNew}>
            Create Free Flow Entry
          </Button>
        </div>
      )}
    </div>
  );
};

export default FreeFlowTab;