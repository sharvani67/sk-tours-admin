import React from 'react';
import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const VenuesTab = ({ venues, getImageUrl, handleDeleteImage, resetForms, setActiveTab, setShowForm }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Venues</h3>
        <Button variant="success" onClick={() => { resetForms(); setActiveTab('venues'); setShowForm(true); }}>
          + Upload Venue Images
        </Button>
      </div>
      <div className="image-grid">
        {venues.length > 0 ? (
          venues.map((venue) => (
            <div key={venue.id} className="image-item">
              <img 
                src={getImageUrl('venues', venue.image_path)}
                alt="Venue"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png';
                }}
              />
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => handleDeleteImage(venue.id, 'venues')}
                className="delete-btn"
              >
                <FaTrash  style={{color:"red"}} />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p>No venue images found. Click "Upload Venue Images" to add some.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesTab;