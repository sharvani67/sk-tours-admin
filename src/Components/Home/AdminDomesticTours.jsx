// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Edit, 
//   Trash2, 
//   Eye, 
//   EyeOff, 
//   ArrowUp, 
//   ArrowDown, 
//   Plus, 
//   Search, 
//   Filter,
//   Download,
//   Upload,
//   RefreshCw,
//   Check,
//   X
// } from 'lucide-react';
// import './AdminDomesticTours.css';

// const API_URL = 'http://localhost:5000/api';

// const AdminDomesticTours = () => {
//   const [tours, setTours] = useState([]);
//   const [filteredTours, setFilteredTours] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [stats, setStats] = useState(null);
  
//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editingTour, setEditingTour] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     location: '',
//     duration: '',
//     price: '',
//     image: '',
//     travelers: 0,
//     tour_id: '',
//     emi: '',
//     tour_type: 'individual',
//     is_active: true,
//     display_order: 0
//   });
  
//   // Filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
  
//   // Load all tours
//   const loadTours = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await axios.get(`${API_URL}/domestic-tours/admin`);
//       if (response.data.success) {
//         setTours(response.data.data);
//         setFilteredTours(response.data.data);
//       }
//     } catch (err) {
//       setError('Failed to load tours: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Load statistics
//   const loadStats = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/domestic-tours/stats/overview`);
//       if (response.data.success) {
//         setStats(response.data.data);
//       }
//     } catch (err) {
//       console.error('Failed to load stats:', err);
//     }
//   };
  
//   useEffect(() => {
//     loadTours();
//     loadStats();
//   }, []);
  
//   // Apply filters
//   useEffect(() => {
//     let result = tours;
    
//     // Filter by search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(tour => 
//         tour.name.toLowerCase().includes(term) ||
//         tour.location.toLowerCase().includes(term) ||
//         tour.tour_id.toLowerCase().includes(term)
//       );
//     }
    
//     // Filter by tour type
//     if (filterType !== 'all') {
//       result = result.filter(tour => tour.tour_type === filterType);
//     }
    
//     // Filter by status
//     if (filterStatus !== 'all') {
//       const activeStatus = filterStatus === 'active';
//       result = result.filter(tour => tour.is_active === activeStatus);
//     }
    
//     setFilteredTours(result);
//   }, [tours, searchTerm, filterType, filterStatus]);
  
//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };
  
//   // Generate tour ID based on type
//   const generateTourId = () => {
//     const prefix = formData.tour_type === 'individual' ? 'DOMI' : 'DOMG';
//     const randomNum = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
//     return `${prefix}${randomNum}`;
//   };
  
//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Auto-generate tour_id if empty
//       const dataToSubmit = { ...formData };
//       if (!dataToSubmit.tour_id) {
//         dataToSubmit.tour_id = generateTourId();
//       }
      
//       let response;
//       if (editingTour) {
//         // Update existing tour
//         response = await axios.put(
//           `${API_URL}/domestic-tours/${editingTour.id}`,
//           dataToSubmit
//         );
//       } else {
//         // Create new tour
//         response = await axios.post(
//           `${API_URL}/domestic-tours`,
//           dataToSubmit
//         );
//       }
      
//       if (response.data.success) {
//         // Reset form and reload data
//         setShowForm(false);
//         setEditingTour(null);
//         setFormData({
//           name: '',
//           location: '',
//           duration: '',
//           price: '',
//           image: '',
//           travelers: 0,
//           tour_id: '',
//           emi: '',
//           tour_type: 'individual',
//           is_active: true,
//           display_order: 0
//         });
        
//         loadTours();
//         loadStats();
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save tour');
//     }
//   };
  
//   // Handle edit
//   const handleEdit = (tour) => {
//     setEditingTour(tour);
//     setFormData({
//       name: tour.name,
//       location: tour.location,
//       duration: tour.duration,
//       price: tour.price,
//       image: tour.image,
//       travelers: tour.travelers,
//       tour_id: tour.tour_id,
//       emi: tour.emi,
//       tour_type: tour.tour_type,
//       is_active: tour.is_active,
//       display_order: tour.display_order
//     });
//     setShowForm(true);
//   };
  
//   // Handle delete
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this tour?')) return;
    
//     try {
//       const response = await axios.delete(`${API_URL}/domestic-tours/${id}`);
//       if (response.data.success) {
//         loadTours();
//         loadStats();
//       }
//     } catch (err) {
//       setError('Failed to delete tour: ' + err.message);
//     }
//   };
  
//   // Handle toggle status
//   const handleToggleStatus = async (id, currentStatus) => {
//     try {
//       const response = await axios.patch(`${API_URL}/domestic-tours/${id}/toggle-status`);
//       if (response.data.success) {
//         loadTours();
//         loadStats();
//       }
//     } catch (err) {
//       setError('Failed to update status: ' + err.message);
//     }
//   };
  
//   // Handle reordering
//   const handleMoveUp = async (index) => {
//     if (index === 0) return;
    
//     const updatedTours = [...filteredTours];
//     const temp = updatedTours[index];
//     updatedTours[index] = updatedTours[index - 1];
//     updatedTours[index - 1] = temp;
    
//     // Update display_order based on new position
//     const toursWithOrder = updatedTours.map((tour, idx) => ({
//       ...tour,
//       display_order: idx
//     }));
    
//     try {
//       const response = await axios.put(
//         `${API_URL}/domestic-tours/reorder/display-order`,
//         { tours: toursWithOrder }
//       );
      
//       if (response.data.success) {
//         loadTours();
//       }
//     } catch (err) {
//       setError('Failed to reorder tours: ' + err.message);
//     }
//   };
  
//   const handleMoveDown = async (index) => {
//     if (index === filteredTours.length - 1) return;
    
//     const updatedTours = [...filteredTours];
//     const temp = updatedTours[index];
//     updatedTours[index] = updatedTours[index + 1];
//     updatedTours[index + 1] = temp;
    
//     // Update display_order based on new position
//     const toursWithOrder = updatedTours.map((tour, idx) => ({
//       ...tour,
//       display_order: idx
//     }));
    
//     try {
//       const response = await axios.put(
//         `${API_URL}/domestic-tours/reorder/display-order`,
//         { tours: toursWithOrder }
//       );
      
//       if (response.data.success) {
//         loadTours();
//       }
//     } catch (err) {
//       setError('Failed to reorder tours: ' + err.message);
//     }
//   };
  
//   // Handle CSV export
//   const handleExportCSV = () => {
//     const headers = ['ID', 'Name', 'Location', 'Duration', 'Price', 'Travelers', 'Tour ID', 'EMI', 'Type', 'Status', 'Order'];
//     const csvRows = [
//       headers.join(','),
//       ...filteredTours.map(tour => [
//         tour.id,
//         `"${tour.name}"`,
//         `"${tour.location}"`,
//         `"${tour.duration}"`,
//         `"${tour.price}"`,
//         tour.travelers,
//         `"${tour.tour_id}"`,
//         `"${tour.emi || ''}"`,
//         tour.tour_type,
//         tour.is_active ? 'Active' : 'Inactive',
//         tour.display_order
//       ].join(','))
//     ];
    
//     const csvString = csvRows.join('\n');
//     const blob = new Blob([csvString], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'domestic-tours.csv';
//     a.click();
//   };

//   return (
//     <div className="admin-domestic-tours">
//       <div className="header-content">
//         <div className="header-main">
//           <div className="header-title">
//             <h1>Domestic Tours Management</h1>
//             <p>Manage individual and group tours</p>
//           </div>
//           <button
//             onClick={() => {
//               setEditingTour(null);
//               setFormData({
//                 name: '',
//                 location: '',
//                 duration: '',
//                 price: '',
//                 image: '',
//                 travelers: 0,
//                 tour_id: '',
//                 emi: '',
//                 tour_type: 'individual',
//                 is_active: true,
//                 display_order: 0
//               });
//               setShowForm(true);
//             }}
//             className="btn btn-primary"
//           >
//             <Plus className="icon" />
//             Add New Tour
//           </button>
//         </div>
        
//         {/* Stats Cards */}
//         {stats && (
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-value">{stats.overview.total_tours}</div>
//               <div className="stat-label">Total Tours</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value" style={{ color: '#10b981' }}>{stats.overview.individual_tours}</div>
//               <div className="stat-label">Individual Tours</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.overview.group_tours}</div>
//               <div className="stat-label">Group Tours</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value" style={{ color: '#0d6efd' }}>{stats.overview.active_tours}</div>
//               <div className="stat-label">Active Tours</div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Error Message */}
//       {error && (
//         <div className="error-message">
//           <div className="error-icon">!</div>
//           <p>{error}</p>
//         </div>
//       )}
      
//       {/* Filters */}
//       <div className="filters-container">
//         <div className="filters-content">
//           <div className="search-container">
//             <Search className="search-icon" />
//             <input
//               type="text"
//               placeholder="Search tours by name, location, or ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//           </div>
          
//           <div className="filters-actions">
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="select"
//             >
//               <option value="all">All Types</option>
//               <option value="individual">Individual</option>
//               <option value="group">Group</option>
//             </select>
            
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="select"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
            
//             <button
//               onClick={handleExportCSV}
//               className="btn btn-success"
//             >
//               <Download className="icon" />
//               Export
//             </button>
            
//             <button
//               onClick={() => {
//                 loadTours();
//                 loadStats();
//               }}
//               className="btn btn-gray"
//             >
//               <RefreshCw className="icon" />
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Tours Table */}
//       <div className="table-container">
//         {loading ? (
//           <div className="loading-state">
//             <div className="loading-spinner"></div>
//             <p className="loading-text">Loading tours...</p>
//           </div>
//         ) : filteredTours.length === 0 ? (
//           <div className="empty-state">
//             <p className="empty-text">No tours found. {searchTerm && 'Try adjusting your search.'}</p>
//           </div>
//         ) : (
//           <div className="table-wrapper">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Order</th>
//                   <th>Tour Details</th>
//                   <th>Price & EMI</th>
//                   <th>Type & Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTours.map((tour, index) => (
//                   <tr key={tour.id}>
//                     <td className="order-cell">
//                       <div className="order-controls">
//                         <button
//                           onClick={() => handleMoveUp(index)}
//                           disabled={index === 0}
//                           className="order-btn"
//                         >
//                           <ArrowUp className="icon" />
//                         </button>
//                         <span className="order-value">{tour.display_order + 1}</span>
//                         <button
//                           onClick={() => handleMoveDown(index)}
//                           disabled={index === filteredTours.length - 1}
//                           className="order-btn"
//                         >
//                           <ArrowDown className="icon" />
//                         </button>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="tour-details">
//                         <img
//                           src={tour.image}
//                           alt={tour.name}
//                           className="tour-image"
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/150';
//                           }}
//                         />
//                         <div className="tour-info">
//                           <h3>{tour.name}</h3>
//                           <div className="tour-meta">
//                             <span>📍 {tour.location}</span>
//                             <span>•</span>
//                             <span>⏱️ {tour.duration}</span>
//                           </div>
//                           <div className="tour-extra">
//                             <p>ID: {tour.tour_id}</p>
//                             <p>Travelers: {tour.travelers.toLocaleString()}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="price-info">
//                         <div className="price-value">{tour.price}</div>
//                         <div className="emi-value">
//                           EMI: {tour.emi || 'Not set'}
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="type-status">
//                         <span className={`type-badge ${tour.tour_type === 'individual' ? 'type-individual' : 'type-group'}`}>
//                           {tour.tour_type === 'individual' ? 'Individual' : 'Group'}
//                         </span>
//                         <div className="status-indicator">
//                           <div className={`status-dot ${tour.is_active ? 'active' : 'inactive'}`} />
//                           <span className={`status-text ${tour.is_active ? 'active' : 'inactive'}`}>
//                             {tour.is_active ? 'Active' : 'Inactive'}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="action-buttons">
//                         <button
//                           onClick={() => handleToggleStatus(tour.id, tour.is_active)}
//                           className={`action-btn ${tour.is_active ? 'btn-status' : 'btn-status'}`}
//                           title={tour.is_active ? 'Deactivate' : 'Activate'}
//                         >
//                           {tour.is_active ? <EyeOff className="icon" /> : <Eye className="icon" />}
//                         </button>
//                         <button
//                           onClick={() => handleEdit(tour)}
//                           className="action-btn btn-edit"
//                           title="Edit"
//                         >
//                           <Edit className="icon" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(tour.id)}
//                           className="action-btn btn-delete"
//                           title="Delete"
//                         >
//                           <Trash2 className="icon" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
      
//       {/* Tour Form Modal */}
//       {showForm && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header">
//               <h2 className="modal-title">
//                 {editingTour ? 'Edit Tour' : 'Add New Tour'}
//               </h2>
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="modal-close"
//               >
//                 <X className="icon" />
//               </button>
//             </div>
            
//             <div className="modal-content">
//               <form onSubmit={handleSubmit} className="tour-form">
//                 <div className="form-grid">
//                   {/* Name */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Tour Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., Kashmir Great Lakes"
//                     />
//                   </div>
                  
//                   {/* Location */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Location *
//                     </label>
//                     <input
//                       type="text"
//                       name="location"
//                       value={formData.location}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., Kashmir"
//                     />
//                   </div>
                  
//                   {/* Duration */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Duration *
//                     </label>
//                     <input
//                       type="text"
//                       name="duration"
//                       value={formData.duration}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., 8 Days"
//                     />
//                   </div>
                  
//                   {/* Price */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Price *
//                     </label>
//                     <input
//                       type="text"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., ₹25,999"
//                     />
//                   </div>
                  
//                   {/* Tour ID */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Tour ID {!editingTour && ' (Leave empty to auto-generate)'}
//                     </label>
//                     <input
//                       type="text"
//                       name="tour_id"
//                       value={formData.tour_id}
//                       onChange={handleInputChange}
//                       className="form-input"
//                       placeholder="e.g., DOMI00001"
//                       readOnly={editingTour}
//                     />
//                   </div>
                  
//                   {/* Tour Type */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Tour Type
//                     </label>
//                     <select
//                       name="tour_type"
//                       value={formData.tour_type}
//                       onChange={handleInputChange}
//                       className="form-input"
//                     >
//                       <option value="individual">Individual Tour</option>
//                       <option value="group">Group Tour</option>
//                     </select>
//                   </div>
                  
//                   {/* EMI */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       EMI per Month
//                     </label>
//                     <input
//                       type="text"
//                       name="emi"
//                       value={formData.emi}
//                       onChange={handleInputChange}
//                       className="form-input"
//                       placeholder="e.g., ₹2,166"
//                     />
//                   </div>
                  
//                   {/* Travelers */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Number of Travelers
//                     </label>
//                     <input
//                       type="number"
//                       name="travelers"
//                       value={formData.travelers}
//                       onChange={handleInputChange}
//                       min="0"
//                       className="form-input"
//                     />
//                   </div>
                  
//                   {/* Display Order */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Display Order
//                     </label>
//                     <input
//                       type="number"
//                       name="display_order"
//                       value={formData.display_order}
//                       onChange={handleInputChange}
//                       min="0"
//                       className="form-input"
//                     />
//                   </div>
                  
//                   {/* Image URL */}
//                   <div className="form-group full-width">
//                     <label className="form-label">
//                       Image URL *
//                     </label>
//                     <input
//                       type="url"
//                       name="image"
//                       value={formData.image}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="https://example.com/image.jpg"
//                     />
//                     {formData.image && (
//                       <div className="image-preview">
//                         <img
//                           src={formData.image}
//                           alt="Preview"
//                           className="preview-image"
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/400x150';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Active Status */}
//                 <div className="form-checkbox">
//                   <input
//                     type="checkbox"
//                     name="is_active"
//                     id="is_active"
//                     checked={formData.is_active}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor="is_active">
//                     Set as active tour (visible on website)
//                   </label>
//                 </div>
                
//                 {/* Form Actions */}
//                 <div className="form-actions">
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="btn-cancel"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn-submit"
//                   >
//                     {editingTour ? 'Update Tour' : 'Create Tour'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDomesticTours;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Edit, 
//   Trash2, 
//   Eye, 
//   EyeOff, 
//   ArrowUp, 
//   ArrowDown, 
//   Plus, 
//   Search, 
//   Filter,
//   Download,
//   Upload,
//   RefreshCw,
//   Check,
//   X
// } from 'lucide-react';
// import './AdminDomesticTours.css';

// const API_URL = 'http://localhost:5000/api';

// const AdminDomesticTours = () => {
//   const [tours, setTours] = useState([]);
//   const [filteredTours, setFilteredTours] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [stats, setStats] = useState(null);
  
//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editingTour, setEditingTour] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     location: '',
//     duration: '',
//     price: '',
//     image: '',
//     travelers: 0,
//     tour_id: '',
//     emi: '',
//     tour_type: 'individual',
//     is_active: true,
//     display_order: 0
//   });
  
//   // Filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
  
//   // Load all tours
//   const loadTours = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await axios.get(`${API_URL}/domestic-tours/admin`);
//       if (response.data.success) {
//         setTours(response.data.data);
//         setFilteredTours(response.data.data);
//       }
//     } catch (err) {
//       setError('Failed to load tours: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Load statistics
//   const loadStats = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/domestic-tours/stats/overview`);
//       if (response.data.success) {
//         setStats(response.data.data);
//       }
//     } catch (err) {
//       console.error('Failed to load stats:', err);
//     }
//   };
  
//   useEffect(() => {
//     loadTours();
//     loadStats();
//   }, []);
  
//   // Apply filters
//   useEffect(() => {
//     let result = tours;
    
//     // Filter by search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(tour => 
//         tour.name.toLowerCase().includes(term) ||
//         tour.location.toLowerCase().includes(term) ||
//         tour.tour_id.toLowerCase().includes(term)
//       );
//     }
    
//     // Filter by tour type
//     if (filterType !== 'all') {
//       result = result.filter(tour => tour.tour_type === filterType);
//     }
    
//     // Filter by status
//     if (filterStatus !== 'all') {
//       const activeStatus = filterStatus === 'active';
//       result = result.filter(tour => tour.is_active === activeStatus);
//     }
    
//     setFilteredTours(result);
//   }, [tours, searchTerm, filterType, filterStatus]);
  
//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };
  
//   // Get existing tour IDs
//   const getExistingTourIds = () => {
//     return tours.map(tour => tour.tour_id);
//   };
  
//   // Format currency (remove ₹ symbol and commas)
//   const formatCurrency = (value) => {
//     if (!value) return value;
//     return value.toString()
//       .replace('₹', '')
//       .replace(/,/g, '')
//       .trim();
//   };
  
//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
    
//     try {
//       // Prepare data for submission
//       const dataToSubmit = { ...formData };
      
//       // Validate required fields
//       if (!dataToSubmit.tour_id.trim()) {
//         throw new Error('Tour ID is required');
//       }
      
//       if (!dataToSubmit.name.trim()) {
//         throw new Error('Tour Name is required');
//       }
      
//       if (!dataToSubmit.location.trim()) {
//         throw new Error('Location is required');
//       }
      
//       if (!dataToSubmit.duration.trim()) {
//         throw new Error('Duration is required');
//       }
      
//       if (!dataToSubmit.price.trim()) {
//         throw new Error('Price is required');
//       }
      
//       if (!dataToSubmit.image.trim()) {
//         throw new Error('Image URL is required');
//       }
      
//       // Format currency fields
//       dataToSubmit.price = formatCurrency(dataToSubmit.price);
//       if (dataToSubmit.emi) {
//         dataToSubmit.emi = formatCurrency(dataToSubmit.emi);
//       }
      
//       // Convert travelers to number
//       dataToSubmit.travelers = parseInt(dataToSubmit.travelers) || 0;
//       dataToSubmit.display_order = parseInt(dataToSubmit.display_order) || 0;
      
//       // Check for duplicate tour_id (only for new tours)
//       if (!editingTour) {
//         const existingIds = getExistingTourIds();
//         if (existingIds.includes(dataToSubmit.tour_id)) {
//           throw new Error(`Tour ID "${dataToSubmit.tour_id}" already exists. Please use a different ID.`);
//         }
//       }
      
//       let response;
//       if (editingTour) {
//         // Update existing tour
//         response = await axios.put(
//           `${API_URL}/domestic-tours/${editingTour.id}`,
//           dataToSubmit
//         );
//         setSuccess('Tour updated successfully!');
//       } else {
//         // Create new tour
//         response = await axios.post(
//           `${API_URL}/domestic-tours`,
//           dataToSubmit
//         );
//         setSuccess('Tour created successfully!');
//       }
      
//       if (response.data.success) {
//         // Reset form and reload data
//         setTimeout(() => {
//           resetForm();
//           loadTours();
//           loadStats();
//         }, 1000);
//       }
//     } catch (err) {
//       console.error('Error saving tour:', err);
      
//       // Handle specific error cases
//       if (err.response?.data?.message?.includes('Duplicate entry')) {
//         setError('This Tour ID already exists. Please use a different ID.');
//       } else if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else if (err.message) {
//         setError(err.message);
//       } else {
//         setError('Failed to save tour. Please try again.');
//       }
//     }
//   };
  
//   // Reset form
//   const resetForm = () => {
//     setEditingTour(null);
//     setFormData({
//       name: '',
//       location: '',
//       duration: '',
//       price: '',
//       image: '',
//       travelers: 0,
//       tour_id: '',
//       emi: '',
//       tour_type: 'individual',
//       is_active: true,
//       display_order: tours.length
//     });
//     setShowForm(false);
//     setError('');
//     setSuccess('');
//   };
  
//   // Handle edit
//   const handleEdit = (tour) => {
//     setEditingTour(tour);
//     setFormData({
//       name: tour.name,
//       location: tour.location,
//       duration: tour.duration,
//       price: tour.price,
//       image: tour.image,
//       travelers: tour.travelers,
//       tour_id: tour.tour_id,
//       emi: tour.emi || '',
//       tour_type: tour.tour_type,
//       is_active: tour.is_active,
//       display_order: tour.display_order
//     });
//     setShowForm(true);
//   };
  
//   // Handle delete
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')) return;
    
//     try {
//       const response = await axios.delete(`${API_URL}/domestic-tours/${id}`);
//       if (response.data.success) {
//         setSuccess('Tour deleted successfully!');
//         loadTours();
//         loadStats();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to delete tour: ' + err.message);
//     }
//   };
  
//   // Handle toggle status
//   const handleToggleStatus = async (id, currentStatus) => {
//     try {
//       const response = await axios.patch(`${API_URL}/domestic-tours/${id}/toggle-status`);
//       if (response.data.success) {
//         setSuccess(`Tour ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
//         loadTours();
//         loadStats();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to update status: ' + err.message);
//     }
//   };
  
//   // Handle reordering
//   const handleMoveUp = async (index) => {
//     if (index === 0) return;
    
//     const updatedTours = [...filteredTours];
//     const temp = updatedTours[index];
//     updatedTours[index] = updatedTours[index - 1];
//     updatedTours[index - 1] = temp;
    
//     // Update display_order based on new position
//     const toursWithOrder = updatedTours.map((tour, idx) => ({
//       ...tour,
//       display_order: idx
//     }));
    
//     try {
//       const response = await axios.put(
//         `${API_URL}/domestic-tours/reorder/display-order`,
//         { tours: toursWithOrder }
//       );
      
//       if (response.data.success) {
//         setSuccess('Order updated successfully!');
//         loadTours();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to reorder tours: ' + err.message);
//     }
//   };
  
//   const handleMoveDown = async (index) => {
//     if (index === filteredTours.length - 1) return;
    
//     const updatedTours = [...filteredTours];
//     const temp = updatedTours[index];
//     updatedTours[index] = updatedTours[index + 1];
//     updatedTours[index + 1] = temp;
    
//     // Update display_order based on new position
//     const toursWithOrder = updatedTours.map((tour, idx) => ({
//       ...tour,
//       display_order: idx
//     }));
    
//     try {
//       const response = await axios.put(
//         `${API_URL}/domestic-tours/reorder/display-order`,
//         { tours: toursWithOrder }
//       );
      
//       if (response.data.success) {
//         setSuccess('Order updated successfully!');
//         loadTours();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to reorder tours: ' + err.message);
//     }
//   };
  
//   // Handle CSV export
//   const handleExportCSV = () => {
//     const headers = ['ID', 'Name', 'Location', 'Duration', 'Price', 'Travelers', 'Tour ID', 'EMI', 'Type', 'Status', 'Order'];
//     const csvRows = [
//       headers.join(','),
//       ...filteredTours.map(tour => [
//         tour.id,
//         `"${tour.name}"`,
//         `"${tour.location}"`,
//         `"${tour.duration}"`,
//         `"${tour.price}"`,
//         tour.travelers,
//         `"${tour.tour_id}"`,
//         `"${tour.emi || ''}"`,
//         tour.tour_type,
//         tour.is_active ? 'Active' : 'Inactive',
//         tour.display_order
//       ].join(','))
//     ];
    
//     const csvString = csvRows.join('\n');
//     const blob = new Blob([csvString], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `domestic-tours-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   // Auto-hide messages after 5 seconds
//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         if (success) setSuccess('');
//         if (error) setError('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error]);

//   return (
//     <div className="admin-domestic-tours">
//       <div className="header-content">
//         <div className="header-main">
//           <div className="header-title">
//             <h1>Domestic Tours Management</h1>
//             <p>Manage individual and group tours</p>
//           </div>
//           <button
//             onClick={() => {
//               setEditingTour(null);
//               setFormData({
//                 name: '',
//                 location: '',
//                 duration: '',
//                 price: '',
//                 image: '',
//                 travelers: 0,
//                 tour_id: '',
//                 emi: '',
//                 tour_type: 'individual',
//                 is_active: true,
//                 display_order: tours.length
//               });
//               setShowForm(true);
//             }}
//             className="btn btn-primary"
//           >
//             <Plus className="icon" />
//             Add New Tour
//           </button>
//         </div>
        
//         {/* Stats Cards */}
//         {stats && (
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-value">{stats.overview.total_tours}</div>
//               <div className="stat-label">Total Tours</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value" style={{ color: '#10b981' }}>{stats.overview.individual_tours}</div>
//               <div className="stat-label">Individual Tours</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.overview.group_tours}</div>
//               <div className="stat-label">Group Tours</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value" style={{ color: '#0d6efd' }}>{stats.overview.active_tours}</div>
//               <div className="stat-label">Active Tours</div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Success Message */}
//       {success && (
//         <div className="success-message">
//           <div className="success-icon">✓</div>
//           <p>{success}</p>
//         </div>
//       )}
      
//       {/* Error Message */}
//       {error && (
//         <div className="error-message">
//           <div className="error-icon">!</div>
//           <p>{error}</p>
//         </div>
//       )}
      
//       {/* Filters */}
//       <div className="filters-container">
//         <div className="filters-content">
//           <div className="search-container">
//             <Search className="search-icon" />
//             <input
//               type="text"
//               placeholder="Search tours by name, location, or ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//           </div>
          
//           <div className="filters-actions">
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="select"
//             >
//               <option value="all">All Types</option>
//               <option value="individual">Individual</option>
//               <option value="group">Group</option>
//             </select>
            
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="select"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
            
//             <button
//               onClick={handleExportCSV}
//               className="btn btn-success"
//             >
//               <Download className="icon" />
//               Export
//             </button>
            
//             <button
//               onClick={() => {
//                 loadTours();
//                 loadStats();
//                 setSuccess('Data refreshed successfully!');
//                 setTimeout(() => setSuccess(''), 3000);
//               }}
//               className="btn btn-gray"
//             >
//               <RefreshCw className="icon" />
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Tours Table */}
//       <div className="table-container">
//         {loading ? (
//           <div className="loading-state">
//             <div className="loading-spinner"></div>
//             <p className="loading-text">Loading tours...</p>
//           </div>
//         ) : filteredTours.length === 0 ? (
//           <div className="empty-state">
//             <p className="empty-text">No tours found. {searchTerm && 'Try adjusting your search.'}</p>
//           </div>
//         ) : (
//           <div className="table-wrapper">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Order</th>
//                   <th>Tour Details</th>
//                   <th>Price & EMI</th>
//                   <th>Type & Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTours.map((tour, index) => (
//                   <tr key={tour.id}>
//                     <td className="order-cell">
//                       <div className="order-controls">
//                         <button
//                           onClick={() => handleMoveUp(index)}
//                           disabled={index === 0}
//                           className="order-btn"
//                         >
//                           <ArrowUp className="icon" />
//                         </button>
//                         <span className="order-value">{tour.display_order + 1}</span>
//                         <button
//                           onClick={() => handleMoveDown(index)}
//                           disabled={index === filteredTours.length - 1}
//                           className="order-btn"
//                         >
//                           <ArrowDown className="icon" />
//                         </button>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="tour-details">
//                         <img
//                           src={tour.image}
//                           alt={tour.name}
//                           className="tour-image"
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/150';
//                           }}
//                         />
//                         <div className="tour-info">
//                           <h3>{tour.name}</h3>
//                           <div className="tour-meta">
//                             <span>📍 {tour.location}</span>
//                             <span>•</span>
//                             <span>⏱️ {tour.duration}</span>
//                           </div>
//                           <div className="tour-extra">
//                             <p>ID: {tour.tour_id}</p>
//                             <p>Travelers: {tour.travelers.toLocaleString()}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="price-info">
//                         <div className="price-value">₹{tour.price}</div>
//                         <div className="emi-value">
//                           EMI: {tour.emi ? `₹${tour.emi}` : 'Not set'}
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="type-status">
//                         <span className={`type-badge ${tour.tour_type === 'individual' ? 'type-individual' : 'type-group'}`}>
//                           {tour.tour_type === 'individual' ? 'Individual' : 'Group'}
//                         </span>
//                         <div className="status-indicator">
//                           <div className={`status-dot ${tour.is_active ? 'active' : 'inactive'}`} />
//                           <span className={`status-text ${tour.is_active ? 'active' : 'inactive'}`}>
//                             {tour.is_active ? 'Active' : 'Inactive'}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="action-buttons">
//                         <button
//                           onClick={() => handleToggleStatus(tour.id, tour.is_active)}
//                           className={`action-btn ${tour.is_active ? 'btn-status' : 'btn-status'}`}
//                           title={tour.is_active ? 'Deactivate' : 'Activate'}
//                         >
//                           {tour.is_active ? <EyeOff className="icon" /> : <Eye className="icon" />}
//                         </button>
//                         <button
//                           onClick={() => handleEdit(tour)}
//                           className="action-btn btn-edit"
//                           title="Edit"
//                         >
//                           <Edit className="icon" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(tour.id)}
//                           className="action-btn btn-delete"
//                           title="Delete"
//                         >
//                           <Trash2 className="icon" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
      
//       {/* Tour Form Modal */}
//       {showForm && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header">
//               <h2 className="modal-title">
//                 {editingTour ? 'Edit Tour' : 'Add New Tour'}
//               </h2>
//               <button
//                 onClick={resetForm}
//                 className="modal-close"
//               >
//                 <X className="icon" />
//               </button>
//             </div>
            
//             <div className="modal-content">
//               <form onSubmit={handleSubmit} className="tour-form">
//                 <div className="form-grid">
//                   {/* Name */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Tour Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., Kashmir Great Lakes"
//                     />
//                   </div>
                  
//                   {/* Location */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Location *
//                     </label>
//                     <input
//                       type="text"
//                       name="location"
//                       value={formData.location}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., Kashmir"
//                     />
//                   </div>
                  
//                   {/* Duration */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Duration *
//                     </label>
//                     <input
//                       type="text"
//                       name="duration"
//                       value={formData.duration}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., 8 Days"
//                     />
//                   </div>
                  
//                   {/* Price */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Price *
//                     </label>
//                     <input
//                       type="text"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., 25,999"
//                     />
//                   </div>
                  
//                   {/* Tour ID */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Tour ID *
//                     </label>
//                     <input
//                       type="text"
//                       name="tour_id"
//                       value={formData.tour_id}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., DOMI00001"
//                     />
//                     <small className="form-help">
//                       Enter unique Tour ID (e.g., DOMI00001 for Individual, DOMG00001 for Group)
//                     </small>
//                   </div>
                  
//                   {/* Tour Type */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Tour Type *
//                     </label>
//                     <select
//                       name="tour_type"
//                       value={formData.tour_type}
//                       onChange={handleInputChange}
//                       className="form-input"
//                       required
//                     >
//                       <option value="individual">Individual Tour</option>
//                       <option value="group">Group Tour</option>
//                     </select>
//                   </div>
                  
//                   {/* EMI */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       EMI per Month
//                     </label>
//                     <input
//                       type="text"
//                       name="emi"
//                       value={formData.emi}
//                       onChange={handleInputChange}
//                       className="form-input"
//                       placeholder="e.g., 2,166"
//                     />
//                   </div>
                  
//                   {/* Travelers */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Number of Travelers
//                     </label>
//                     <input
//                       type="number"
//                       name="travelers"
//                       value={formData.travelers}
//                       onChange={handleInputChange}
//                       min="0"
//                       className="form-input"
//                     />
//                   </div>
                  
//                   {/* Display Order */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Display Order
//                     </label>
//                     <input
//                       type="number"
//                       name="display_order"
//                       value={formData.display_order}
//                       onChange={handleInputChange}
//                       min="0"
//                       className="form-input"
//                     />
//                   </div>
                  
//                   {/* Image URL */}
//                   <div className="form-group full-width">
//                     <label className="form-label">
//                       Image URL *
//                     </label>
//                     <input
//                       type="url"
//                       name="image"
//                       value={formData.image}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="https://example.com/image.jpg"
//                     />
//                     {formData.image && (
//                       <div className="image-preview">
//                         <img
//                           src={formData.image}
//                           alt="Preview"
//                           className="preview-image"
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/400x150';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Active Status */}
//                 <div className="form-checkbox">
//                   <input
//                     type="checkbox"
//                     name="is_active"
//                     id="is_active"
//                     checked={formData.is_active}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor="is_active">
//                     Set as active tour (visible on website)
//                   </label>
//                 </div>
                
//                 {/* Form Actions */}
//                 <div className="form-actions">
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="btn-cancel"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn-submit"
//                   >
//                     {editingTour ? 'Update Tour' : 'Create Tour'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDomesticTours;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Edit, 
//   Trash2, 
//   Eye, 
//   EyeOff, 
//   ArrowUp, 
//   ArrowDown, 
//   Plus, 
//   Search, 
//   Filter,
//   Download,
//   Upload,
//   RefreshCw,
//   Check,
//   X
// } from 'lucide-react';
// import './AdminDomesticTours.css';
// import AdminLayout from '../../Shared/Navbar/Navbar';
// // Import baseurl from your config file
// import { baseurl } from '../../Api/Baseurl'; // Adjust path as needed

// const API_URL = `${baseurl}/api`;

// const AdminDomesticTours = () => {
//   const [tours, setTours] = useState([]);
//   const [filteredTours, setFilteredTours] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [stats, setStats] = useState(null);
  
//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editingTour, setEditingTour] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     location: '',
//     duration: '',
//     price: '',
//     image: '',
//     travelers: 0,
//     tour_id: '',
//     emi: '',
//     tour_type: 'individual',
//     is_active: true,
//     display_order: 0
//   });
  
//   // Filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
  
//   // Load all tours
//   const loadTours = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await axios.get(`${API_URL}/domestic-tours/admin`);
//       if (response.data.success) {
//         setTours(response.data.data);
//         setFilteredTours(response.data.data);
//       }
//     } catch (err) {
//       setError('Failed to load tours: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Load statistics
//   const loadStats = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/domestic-tours/stats/overview`);
//       if (response.data.success) {
//         setStats(response.data.data);
//       }
//     } catch (err) {
//       console.error('Failed to load stats:', err);
//     }
//   };
  
//   useEffect(() => {
//     loadTours();
//     loadStats();
//   }, []);
  
//   // Apply filters
//   useEffect(() => {
//     let result = tours;
    
//     // Filter by search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(tour => 
//         tour.name.toLowerCase().includes(term) ||
//         tour.location.toLowerCase().includes(term) ||
//         tour.tour_id.toLowerCase().includes(term)
//       );
//     }
    
//     // Filter by tour type
//     if (filterType !== 'all') {
//       result = result.filter(tour => tour.tour_type === filterType);
//     }
    
//     // Filter by status
//     if (filterStatus !== 'all') {
//       const activeStatus = filterStatus === 'active';
//       result = result.filter(tour => tour.is_active === activeStatus);
//     }
    
//     setFilteredTours(result);
//   }, [tours, searchTerm, filterType, filterStatus]);
  
//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };
  
//   // Get existing tour IDs
//   const getExistingTourIds = () => {
//     return tours.map(tour => tour.tour_id);
//   };
  
//   // Format currency (remove ₹ symbol and commas)
//   const formatCurrency = (value) => {
//     if (!value) return value;
//     return value.toString()
//       .replace('₹', '')
//       .replace(/,/g, '')
//       .trim();
//   };
  
//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
    
//     try {
//       // Prepare data for submission
//       const dataToSubmit = { ...formData };
      
//       // Validate required fields
//       if (!dataToSubmit.tour_id.trim()) {
//         throw new Error('Tour ID is required');
//       }
      
//       if (!dataToSubmit.name.trim()) {
//         throw new Error('Tour Name is required');
//       }
      
//       if (!dataToSubmit.location.trim()) {
//         throw new Error('Location is required');
//       }
      
//       if (!dataToSubmit.duration.trim()) {
//         throw new Error('Duration is required');
//       }
      
//       if (!dataToSubmit.price.trim()) {
//         throw new Error('Price is required');
//       }
      
//       if (!dataToSubmit.image.trim()) {
//         throw new Error('Image URL is required');
//       }
      
//       // Format currency fields
//       dataToSubmit.price = formatCurrency(dataToSubmit.price);
//       if (dataToSubmit.emi) {
//         dataToSubmit.emi = formatCurrency(dataToSubmit.emi);
//       }
      
//       // Convert travelers to number
//       dataToSubmit.travelers = parseInt(dataToSubmit.travelers) || 0;
//       dataToSubmit.display_order = parseInt(dataToSubmit.display_order) || 0;
      
//       // Check for duplicate tour_id (only for new tours)
//       if (!editingTour) {
//         const existingIds = getExistingTourIds();
//         if (existingIds.includes(dataToSubmit.tour_id)) {
//           throw new Error(`Tour ID "${dataToSubmit.tour_id}" already exists. Please use a different ID.`);
//         }
//       }
      
//       let response;
//       if (editingTour) {
//         // Update existing tour
//         response = await axios.put(
//           `${API_URL}/domestic-tours/${editingTour.id}`,
//           dataToSubmit
//         );
//         setSuccess('Tour updated successfully!');
//       } else {
//         // Create new tour
//         response = await axios.post(
//           `${API_URL}/domestic-tours`,
//           dataToSubmit
//         );
//         setSuccess('Tour created successfully!');
//       }
      
//       if (response.data.success) {
//         // Reset form and reload data
//         setTimeout(() => {
//           resetForm();
//           loadTours();
//           loadStats();
//         }, 1000);
//       }
//     } catch (err) {
//       console.error('Error saving tour:', err);
      
//       // Handle specific error cases
//       if (err.response?.data?.message?.includes('Duplicate entry')) {
//         setError('This Tour ID already exists. Please use a different ID.');
//       } else if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else if (err.message) {
//         setError(err.message);
//       } else {
//         setError('Failed to save tour. Please try again.');
//       }
//     }
//   };
  
//   // Reset form
//   const resetForm = () => {
//     setEditingTour(null);
//     setFormData({
//       name: '',
//       location: '',
//       duration: '',
//       price: '',
//       image: '',
//       travelers: 0,
//       tour_id: '',
//       emi: '',
//       tour_type: 'individual',
//       is_active: true,
//       display_order: tours.length
//     });
//     setShowForm(false);
//     setError('');
//     setSuccess('');
//   };
  
//   // Handle edit
//   const handleEdit = (tour) => {
//     setEditingTour(tour);
//     setFormData({
//       name: tour.name,
//       location: tour.location,
//       duration: tour.duration,
//       price: tour.price,
//       image: tour.image,
//       travelers: tour.travelers,
//       tour_id: tour.tour_id,
//       emi: tour.emi || '',
//       tour_type: tour.tour_type,
//       is_active: tour.is_active,
//       display_order: tour.display_order
//     });
//     setShowForm(true);
//   };
  
//   // Handle delete
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')) return;
    
//     try {
//       const response = await axios.delete(`${API_URL}/domestic-tours/${id}`);
//       if (response.data.success) {
//         setSuccess('Tour deleted successfully!');
//         loadTours();
//         loadStats();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to delete tour: ' + err.message);
//     }
//   };
  
//   // Handle toggle status
//   const handleToggleStatus = async (id, currentStatus) => {
//     try {
//       const response = await axios.patch(`${API_URL}/domestic-tours/${id}/toggle-status`);
//       if (response.data.success) {
//         setSuccess(`Tour ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
//         loadTours();
//         loadStats();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to update status: ' + err.message);
//     }
//   };
  
//   // Handle reordering
//   const handleMoveUp = async (index) => {
//     if (index === 0) return;
    
//     const updatedTours = [...filteredTours];
//     const temp = updatedTours[index];
//     updatedTours[index] = updatedTours[index - 1];
//     updatedTours[index - 1] = temp;
    
//     // Update display_order based on new position
//     const toursWithOrder = updatedTours.map((tour, idx) => ({
//       ...tour,
//       display_order: idx
//     }));
    
//     try {
//       const response = await axios.put(
//         `${API_URL}/domestic-tours/reorder/display-order`,
//         { tours: toursWithOrder }
//       );
      
//       if (response.data.success) {
//         setSuccess('Order updated successfully!');
//         loadTours();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to reorder tours: ' + err.message);
//     }
//   };
  
//   const handleMoveDown = async (index) => {
//     if (index === filteredTours.length - 1) return;
    
//     const updatedTours = [...filteredTours];
//     const temp = updatedTours[index];
//     updatedTours[index] = updatedTours[index + 1];
//     updatedTours[index + 1] = temp;
    
//     // Update display_order based on new position
//     const toursWithOrder = updatedTours.map((tour, idx) => ({
//       ...tour,
//       display_order: idx
//     }));
    
//     try {
//       const response = await axios.put(
//         `${API_URL}/domestic-tours/reorder/display-order`,
//         { tours: toursWithOrder }
//       );
      
//       if (response.data.success) {
//         setSuccess('Order updated successfully!');
//         loadTours();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to reorder tours: ' + err.message);
//     }
//   };
  
//   // Handle CSV export
//   const handleExportCSV = () => {
//     const headers = ['ID', 'Name', 'Location', 'Duration', 'Price', 'Travelers', 'Tour ID', 'EMI', 'Type', 'Status', 'Order'];
//     const csvRows = [
//       headers.join(','),
//       ...filteredTours.map(tour => [
//         tour.id,
//         `"${tour.name}"`,
//         `"${tour.location}"`,
//         `"${tour.duration}"`,
//         `"${tour.price}"`,
//         tour.travelers,
//         `"${tour.tour_id}"`,
//         `"${tour.emi || ''}"`,
//         tour.tour_type,
//         tour.is_active ? 'Active' : 'Inactive',
//         tour.display_order
//       ].join(','))
//     ];
    
//     const csvString = csvRows.join('\n');
//     const blob = new Blob([csvString], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `domestic-tours-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   // Auto-hide messages after 5 seconds
//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         if (success) setSuccess('');
//         if (error) setError('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error]);

//   return (
//     <AdminLayout>
//     <div className="admin-domestic-tours">
//       <div className="header-content">
//         <div className="header-main">
//           <div className="header-title">
//             <h1>Domestic Tours Management</h1>
//             <p>Manage individual and group tours</p>
//           </div>
//           <button
//             onClick={() => {
//               setEditingTour(null);
//               setFormData({
//                 name: '',
//                 location: '',
//                 duration: '',
//                 price: '',
//                 image: '',
//                 travelers: 0,
//                 tour_id: '',
//                 emi: '',
//                 tour_type: 'individual',
//                 is_active: true,
//                 display_order: tours.length
//               });
//               setShowForm(true);
//             }}
//             className="btn btn-primary"
//           >
//             <Plus className="icon" />
//             Add New Tour
//           </button>
//         </div>
        
//         {/* Stats Cards */}
//         {stats && (
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-value">{stats.overview.total_tours}</div>
//               <div className="stat-label">Total Tours</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value" style={{ color: '#10b981' }}>{stats.overview.individual_tours}</div>
//               <div className="stat-label">Individual Tours</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.overview.group_tours}</div>
//               <div className="stat-label">Group Tours</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-value" style={{ color: '#0d6efd' }}>{stats.overview.active_tours}</div>
//               <div className="stat-label">Active Tours</div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Success Message */}
//       {success && (
//         <div className="success-message">
//           <div className="success-icon">✓</div>
//           <p>{success}</p>
//         </div>
//       )}
      
//       {/* Error Message */}
//       {error && (
//         <div className="error-message">
//           <div className="error-icon">!</div>
//           <p>{error}</p>
//         </div>
//       )}
      
//       {/* Filters */}
//       <div className="filters-container">
//         <div className="filters-content">
//           <div className="search-container">
//             <Search className="search-icon" />
//             <input
//               type="text"
//               placeholder="Search tours by name, location, or ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//           </div>
          
//           <div className="filters-actions">
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="select"
//             >
//               <option value="all">All Types</option>
//               <option value="individual">Individual</option>
//               <option value="group">Group</option>
//             </select>
            
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="select"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
            
//             <button
//               onClick={handleExportCSV}
//               className="btn btn-success"
//             >
//               <Download className="icon" />
//               Export
//             </button>
            
//             <button
//               onClick={() => {
//                 loadTours();
//                 loadStats();
//                 setSuccess('Data refreshed successfully!');
//                 setTimeout(() => setSuccess(''), 3000);
//               }}
//               className="btn btn-gray"
//             >
//               <RefreshCw className="icon" />
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Tours Table */}
//       <div className="table-container">
//         {loading ? (
//           <div className="loading-state">
//             <div className="loading-spinner"></div>
//             <p className="loading-text">Loading tours...</p>
//           </div>
//         ) : filteredTours.length === 0 ? (
//           <div className="empty-state">
//             <p className="empty-text">No tours found. {searchTerm && 'Try adjusting your search.'}</p>
//           </div>
//         ) : (
//           <div className="table-wrapper">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Order</th>
//                   <th>Tour Details</th>
//                   <th>Price & EMI</th>
//                   <th>Type & Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTours.map((tour, index) => (
//                   <tr key={tour.id}>
//                     <td className="order-cell">
//                       <div className="order-controls">
//                         <button
//                           onClick={() => handleMoveUp(index)}
//                           disabled={index === 0}
//                           className="order-btn"
//                         >
//                           <ArrowUp className="icon" />
//                         </button>
//                         <span className="order-value">{tour.display_order + 1}</span>
//                         <button
//                           onClick={() => handleMoveDown(index)}
//                           disabled={index === filteredTours.length - 1}
//                           className="order-btn"
//                         >
//                           <ArrowDown className="icon" />
//                         </button>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="tour-details">
//                         <img
//                           src={tour.image}
//                           alt={tour.name}
//                           className="tour-image"
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/150';
//                           }}
//                         />
//                         <div className="tour-info">
//                           <h3>{tour.name}</h3>
//                           <div className="tour-meta">
//                             <span>📍 {tour.location}</span>
//                             <span>•</span>
//                             <span>⏱️ {tour.duration}</span>
//                           </div>
//                           <div className="tour-extra">
//                             <p>ID: {tour.tour_id}</p>
//                             <p>Travelers: {tour.travelers.toLocaleString()}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="price-info">
//                         <div className="price-value">₹{tour.price}</div>
//                         <div className="emi-value">
//                           EMI: {tour.emi ? `₹${tour.emi}` : 'Not set'}
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="type-status">
//                         <span className={`type-badge ${tour.tour_type === 'individual' ? 'type-individual' : 'type-group'}`}>
//                           {tour.tour_type === 'individual' ? 'Individual' : 'Group'}
//                         </span>
//                         <div className="status-indicator">
//                           <div className={`status-dot ${tour.is_active ? 'active' : 'inactive'}`} />
//                           <span className={`status-text ${tour.is_active ? 'active' : 'inactive'}`}>
//                             {tour.is_active ? 'Active' : 'Inactive'}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="action-buttons">
//                         <button
//                           onClick={() => handleToggleStatus(tour.id, tour.is_active)}
//                           className={`action-btn ${tour.is_active ? 'btn-status' : 'btn-status'}`}
//                           title={tour.is_active ? 'Deactivate' : 'Activate'}
//                         >
//                           {tour.is_active ? <EyeOff className="icon" /> : <Eye className="icon" />}
//                         </button>
//                         <button
//                           onClick={() => handleEdit(tour)}
//                           className="action-btn btn-edit"
//                           title="Edit"
//                         >
//                           <Edit className="icon" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(tour.id)}
//                           className="action-btn btn-delete"
//                           title="Delete"
//                         >
//                           <Trash2 className="icon" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
      
//       {/* Tour Form Modal */}
//       {showForm && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header">
//               <h2 className="modal-title">
//                 {editingTour ? 'Edit Tour' : 'Add New Tour'}
//               </h2>
//               <button
//                 onClick={resetForm}
//                 className="modal-close"
//               >
//                 <X className="icon" />
//               </button>
//             </div>
            
//             <div className="modal-content">
//               <form onSubmit={handleSubmit} className="tour-form">
//                 <div className="form-grid">
//                   {/* Name */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Tour Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., Kashmir Great Lakes"
//                     />
//                   </div>
                  
//                   {/* Location */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Location *
//                     </label>
//                     <input
//                       type="text"
//                       name="location"
//                       value={formData.location}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., Kashmir"
//                     />
//                   </div>
                  
//                   {/* Duration */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Duration *
//                     </label>
//                     <input
//                       type="text"
//                       name="duration"
//                       value={formData.duration}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., 8 Days"
//                     />
//                   </div>
                  
//                   {/* Price */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Price *
//                     </label>
//                     <input
//                       type="text"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., 25,999"
//                     />
//                   </div>
                  
//                   {/* Tour ID */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Tour ID *
//                     </label>
//                     <input
//                       type="text"
//                       name="tour_id"
//                       value={formData.tour_id}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="e.g., DOMI00001"
//                     />
//                     <small className="form-help">
//                       Enter unique Tour ID (e.g., DOMI00001 for Individual, DOMG00001 for Group)
//                     </small>
//                   </div>
                  
//                   {/* Tour Type */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Tour Type *
//                     </label>
//                     <select
//                       name="tour_type"
//                       value={formData.tour_type}
//                       onChange={handleInputChange}
//                       className="form-input"
//                       required
//                     >
//                       <option value="individual">Individual Tour</option>
//                       <option value="group">Group Tour</option>
//                     </select>
//                   </div>
                  
//                   {/* EMI */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       EMI per Month
//                     </label>
//                     <input
//                       type="text"
//                       name="emi"
//                       value={formData.emi}
//                       onChange={handleInputChange}
//                       className="form-input"
//                       placeholder="e.g., 2,166"
//                     />
//                   </div>
                  
//                   {/* Travelers */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Number of Travelers
//                     </label>
//                     <input
//                       type="number"
//                       name="travelers"
//                       value={formData.travelers}
//                       onChange={handleInputChange}
//                       min="0"
//                       className="form-input"
//                     />
//                   </div>
                  
//                   {/* Display Order */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Display Order
//                     </label>
//                     <input
//                       type="number"
//                       name="display_order"
//                       value={formData.display_order}
//                       onChange={handleInputChange}
//                       min="0"
//                       className="form-input"
//                     />
//                   </div>
                  
//                   {/* Image URL */}
//                   <div className="form-group full-width">
//                     <label className="form-label">
//                       Image URL *
//                     </label>
//                     <input
//                       type="url"
//                       name="image"
//                       value={formData.image}
//                       onChange={handleInputChange}
//                       required
//                       className="form-input"
//                       placeholder="https://example.com/image.jpg"
//                     />
//                     {formData.image && (
//                       <div className="image-preview">
//                         <img
//                           src={formData.image}
//                           alt="Preview"
//                           className="preview-image"
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/400x150';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Active Status */}
//                 <div className="form-checkbox">
//                   <input
//                     type="checkbox"
//                     name="is_active"
//                     id="is_active"
//                     checked={formData.is_active}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor="is_active">
//                     Set as active tour (visible on website)
//                   </label>
//                 </div>
                
//                 {/* Form Actions */}
//                 <div className="form-actions">
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="btn-cancel"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn-submit"
//                   >
//                     {editingTour ? 'Update Tour' : 'Create Tour'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//     </AdminLayout>
//   );
// };

// export default AdminDomesticTours;






import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Search, 
  Download,
  RefreshCw,
  Check,
  X,
  Upload
} from 'lucide-react';
import './AdminDomesticTours.css';
import AdminLayout from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const API_URL = `${baseurl}/api`;

const AdminDomesticTours = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    duration: '',
    price: '',
    image: '',
    travelers: 0,
    tour_id: '',
    emi: '',
    tour_type: 'individual',
    is_active: true,
    display_order: 0
  });
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Load all tours
  const loadTours = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/domestic-tours/admin`);
      const data = await response.json();
      if (data.success) {
        setTours(data.data);
        setFilteredTours(data.data);
      }
    } catch (err) {
      setError('Failed to load tours: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  // Load statistics
  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/domestic-tours/stats/overview`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };
  
  useEffect(() => {
    loadTours();
    loadStats();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = tours;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tour => 
        tour.name.toLowerCase().includes(term) ||
        tour.location.toLowerCase().includes(term) ||
        tour.tour_id.toLowerCase().includes(term)
      );
    }
    
    // Filter by tour type
    if (filterType !== 'all') {
      result = result.filter(tour => tour.tour_type === filterType);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      const activeStatus = filterStatus === 'active';
      result = result.filter(tour => tour.is_active === activeStatus);
    }
    
    setFilteredTours(result);
  }, [tours, searchTerm, filterType, filterStatus]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, PNG, GIF, WebP)');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setUploadMethod('file');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear URL input if file is selected
      setFormData(prev => ({ ...prev, image: '' }));
    }
  };
  
  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setImagePreview('');
    setUploadMethod('url');
  };
  
  // Get existing tour IDs
  const getExistingTourIds = () => {
    return tours.map(tour => tour.tour_id);
  };
  
  // Format currency (remove ₹ symbol and commas)
  const formatCurrency = (value) => {
    if (!value) return value;
    return value.toString()
      .replace('₹', '')
      .replace(/,/g, '')
      .trim();
  };
  
  // Handle form submit with file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUploading(true);
    
    try {
      // Validate required fields
      if (!formData.tour_id.trim()) {
        throw new Error('Tour ID is required');
      }
      
      if (!formData.name.trim()) {
        throw new Error('Tour Name is required');
      }
      
      if (!formData.location.trim()) {
        throw new Error('Location is required');
      }
      
      if (!formData.duration.trim()) {
        throw new Error('Duration is required');
      }
      
      if (!formData.price.trim()) {
        throw new Error('Price is required');
      }
      
      // Validate that either file or image URL is provided
      if (uploadMethod === 'file' && !selectedFile) {
        throw new Error('Please select an image file');
      }
      
      if (uploadMethod === 'url' && !formData.image.trim()) {
        throw new Error('Please provide an image URL');
      }
      
      // Prepare FormData
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('price', formatCurrency(formData.price));
      formDataToSend.append('travelers', formData.travelers.toString());
      formDataToSend.append('tour_id', formData.tour_id);
      formDataToSend.append('emi', formatCurrency(formData.emi || ''));
      formDataToSend.append('tour_type', formData.tour_type);
      formDataToSend.append('is_active', formData.is_active.toString());
      formDataToSend.append('display_order', formData.display_order.toString());
      
      // Add image based on selected method
      if (uploadMethod === 'file' && selectedFile) {
        formDataToSend.append('image', selectedFile);
      } else if (uploadMethod === 'url') {
        formDataToSend.append('image_url', formData.image);
      }
      
      // Check for duplicate tour_id (only for new tours)
      if (!editingTour) {
        const existingIds = getExistingTourIds();
        if (existingIds.includes(formData.tour_id)) {
          throw new Error(`Tour ID "${formData.tour_id}" already exists. Please use a different ID.`);
        }
      }
      
      const url = editingTour 
        ? `${API_URL}/domestic-tours/${editingTour.id}`
        : `${API_URL}/domestic-tours`;
      
      const method = editingTour ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save tour');
      }
      
      if (data.success) {
        setSuccess(editingTour ? 'Tour updated successfully!' : 'Tour created successfully!');
        
        // Reset and reload
        setTimeout(() => {
          resetForm();
          loadTours();
          loadStats();
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving tour:', err);
      setError(err.message || 'Failed to save tour. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setEditingTour(null);
    setFormData({
      name: '',
      location: '',
      duration: '',
      price: '',
      image: '',
      travelers: 0,
      tour_id: '',
      emi: '',
      tour_type: 'individual',
      is_active: true,
      display_order: tours.length
    });
    setSelectedFile(null);
    setImagePreview('');
    setUploadMethod('url');
    setShowForm(false);
    setError('');
    setSuccess('');
  };
  
  // Handle edit
  const handleEdit = (tour) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name,
      location: tour.location,
      duration: tour.duration,
      price: tour.price,
      image: tour.image,
      travelers: tour.travelers,
      tour_id: tour.tour_id,
      emi: tour.emi || '',
      tour_type: tour.tour_type,
      is_active: tour.is_active,
      display_order: tour.display_order
    });
    
    // Check if the image is a local upload or URL
    if (tour.image && tour.image.startsWith('/uploads/')) {
      setUploadMethod('file');
      setImagePreview(`${baseurl}${tour.image}`);
    } else {
      setUploadMethod('url');
      setImagePreview('');
    }
    
    setSelectedFile(null);
    setShowForm(true);
  };
  
  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_URL}/domestic-tours/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Tour deleted successfully!');
        loadTours();
        loadStats();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete tour: ' + err.message);
    }
  };
  
  // Handle toggle status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/domestic-tours/${id}/toggle-status`, {
        method: 'PATCH'
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Tour ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
        loadTours();
        loadStats();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    }
  };
  
  // Handle reordering
  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    const updatedTours = [...filteredTours];
    const temp = updatedTours[index];
    updatedTours[index] = updatedTours[index - 1];
    updatedTours[index - 1] = temp;
    
    // Update display_order based on new position
    const toursWithOrder = updatedTours.map((tour, idx) => ({
      ...tour,
      display_order: idx
    }));
    
    try {
      const response = await fetch(`${API_URL}/domestic-tours/reorder/display-order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tours: toursWithOrder })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Order updated successfully!');
        loadTours();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to reorder tours: ' + err.message);
    }
  };
  
  const handleMoveDown = async (index) => {
    if (index === filteredTours.length - 1) return;
    
    const updatedTours = [...filteredTours];
    const temp = updatedTours[index];
    updatedTours[index] = updatedTours[index + 1];
    updatedTours[index + 1] = temp;
    
    // Update display_order based on new position
    const toursWithOrder = updatedTours.map((tour, idx) => ({
      ...tour,
      display_order: idx
    }));
    
    try {
      const response = await fetch(`${API_URL}/domestic-tours/reorder/display-order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tours: toursWithOrder })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Order updated successfully!');
        loadTours();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to reorder tours: ' + err.message);
    }
  };
  
  // Handle CSV export
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Location', 'Duration', 'Price', 'Travelers', 'Tour ID', 'EMI', 'Type', 'Status', 'Order'];
    const csvRows = [
      headers.join(','),
      ...filteredTours.map(tour => [
        tour.id,
        `"${tour.name}"`,
        `"${tour.location}"`,
        `"${tour.duration}"`,
        `"${tour.price}"`,
        tour.travelers,
        `"${tour.tour_id}"`,
        `"${tour.emi || ''}"`,
        tour.tour_type,
        tour.is_active ? 'Active' : 'Inactive',
        tour.display_order
      ].join(','))
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domestic-tours-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        if (success) setSuccess('');
        if (error) setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <AdminLayout>
      <div className="admin-domestic-tours">
        <div className="header-content">
          <div className="header-main">
            <div className="header-title">
              <h1>Domestic Tours Management</h1>
              <p>Manage individual and group tours</p>
            </div>
            <button
              onClick={() => {
                setEditingTour(null);
                resetForm();
                setShowForm(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="icon" />
              Add New Tour
            </button>
          </div>
          
          {/* Stats Cards */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.overview.total_tours}</div>
                <div className="stat-label">Total Tours</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#10b981' }}>{stats.overview.individual_tours}</div>
                <div className="stat-label">Individual Tours</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.overview.group_tours}</div>
                <div className="stat-label">Group Tours</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#0d6efd' }}>{stats.overview.active_tours}</div>
                <div className="stat-label">Active Tours</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>{success}</p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <div className="error-icon">!</div>
            <p>{error}</p>
          </div>
        )}
        
        {/* Filters */}
        <div className="filters-container">
          <div className="filters-content">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search tours by name, location, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filters-actions">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="select"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <button
                onClick={handleExportCSV}
                className="btn btn-success"
              >
                <Download className="icon" />
                Export
              </button>
              
              <button
                onClick={() => {
                  loadTours();
                  loadStats();
                  setSuccess('Data refreshed successfully!');
                  setTimeout(() => setSuccess(''), 3000);
                }}
                className="btn btn-gray"
              >
                <RefreshCw className="icon" />
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        {/* Tours Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading tours...</p>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">No tours found. {searchTerm && 'Try adjusting your search.'}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Tour Details</th>
                    <th>Price & EMI</th>
                    <th>Type & Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTours.map((tour, index) => (
                    <tr key={tour.id}>
                      <td className="order-cell">
                        <div className="order-controls">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="order-btn"
                          >
                            <ArrowUp className="icon" />
                          </button>
                          <span className="order-value">{tour.display_order + 1}</span>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === filteredTours.length - 1}
                            className="order-btn"
                          >
                            <ArrowDown className="icon" />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="tour-details">
                          <img
                            src={tour.image.startsWith('/uploads/') ? `${baseurl}${tour.image}` : tour.image}
                            alt={tour.name}
                            className="tour-image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                          <div className="tour-info">
                            <h3>{tour.name}</h3>
                            <div className="tour-meta">
                              <span>📍 {tour.location}</span>
                              <span>•</span>
                              <span>⏱️ {tour.duration}</span>
                            </div>
                            <div className="tour-extra">
                              <p>ID: {tour.tour_id}</p>
                              <p>Travelers: {tour.travelers.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="price-info">
                          <div className="price-value">₹{parseInt(tour.price).toLocaleString('en-IN')}</div>
                          <div className="emi-value">
                            EMI: {tour.emi ? `₹${parseInt(tour.emi).toLocaleString('en-IN')}` : 'Not set'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="type-status">
                          <span className={`type-badge ${tour.tour_type === 'individual' ? 'type-individual' : 'type-group'}`}>
                            {tour.tour_type === 'individual' ? 'Individual' : 'Group'}
                          </span>
                          <div className="status-indicator">
                            <div className={`status-dot ${tour.is_active ? 'active' : 'inactive'}`} />
                            <span className={`status-text ${tour.is_active ? 'active' : 'inactive'}`}>
                              {tour.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleToggleStatus(tour.id, tour.is_active)}
                            className={`action-btn ${tour.is_active ? 'btn-status' : 'btn-status'}`}
                            title={tour.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {tour.is_active ? <EyeOff className="icon" /> : <Eye className="icon" />}
                          </button>
                          <button
                            onClick={() => handleEdit(tour)}
                            className="action-btn btn-edit"
                            title="Edit"
                          >
                            <Edit className="icon" />
                          </button>
                          <button
                            onClick={() => handleDelete(tour.id)}
                            className="action-btn btn-delete"
                            title="Delete"
                          >
                            <Trash2 className="icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Tour Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingTour ? 'Edit Tour' : 'Add New Tour'}
                </h2>
                <button
                  onClick={resetForm}
                  className="modal-close"
                >
                  <X className="icon" />
                </button>
              </div>
              
              <div className="modal-content">
                <form onSubmit={handleSubmit} className="tour-form">
                  <div className="form-grid">
                    {/* Name */}
                    <div className="form-group">
                      <label className="form-label">
                        Tour Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="e.g., Kashmir Great Lakes"
                      />
                    </div>
                    
                    {/* Location */}
                    <div className="form-group">
                      <label className="form-label">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="e.g., Kashmir"
                      />
                    </div>
                    
                    {/* Duration */}
                    <div className="form-group">
                      <label className="form-label">
                        Duration *
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="e.g., 8 Days"
                      />
                    </div>
                    
                    {/* Price */}
                    <div className="form-group">
                      <label className="form-label">
                        Price *
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="e.g., 25,999"
                      />
                    </div>
                    
                    {/* Tour ID */}
                    <div className="form-group">
                      <label className="form-label">
                        Tour ID *
                      </label>
                      <input
                        type="text"
                        name="tour_id"
                        value={formData.tour_id}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="e.g., DOMI00001"
                      />
                      <small className="form-help">
                        Enter unique Tour ID (e.g., DOMI00001 for Individual, DOMG00001 for Group)
                      </small>
                    </div>
                    
                    {/* Tour Type */}
                    <div className="form-group">
                      <label className="form-label">
                        Tour Type *
                      </label>
                      <select
                        name="tour_type"
                        value={formData.tour_type}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      >
                        <option value="individual">Individual Tour</option>
                        <option value="group">Group Tour</option>
                      </select>
                    </div>
                    
                    {/* EMI */}
                    <div className="form-group">
                      <label className="form-label">
                        EMI per Month
                      </label>
                      <input
                        type="text"
                        name="emi"
                        value={formData.emi}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., 2,166"
                      />
                    </div>
                    
                    {/* Travelers */}
                    <div className="form-group">
                      <label className="form-label">
                        Number of Travelers
                      </label>
                      <input
                        type="number"
                        name="travelers"
                        value={formData.travelers}
                        onChange={handleInputChange}
                        min="0"
                        className="form-input"
                      />
                    </div>
                    
                    {/* Display Order */}
                    <div className="form-group">
                      <label className="form-label">
                        Display Order
                      </label>
                      <input
                        type="number"
                        name="display_order"
                        value={formData.display_order}
                        onChange={handleInputChange}
                        min="0"
                        className="form-input"
                      />
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="form-group full-width">
                      <label className="form-label">
                        Image *
                      </label>
                      
                      <div className="upload-options">
                        <div className="upload-tabs">
                          <button
                            type="button"
                            className={`upload-tab ${uploadMethod === 'url' ? 'active' : ''}`}
                            onClick={() => setUploadMethod('url')}
                          >
                            URL
                          </button>
                          <button
                            type="button"
                            className={`upload-tab ${uploadMethod === 'file' ? 'active' : ''}`}
                            onClick={() => setUploadMethod('file')}
                          >
                            Upload File
                          </button>
                        </div>
                        
                        {/* URL Input */}
                        {uploadMethod === 'url' && (
                          <div className="url-input-section">
                            <input
                              type="url"
                              name="image"
                              value={formData.image}
                              onChange={handleInputChange}
                              required={uploadMethod === 'url'}
                              className="form-input"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        )}
                        
                        {/* File Upload */}
                        {uploadMethod === 'file' && (
                          <div className="file-upload-section">
                            <label className="file-upload-label">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="file-input"
                              />
                              <div className="file-upload-box">
                                <Upload className="upload-icon" />
                                <p className="upload-text">
                                  {selectedFile ? selectedFile.name : 'Click to select image file'}
                                </p>
                                <p className="upload-hint">
                                  Supports JPG, PNG, GIF, WebP (Max 5MB)
                                </p>
                              </div>
                            </label>
                            
                            {selectedFile && (
                              <button
                                type="button"
                                onClick={clearFile}
                                className="clear-file-btn"
                              >
                                <X className="icon" />
                                Clear File
                              </button>
                            )}
                          </div>
                        )}
                        
                        {/* Preview */}
                        {(formData.image || imagePreview) && (
                          <div className="image-preview-container">
                            <h4 className="preview-title">Preview</h4>
                            <img
                              src={imagePreview || formData.image}
                              alt="Preview"
                              className="preview-image"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x200';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Status */}
                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      name="is_active"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="is_active">
                      Set as active tour (visible on website)
                    </label>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <span className="upload-loading">
                          <span className="spinner"></span>
                          {editingTour ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        editingTour ? 'Update Tour' : 'Create Tour'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDomesticTours;