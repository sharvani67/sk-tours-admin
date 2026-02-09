import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DomesticExhibitionTable = ({ exhibitions, onEdit, onDelete, onAddNew, showForm }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Domestic Exhibition</h2>
        <button className="btn btn-primary" onClick={onAddNew}>
          + Add New Exhibition
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Exhibition Name</th>
                  <th>Description</th>
                  <th>City</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exhibitions.map((exhibition) => (
                  <tr key={exhibition.id}>
                    <td>{exhibition.id}</td>
                    <td>{exhibition.name}</td>
                    <td>{exhibition.description.substring(0, 20)}...</td>
                    <td>{exhibition.city}</td>
                    <td>{exhibition.startDate}</td>
                    <td>{exhibition.endDate}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-info me-2" 
                        onClick={() => onEdit(exhibition)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => onDelete(exhibition.id)}
                      >
                        <FaTrash />
                      </button>
                      <button className="btn btn-sm btn-success">
                        Book
                      </button>
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

export default DomesticExhibitionTable;