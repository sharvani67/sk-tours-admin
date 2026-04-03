// DomesticMiceTab.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';

const DomesticMiceTab = ({ 
  domesticMice, 
  getImageUrl, 
  handleAddNew, 
  handleDeleteDomestic,
  goToDomesticDetails,
  fetchDomesticMice
}) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Domestic Mice</h3>
        <Button variant="success" onClick={handleAddNew}>
          <FaPlus /> Add Domestic Mice
        </Button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>City Name</th>
            <th>State Name</th>
            <th>Price (₹)</th>
            <th>Image</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {domesticMice && domesticMice.length > 0 ? (
            domesticMice.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td><strong>{item.city_name || 'N/A'}</strong></td>
                <td>{item.state_name || 'N/A'}</td>
                <td>₹{parseFloat(item.price).toLocaleString('en-IN')}</td>
                <td>
                  {item.image ? (
                    <img 
                      src={getImageUrl('domestic', item.image)} 
                      alt={item.city_name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <span className="text-muted">No image</span>
                  )}
                </td>
                <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                <td className="actions">
                  <Button 
                    variant="outline-info" 
                    size="sm"
                    onClick={() => goToDomesticDetails(item.id)}
                    className="view-btn me-2"
                    title="View/Edit Full Details"
                  >
                    <FaEye />
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => fetchDomesticMice(item.id)}
                    className="edit-btn me-2"
                    title="Edit Basic Details"
                  >
                    <FaEdit />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDeleteDomestic(item.id)}
                    className="delete-btn"
                    title="Delete"
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No domestic mice found. Click "Add Domestic Mice" to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DomesticMiceTab;