// import React from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const AboutExhibitionTable = ({ questions, onEdit, onDelete, onAddNew }) => {
//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>Exhibition Questions & Answers</h3>
//         <button className="btn btn-primary" onClick={onAddNew}>
//           + Add New Question
//         </button>
//       </div>

//       <div className="card mb-4">
//         <div className="card-body">
//           <div className="table-responsive">
//             <table className="table table-striped table-hover">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Question</th>
//                   <th>Answer Preview</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {questions.map((item) => (
//                   <tr key={item.id}>
//                     <td>{item.id}</td>
//                     <td>{item.question}</td>
//                     <td>
//                       {item.answer.length > 50 
//                         ? `${item.answer.substring(0, 50)}...` 
//                         : item.answer || 'No answer yet'}
//                     </td>
//                     <td style={{display: "flex"}}>
//                       <button 
//                         className="btn btn-sm btn-info me-2" 
//                         onClick={() => onEdit(item)}
//                       >
//                         <FaEdit />
//                       </button>
//                       <button 
//                         className="btn btn-sm btn-danger" 
//                         onClick={() => onDelete(item.id)}
//                       >
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AboutExhibitionTable;