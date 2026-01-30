import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AboutMiceTable = ({ questions, onEdit, onDelete, onAddNew }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>MICE Questions & Answers</h3>
        <button className="btn btn-primary" onClick={onAddNew}>
          <i className="fas fa-plus me-2"></i>Add New Question
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Question</th>
                  <th>Answer Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((item) => (
                  <tr key={item.id}>
                    <td><span className="badge bg-secondary">{item.id}</span></td>
                    <td className="fw-semibold">{item.question}</td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        {item.answer || 'No answer yet'}
                      </div>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-sm btn-info me-2" 
                          onClick={() => onEdit(item)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => onDelete(item.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
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

export default AboutMiceTable;