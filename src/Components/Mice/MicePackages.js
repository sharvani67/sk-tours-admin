import React from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PackagesTab = ({ samplePackages, getImageUrl, handleAddNew, handleDeletePackage, fetchPackage }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Sample Packages</h3>
        <Button variant="success" onClick={handleAddNew}>
          + Add New Package
        </Button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Days</th>
            <th>Price</th>
            <th>Images</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {samplePackages.length > 0 ? (
            samplePackages.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.days} Days</td>
                <td>₹{item.price}</td>
                <td>
                  {item.images && item.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {item.images.slice(0, 3).map((img, idx) => (
                        <img 
                          key={idx}
                          src={getImageUrl('packages', img.image_path)}
                          alt="Package" 
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.png';
                          }}
                        />
                      ))}
                      {item.images.length > 3 && <span>+{item.images.length - 3}</span>}
                    </div>
                  )}
                </td>
                <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                <td className="actions">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => fetchPackage(item.id)}
                    className="edit-btn me-2"
                  >
                    <FaEdit />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDeletePackage(item.id)}
                    className="delete-btn"
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No packages found. Click "Add New Package" to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PackagesTab;