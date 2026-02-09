import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DomesticExhibitionTable from './DomesticExhibitionTable';

const DomesticExhibition = () => {
  const navigate = useNavigate();
  
  // Sample data
  const [exhibitions, setExhibitions] = useState([
    { id: 'DOME00001', name: 'Agriculture Exhibition', city: 'Mumbai', startDate: '2024-03-01', endDate: '2024-03-05', description: 'Agriculture and farming exhibition' },
    { id: 'DOME00002', name: 'Pharmaceutical Expo', city: 'Delhi', startDate: '2024-04-10', endDate: '2024-04-15', description: 'Pharmaceutical industry exhibition' },
    { id: 'DOME00003', name: 'Textile Fair', city: 'Chennai', startDate: '2024-05-20', endDate: '2024-05-25', description: 'Textile and fashion exhibition' },
  ]);

  const handleEdit = (exhibition) => {
    navigate(`/exhibition/domestic/edit/${exhibition.id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this exhibition?')) {
      setExhibitions(exhibitions.filter(ex => ex.id !== id));
    }
  };

  const handleAddNew = () => {
    navigate('/exhibition/domestic/new');
  };

  return (
    <div className="domestic-exhibition">
      <DomesticExhibitionTable 
        exhibitions={exhibitions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />
    </div>
  );
};

export default DomesticExhibition;