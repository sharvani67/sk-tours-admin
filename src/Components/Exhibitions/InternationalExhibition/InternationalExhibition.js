// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import InternationalExhibitionTable from './InternationalExhibitionTable';

// const InternationalExhibition = () => {
//   const navigate = useNavigate();
  
//   // Sample data
//   const [exhibitions, setExhibitions] = useState([
//     { id: 'INTE00001', name: 'ATM Expo Dubai', country: 'Dubai', startDate: '2024-03-15', endDate: '2024-03-20', description: 'ATM and banking technology exhibition' },
//     { id: 'INTE00002', name: 'Gulf Food Exhibition', country: 'Dubai', startDate: '2024-04-05', endDate: '2024-04-10', description: 'Food and beverage exhibition' },
//     { id: 'INTE00003', name: 'Pharma Germany', country: 'Germany', startDate: '2024-05-12', endDate: '2024-05-17', description: 'Pharmaceutical exhibition' },
//   ]);

//   const handleEdit = (exhibition) => {
//     navigate(`/exhibition/international/edit/${exhibition.id}`);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this exhibition?')) {
//       setExhibitions(exhibitions.filter(ex => ex.id !== id));
//     }
//   };

//   const handleAddNew = () => {
//     navigate('/exhibition/international/new');
//   };

//   return (
//     <div className="international-exhibition">
//       <InternationalExhibitionTable 
//         exhibitions={exhibitions}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         onAddNew={handleAddNew}
//       />
//     </div>
//   );
// };

// export default InternationalExhibition;