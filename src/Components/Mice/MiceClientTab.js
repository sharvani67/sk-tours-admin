import React from 'react';
import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const ClientsTab = ({ 
  ourClients, 
  getImageUrl, 
  handleDeleteImage, 
  resetForms, 
  setActiveTab, 
  setShowForm 
}) => {
  const handleAddClick = () => {
    // Check if all required functions exist
    if (typeof resetForms !== 'function') {
      console.error('resetForms is not a function', resetForms);
      return;
    }
    
    if (typeof setActiveTab !== 'function') {
      console.error('setActiveTab is not a function', setActiveTab);
      return;
    }
    
    if (typeof setShowForm !== 'function') {
      console.error('setShowForm is not a function', setShowForm);
      return;
    }
    
    // All functions exist, proceed
    resetForms();
    setActiveTab('clients');
    setShowForm(true);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Our Clients</h3>
        <Button variant="success" onClick={handleAddClick}>
          + Upload Client Images
        </Button>
      </div>
      <div className="image-grid">
        {ourClients && ourClients.length > 0 ? (
          ourClients.map((client) => (
            <div key={client.id} className="image-item">
              <img 
                src={getImageUrl('clients', client.image_path)}
                alt="Client"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png';
                }}
              />
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => {
                  if (typeof handleDeleteImage === 'function') {
                    handleDeleteImage(client.id, 'clients');
                  } else {
                    console.error('handleDeleteImage is not a function');
                  }
                }}
                className="delete-btn"
              >
                <FaTrash style={{color:"red"}} />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p>No client images found. Click "Upload Client Images" to add some.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsTab;