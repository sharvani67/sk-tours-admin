import React from 'react';
import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const GalleryTab = ({ miceGallery, getImageUrl, handleDeleteImage, resetForms, setActiveTab, setShowForm }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>MICE Gallery</h3>
        <Button variant="success" onClick={() => { resetForms(); setActiveTab('gallery'); setShowForm(true); }}>
          + Upload Gallery Images
        </Button>
      </div>
      <div className="image-grid">
        {miceGallery.length > 0 ? (
          miceGallery.map((image) => (
            <div key={image.id} className="image-item">
              <img 
                src={getImageUrl('gallery', image.image_path)}
                alt="Gallery"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png';
                }}
              />
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => handleDeleteImage(image.id, 'gallery')}
                className="delete-btn"
              >
                <FaTrash />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p>No gallery images found. Click "Upload Gallery Images" to add some.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryTab;