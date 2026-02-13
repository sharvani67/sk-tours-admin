import React from 'react';
import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const EventsTab = ({ upcomingEvents, getImageUrl, handleDeleteImage, resetForms, setActiveTab, setShowForm }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Upcoming Events</h3>
        <Button variant="success" onClick={() => { resetForms(); setActiveTab('events'); setShowForm(true); }}>
          + Upload Event Images
        </Button>
      </div>
      <div className="image-grid">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div key={event.id} className="image-item">
              <img 
                src={getImageUrl('events', event.image_path)}
                alt="Event"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png';
                }}
              />
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => handleDeleteImage(event.id, 'events')}
                className="delete-btn"
              >
                <FaTrash />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p>No event images found. Click "Upload Event Images" to add some.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsTab;