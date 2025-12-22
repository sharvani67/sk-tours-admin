// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Search, 
//   Download, 
//   RefreshCw, 
//   Filter,
//   Eye, 
//   Phone, 
//   Mail,
//   MapPin,
//   Calendar,
//   User,
//   CheckCircle,
//   XCircle,
//   Clock,
//   TrendingUp,
//   FileText,
//   ChevronDown,
//   ChevronUp,
//   Edit,
//   Trash2,
//   Send,
//   Star
// } from 'lucide-react';
// import './AdminLeads.css';
// import AdminLayout from '../../Shared/Navbar/Navbar';

// const API_URL = 'http://localhost:5000/api';

// const AdminLeads = () => {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
  
//   // Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
//   // Pagination
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 1
//   });
  
//   // Selected lead for details
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
  
//   // Status update
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });

//   // Load leads
//   const loadLeads = async (page = 1) => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const params = {
//         page,
//         limit: pagination.limit,
//         status: statusFilter !== 'all' ? statusFilter : undefined,
//         search: searchTerm || undefined,
//         startDate: dateRange.start || undefined,
//         endDate: dateRange.end || undefined
//       };
      
//       const response = await axios.get(`${API_URL}/leads/admin`, { params });
      
//       if (response.data.success) {
//         setLeads(response.data.data);
//         setPagination(response.data.pagination);
//       }
//     } catch (err) {
//       setError('Failed to load leads: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load statistics
//   const loadStats = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/leads/stats/overview`);
//       if (response.data.success) {
//         setStats(response.data.data);
//       }
//     } catch (err) {
//       console.log('Stats endpoint not available');
//     }
//   };

//   useEffect(() => {
//     loadLeads();
//     loadStats();
//   }, []);

//   // Apply filters
//   const handleApplyFilters = () => {
//     loadLeads(1);
//   };

//   // Reset filters
//   const handleResetFilters = () => {
//     setSearchTerm('');
//     setStatusFilter('all');
//     setDateRange({ start: '', end: '' });
//     loadLeads(1);
//   };

//   // Export to CSV
//   const handleExportCSV = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/leads/export/csv`, {
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       setSuccess('Leads exported successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError('Failed to export leads: ' + err.message);
//     }
//   };

//   // View lead details modal
//   const handleViewDetails = async (leadId) => {
//     try {
//       const response = await axios.get(`${API_URL}/leads/${leadId}`);
//       if (response.data.success) {
//         setSelectedLead(response.data.data);
//         setShowDetails(true);
//         setStatusUpdate({
//           status: response.data.data.status,
//           notes: response.data.data.notes || ''
//         });
//       }
//     } catch (err) {
//       setError('Failed to load lead details: ' + err.message);
//     }
//   };

//   // Update lead status from modal
//   const handleUpdateStatus = async () => {
//     if (!selectedLead || !statusUpdate.status) return;
    
//     try {
//       setUpdatingStatus(true);
//       const response = await axios.patch(
//         `${API_URL}/leads/${selectedLead.id}/status`,
//         statusUpdate
//       );
      
//       if (response.data.success) {
//         setSelectedLead(response.data.data);
//         setSuccess('Status updated successfully!');
//         loadLeads(pagination.page);
//         loadStats();
        
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to update status: ' + err.message);
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   // Delete lead
//   const handleDeleteLead = async (leadId) => {
//     if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
//     try {
//       const response = await axios.delete(`${API_URL}/leads/${leadId}`);
//       if (response.data.success) {
//         setSuccess('Lead deleted successfully!');
//         loadLeads(pagination.page);
//         loadStats();
        
//         if (selectedLead?.id === leadId) {
//           setShowDetails(false);
//           setSelectedLead(null);
//         }
        
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       setError('Failed to delete lead: ' + err.message);
//     }
//   };

//   // Close modal
//   const handleCloseModal = () => {
//     setShowDetails(false);
//     setSelectedLead(null);
//   };

//   // Get status badge color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'new': return 'bg-blue-100 text-blue-800';
//       case 'contacted': return 'bg-yellow-100 text-yellow-800';
//       case 'converted': return 'bg-green-100 text-green-800';
//       case 'lost': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get status icon
//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'new': return <Clock className="w-4 h-4" />;
//       case 'contacted': return <Phone className="w-4 h-4" />;
//       case 'converted': return <CheckCircle className="w-4 h-4" />;
//       case 'lost': return <XCircle className="w-4 h-4" />;
//       default: return null;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Format time
//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <AdminLayout>
//     <div className="admin-leads min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Leads Management</h1>
//             <p className="text-gray-600">Manage and track all popup form submissions</p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={handleExportCSV}
//               className="btn-success flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-300"
//             >
//               <Download className="h-5 w-5" />
//               Export CSV
//             </button>
//             <button
//               onClick={() => {
//                 loadLeads();
//                 loadStats();
//                 setError('');
//                 setSuccess('');
//               }}
//               className="btn-primary flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-300"
//             >
//               <RefreshCw className="h-5 w-5" />
//               Refresh
//             </button>
//           </div>
//         </div>
        
//         {/* Stats Cards */}
//         {stats && (
//           <div className="stats-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-2xl font-bold text-gray-800">{stats.overview.total_leads}</div>
//                   <div className="text-gray-600 text-sm">Total Leads</div>
//                 </div>
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <FileText className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//               <div className="mt-2 flex items-center text-xs text-gray-500">
//                 <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
//                 <span>{stats.overview.today_leads} new today</span>
//               </div>
//             </div>
            
//             <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-2xl font-bold text-yellow-600">{stats.overview.new_leads}</div>
//                   <div className="text-gray-600 text-sm">New Leads</div>
//                 </div>
//                 <div className="p-2 bg-yellow-100 rounded-lg">
//                   <Clock className="w-6 h-6 text-yellow-600" />
//                 </div>
//               </div>
//               <div className="mt-2 text-xs text-yellow-600">
//                 Needs follow up
//               </div>
//             </div>
            
//             <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-2xl font-bold text-green-600">{stats.overview.converted_leads}</div>
//                   <div className="text-gray-600 text-sm">Converted</div>
//                 </div>
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <CheckCircle className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//               <div className="mt-2 text-xs text-green-600">
//                 {((stats.overview.converted_leads / stats.overview.total_leads) * 100 || 0).toFixed(1)}% conversion rate
//               </div>
//             </div>
            
//             <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-2xl font-bold text-purple-600">{stats.sources?.[0]?.count || 0}</div>
//                   <div className="text-gray-600 text-sm">From Popup</div>
//                 </div>
//                 <div className="p-2 bg-purple-100 rounded-lg">
//                   <Star className="w-6 h-6 text-purple-600" />
//                 </div>
//               </div>
//               <div className="mt-2 text-xs text-gray-500">
//                 Main source: {stats.sources?.[0]?.source || 'N/A'}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Success/Error Messages */}
//       {success && (
//         <div className="alert-success mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
//           <CheckCircle className="h-5 w-5" />
//           {success}
//         </div>
//       )}
      
//       {error && (
//         <div className="alert-error mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
//           <XCircle className="h-5 w-5" />
//           {error}
//         </div>
//       )}
      
//       {/* Filters */}
//       <div className="filter-bar mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email, phone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="form-input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Status</option>
//               <option value="new">New</option>
//               <option value="contacted">Contacted</option>
//               <option value="converted">Converted</option>
//               <option value="lost">Lost</option>
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
//             <input
//               type="date"
//               value={dateRange.start}
//               onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
//               className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
//             <input
//               type="date"
//               value={dateRange.end}
//               onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
//               className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>
        
//         <div className="flex gap-3 mt-4">
//           <button
//             onClick={handleApplyFilters}
//             className="btn-primary px-6 py-2 text-white rounded-lg font-medium transition-all duration-300"
//           >
//             <Filter className="w-4 h-4 inline-block mr-2" />
//             Apply Filters
//           </button>
//           <button
//             onClick={handleResetFilters}
//             className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
//           >
//             Reset
//           </button>
//         </div>
//       </div>
      
//       {/* Main Content - Full width table */}
//       <div className="grid grid-cols-1">
//         {/* Leads List - Full width */}
//         <div>
//           <div className="bg-white rounded-lg shadow-hard border border-gray-200 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-800">All Leads ({pagination.total})</h2>
              
//               {/* Top Cities inline */}
//               {stats?.top_cities && stats.top_cities.length > 0 && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <MapPin className="w-4 h-4" />
//                   <span className="font-medium">Top Cities:</span>
//                   {stats.top_cities.slice(0, 3).map((city, index) => (
//                     <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
//                       {city.city || 'Unknown'}: {city.count}
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             {loading ? (
//               <div className="p-8 text-center">
//                 <div className="loading-spinner inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
//                 <p className="mt-2 text-gray-600">Loading leads...</p>
//               </div>
//             ) : leads.length === 0 ? (
//               <div className="p-8 text-center">
//                 <p className="text-gray-500">No leads found. {searchTerm && 'Try adjusting your filters.'}</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         ID
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Contact Info
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Location
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Source
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date & Time
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {leads.map((lead) => (
//                       <tr key={lead.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             #{lead.id}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                               {lead.first_name.charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                               <div className="font-medium text-gray-900">{lead.first_name}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2 text-sm">
//                               <Mail className="w-3 h-3 text-gray-400" />
//                               <span className="text-gray-600">{lead.email}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-sm">
//                               <Phone className="w-3 h-3 text-gray-400" />
//                               <span className="text-gray-600">{lead.phone}</span>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <MapPin className="w-3 h-3 text-gray-400" />
//                             <span>{lead.city}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
//                             {getStatusIcon(lead.status)}
//                             {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
//                             {lead.source}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="space-y-1">
//                             <div className="text-sm text-gray-600">
//                               {formatDate(lead.created_at)}
//                             </div>
//                             <div className="text-xs text-gray-400">
//                               {formatTime(lead.created_at)}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleViewDetails(lead.id)}
//                               className="action-btn p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                               title="View Details"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteLead(lead.id)}
//                               className="action-btn p-2 text-red-600 hover:bg-red-50 rounded-lg"
//                               title="Delete"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
            
//             {/* Pagination */}
//             {pagination.pages > 1 && (
//               <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//                 <div className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
//                   <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
//                   <span className="font-medium">{pagination.total}</span> leads
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => loadLeads(pagination.page - 1)}
//                     disabled={pagination.page === 1}
//                     className={`px-3 py-1 rounded-lg ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
//                     let pageNum;
//                     if (pagination.pages <= 5) {
//                       pageNum = i + 1;
//                     } else if (pagination.page <= 3) {
//                       pageNum = i + 1;
//                     } else if (pagination.page >= pagination.pages - 2) {
//                       pageNum = pagination.pages - 4 + i;
//                     } else {
//                       pageNum = pagination.page - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => loadLeads(pageNum)}
//                         className={`px-3 py-1 rounded-lg ${pagination.page === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => loadLeads(pagination.page + 1)}
//                     disabled={pagination.page === pagination.pages}
//                     className={`px-3 py-1 rounded-lg ${pagination.page === pagination.pages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Lead Details Modal */}
//       {showDetails && selectedLead && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-800">Lead Details</h2>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-gray-400 hover:text-gray-600 p-1"
//               >
//                 <XCircle className="w-6 h-6" />
//               </button>
//             </div>
            
//             <div className="p-6">
//               {/* Lead Info */}
//               <div className="mb-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                       {selectedLead.first_name.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">{selectedLead.first_name}</h3>
//                       <p className="text-gray-600 text-sm">Lead #{selectedLead.id}</p>
//                     </div>
//                   </div>
//                   <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
//                     {getStatusIcon(selectedLead.status)}
//                     {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
//                   </span>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3">
//                       <Mail className="w-5 h-5 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-500">Email</p>
//                         <p className="text-gray-800">{selectedLead.email}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3">
//                       <Phone className="w-5 h-5 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-500">Phone</p>
//                         <p className="text-gray-800">{selectedLead.phone}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3">
//                       <MapPin className="w-5 h-5 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-500">City</p>
//                         <p className="text-gray-800">{selectedLead.city}</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3">
//                       <Calendar className="w-5 h-5 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-500">Submitted</p>
//                         <p className="text-gray-800">
//                           {formatDate(selectedLead.created_at)} at {formatTime(selectedLead.created_at)}
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3">
//                       <FileText className="w-5 h-5 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-500">Source</p>
//                         <p className="text-gray-800 capitalize">{selectedLead.source}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Status Update */}
//               <div className="mb-6">
//                 <h4 className="font-semibold text-gray-700 mb-3">Update Status</h4>
//                 <div className="space-y-3">
//                   <select
//                     value={statusUpdate.status}
//                     onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
//                     className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="new">New</option>
//                     <option value="contacted">Contacted</option>
//                     <option value="converted">Converted</option>
//                     <option value="lost">Lost</option>
//                   </select>
                  
//                   <textarea
//                     value={statusUpdate.notes}
//                     onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
//                     placeholder="Add notes..."
//                     rows="3"
//                     className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
                  
//                   <button
//                     onClick={handleUpdateStatus}
//                     disabled={updatingStatus}
//                     className="btn-primary w-full py-2 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
//                   >
//                     {updatingStatus ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Updating...
//                       </>
//                     ) : (
//                       <>
//                         <Send className="w-4 h-4" />
//                         Update Status
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
              
//               {/* Existing Notes */}
//               {selectedLead.notes && (
//                 <div className="mb-6">
//                   <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
//                   <div className="bg-gray-50 p-3 rounded-lg">
//                     <p className="text-gray-700 text-sm">{selectedLead.notes}</p>
//                   </div>
//                 </div>
//               )}
              
//               {/* Actions */}
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <button
//                   onClick={() => handleDeleteLead(selectedLead.id)}
//                   className="btn-danger w-full py-2 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   Delete Lead
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//     </AdminLayout>
//   );
// };

// export default AdminLeads;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Download, 
  RefreshCw, 
  Filter,
  Eye, 
  Phone, 
  Mail,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Send,
  Star
} from 'lucide-react';
import './AdminLeads.css';
import AdminLayout from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';


const API_URL = `${baseurl}/api`;

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  
  // Selected lead for details
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Status update
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });

  // Load leads
  const loadLeads = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page,
        limit: pagination.limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      };
      
      const response = await axios.get(`${API_URL}/leads/admin`, { params });
      
      if (response.data.success) {
        setLeads(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError('Failed to load leads: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads/stats/overview`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.log('Stats endpoint not available');
    }
  };

  useEffect(() => {
    loadLeads();
    loadStats();
  }, []);

  // Apply filters
  const handleApplyFilters = () => {
    loadLeads(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
    loadLeads(1);
  };

  // Export to CSV
  const handleExportCSV = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads/export/csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccess('Leads exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to export leads: ' + err.message);
    }
  };

  // View lead details modal
  const handleViewDetails = async (leadId) => {
    try {
      const response = await axios.get(`${API_URL}/leads/${leadId}`);
      if (response.data.success) {
        setSelectedLead(response.data.data);
        setShowDetails(true);
        setStatusUpdate({
          status: response.data.data.status,
          notes: response.data.data.notes || ''
        });
      }
    } catch (err) {
      setError('Failed to load lead details: ' + err.message);
    }
  };

  // Update lead status from modal
  const handleUpdateStatus = async () => {
    if (!selectedLead || !statusUpdate.status) return;
    
    try {
      setUpdatingStatus(true);
      const response = await axios.patch(
        `${API_URL}/leads/${selectedLead.id}/status`,
        statusUpdate
      );
      
      if (response.data.success) {
        setSelectedLead(response.data.data);
        setSuccess('Status updated successfully!');
        loadLeads(pagination.page);
        loadStats();
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      const response = await axios.delete(`${API_URL}/leads/${leadId}`);
      if (response.data.success) {
        setSuccess('Lead deleted successfully!');
        loadLeads(pagination.page);
        loadStats();
        
        if (selectedLead?.id === leadId) {
          setShowDetails(false);
          setSelectedLead(null);
        }
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete lead: ' + err.message);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedLead(null);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />;
      case 'contacted': return <Phone className="w-4 h-4" />;
      case 'converted': return <CheckCircle className="w-4 h-4" />;
      case 'lost': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="admin-leads min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Leads Management</h1>
              <p className="text-gray-600">Manage and track all popup form submissions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="btn-success flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-300"
              >
                <Download className="h-5 w-5" />
                Export CSV
              </button>
              <button
                onClick={() => {
                  loadLeads();
                  loadStats();
                  setError('');
                  setSuccess('');
                }}
                className="btn-primary flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-300"
              >
                <RefreshCw className="h-5 w-5" />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          {stats && (
            <div className="stats-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{stats.overview.total_leads}</div>
                    <div className="text-gray-600 text-sm">Total Leads</div>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span>{stats.overview.today_leads} new today</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.overview.new_leads}</div>
                    <div className="text-gray-600 text-sm">New Leads</div>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-yellow-600">
                  Needs follow up
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.overview.converted_leads}</div>
                    <div className="text-gray-600 text-sm">Converted</div>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  {((stats.overview.converted_leads / stats.overview.total_leads) * 100 || 0).toFixed(1)}% conversion rate
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{stats.sources?.[0]?.count || 0}</div>
                    <div className="text-gray-600 text-sm">From Popup</div>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Main source: {stats.sources?.[0]?.source || 'N/A'}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Success/Error Messages */}
        {success && (
          <div className="alert-success mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}
        
        {error && (
          <div className="alert-error mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            {error}
          </div>
        )}
        
        {/* Filters */}
        <div className="filter-bar mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleApplyFilters}
              className="btn-primary px-6 py-2 text-white rounded-lg font-medium transition-all duration-300"
            >
              <Filter className="w-4 h-4 inline-block mr-2" />
              Apply Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Main Content - Full width table */}
        <div className="grid grid-cols-1">
          {/* Leads List - Full width */}
          <div>
            <div className="bg-white rounded-lg shadow-hard border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">All Leads ({pagination.total})</h2>
                
                {/* Top Cities inline */}
                {stats?.top_cities && stats.top_cities.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Top Cities:</span>
                    {stats.top_cities.slice(0, 3).map((city, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {city.city || 'Unknown'}: {city.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="loading-spinner inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
                  <p className="mt-2 text-gray-600">Loading leads...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No leads found. {searchTerm && 'Try adjusting your filters.'}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              #{lead.id}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {lead.first_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{lead.first_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-600">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-600">{lead.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{lead.city}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                              {getStatusIcon(lead.status)}
                              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                              {lead.source}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">
                                {formatDate(lead.created_at)}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatTime(lead.created_at)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(lead.id)}
                                className="action-btn p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="action-btn p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> leads
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadLeads(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`px-3 py-1 rounded-lg ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => loadLeads(pageNum)}
                          className={`px-3 py-1 rounded-lg ${pagination.page === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => loadLeads(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className={`px-3 py-1 rounded-lg ${pagination.page === pagination.pages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lead Details Modal */}
        {showDetails && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Lead Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Lead Info */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {selectedLead.first_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{selectedLead.first_name}</h3>
                        <p className="text-gray-600 text-sm">Lead #{selectedLead.id}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                      {getStatusIcon(selectedLead.status)}
                      {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-800">{selectedLead.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-800">{selectedLead.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="text-gray-800">{selectedLead.city}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Submitted</p>
                          <p className="text-gray-800">
                            {formatDate(selectedLead.created_at)} at {formatTime(selectedLead.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Source</p>
                          <p className="text-gray-800 capitalize">{selectedLead.source}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status Update */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Update Status</h4>
                  <div className="space-y-3">
                    <select
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                      className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                    
                    <textarea
                      value={statusUpdate.notes}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add notes..."
                      rows="3"
                      className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <button
                      onClick={handleUpdateStatus}
                      disabled={updatingStatus}
                      className="btn-primary w-full py-2 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {updatingStatus ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Update Status
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Existing Notes */}
                {selectedLead.notes && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700 text-sm">{selectedLead.notes}</p>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleDeleteLead(selectedLead.id)}
                    className="btn-danger w-full py-2 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Lead
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLeads;