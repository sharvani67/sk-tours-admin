import React from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

const MiceMainTab = ({ miceMain, getImageUrl, handleAddNew }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>MICE Main Page</h3>
        <Button variant="success" onClick={handleAddNew}>
          {miceMain ? 'Edit MICE Main' : 'Add MICE Main'}
        </Button>
      </div>
      
      {miceMain ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Banner Image</th>
              <th>Questions</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img 
                  src={getImageUrl('main', miceMain.banner_image)}
                  alt="Banner" 
                  style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              </td>
              <td>{miceMain.questions?.length || 0}</td>
              <td>{miceMain.updated_at ? new Date(miceMain.updated_at).toLocaleDateString() : 'N/A'}</td>
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
          <p>No MICE Main data found.</p>
          <Button variant="primary" onClick={handleAddNew}>
            Create MICE Main
          </Button>
        </div>
      )}
    </div>
  );
};

export default MiceMainTab;