import React from 'react';

const InternationalExhibitionTable = ({ exhibitions, onEdit, onDelete, onAddNew, showForm }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>International Exhibition</h2>
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
                  <th>Country</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exhibitions.map((exhibition) => (
                  <tr key={exhibition.id}>
                    <td>{exhibition.id}</td>
                    <td>{exhibition.name}</td>
                    <td>{exhibition.country}</td>
                    <td>{exhibition.startDate}</td>
                    <td>{exhibition.endDate}</td>
                    <td>{exhibition.description.substring(0, 30)}...</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-info me-2" 
                        onClick={() => onEdit(exhibition)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => onDelete(exhibition.id)}
                      >
                        Delete
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

export default InternationalExhibitionTable;