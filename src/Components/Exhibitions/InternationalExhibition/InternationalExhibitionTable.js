import React from 'react';

function InternationalExhibitionTable({ exhibitions, onAddNew, onEdit, onDelete }) {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>International Exhibitions</h3>
        <button onClick={onAddNew} className="add-new-btn">
          + Add New International Exhibition
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Countries</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exhibitions.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.countries.join(', ')}</td>
              <td>{item.lastUpdated}</td>
              <td className="actions">
                <button onClick={() => onEdit(item.id)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => onDelete(item.id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InternationalExhibitionTable;