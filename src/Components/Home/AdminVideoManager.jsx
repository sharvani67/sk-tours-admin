// import React, { useState, useEffect, useRef } from 'react';

// const AdminVideoManager = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     gradient_classes: 'from-emerald-500/20 to-cyan-500/20',
//     display_order: 0,
//     is_active: true,
//     videoFile: null
//   });

//   const gradientOptions = [
//     { value: 'from-emerald-500/20 to-cyan-500/20', label: 'Emerald to Cyan' },
//     { value: 'from-blue-500/20 to-purple-500/20', label: 'Blue to Purple' },
//     { value: 'from-red-500/20 to-pink-500/20', label: 'Red to Pink' },
//     { value: 'from-amber-500/20 to-orange-500/20', label: 'Amber to Orange' },
//     { value: 'from-indigo-500/20 to-violet-500/20', label: 'Indigo to Violet' },
//     { value: 'from-teal-500/20 to-emerald-500/20', label: 'Teal to Emerald' }
//   ];

//   // Fetch all videos for the admin list
//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await fetch('http://localhost:5000/api/videos/admin');
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setVideos(data);
      
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//       setError(`Failed to load videos: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type.startsWith('video/')) {
//         // Create preview URL
//         const videoUrl = URL.createObjectURL(file);
//         setVideoPreview(videoUrl);
//         setFormData(prev => ({ ...prev, videoFile: file }));
//       } else {
//         alert('Please select a video file (MP4, WebM, etc.)');
//         e.target.value = '';
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.videoFile && !editingId) {
//       alert('Please select a video file');
//       return;
//     }

//     if (!formData.title.trim()) {
//       alert('Please enter a title');
//       return;
//     }

//     setUploading(true);
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       const data = new FormData();
      
//       data.append('title', formData.title);
//       data.append('description', formData.description);
//       data.append('gradient_classes', formData.gradient_classes);
//       data.append('display_order', formData.display_order);
//       data.append('is_active', formData.is_active);
      
//       if (formData.videoFile) {
//         data.append('videoFile', formData.videoFile);
//       }

//       let url = 'http://localhost:5000/api/videos';
//       let method = 'POST';

//       if (editingId) {
//         url = `http://localhost:5000/api/videos/${editingId}`;
//         method = 'PUT';
//       }
      
//       const response = await fetch(url, {
//         method: method,
//         body: data
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       setSuccessMessage(result.message || 'Video saved successfully!');
//       resetForm();
//       setTimeout(() => fetchVideos(), 500);
      
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (video) => {
//     setEditingId(video.id);
//     setFormData({
//       title: video.title,
//       description: video.description || '',
//       gradient_classes: video.gradient_classes || 'from-emerald-500/20 to-cyan-500/20',
//       display_order: video.display_order || 0,
//       is_active: video.is_active,
//       videoFile: null
//     });
    
//     setVideoPreview(video.video_url);
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/videos/${id}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || errorData.message || 'Failed to delete video');
//       }

//       const result = await response.json();
//       setSuccessMessage(result.message || 'Video deleted successfully!');
//       fetchVideos();
      
//     } catch (error) {
//       console.error('Error:', error);
//       setError(`Failed to delete video: ${error.message}`);
//     }
//   };

//   const handleToggleActive = async (id, currentStatus) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/videos/${id}/toggle`, {
//         method: 'PATCH'
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || errorData.message || 'Failed to update status');
//       }

//       const result = await response.json();
//       setSuccessMessage(result.message || 'Video status updated!');
//       setTimeout(() => fetchVideos(), 300);
      
//     } catch (error) {
//       console.error('Error:', error);
//       setError(`Failed to update video status: ${error.message}`);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       gradient_classes: 'from-emerald-500/20 to-cyan-500/20',
//       display_order: videos.length,
//       is_active: true,
//       videoFile: null
//     });
//     setEditingId(null);
//     setVideoPreview(null);
//     setError(null);
//     setSuccessMessage(null);
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleRetry = () => {
//     fetchVideos();
//   };

//   useEffect(() => {
//     if (successMessage || error) {
//       const timer = setTimeout(() => {
//         setSuccessMessage(null);
//         setError(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage, error]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-300 text-lg">Loading videos...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="mb-10">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
//                 Video Carousel Manager
//               </h1>
//               <p className="text-gray-400 mt-2">Manage hero section videos - Changes appear instantly on the website</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={fetchVideos}
//                 className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh
//               </button>
//               <button
//                 onClick={resetForm}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
//               >
//                 Add New Video
//               </button>
//             </div>
//           </div>
          
//           {/* Messages */}
//           {successMessage && (
//             <div className="mb-4 p-4 bg-green-900/30 border border-green-500/30 rounded-xl backdrop-blur-sm animate-fadeIn">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
//                   <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <p className="text-green-300">{successMessage}</p>
//               </div>
//             </div>
//           )}
          
//           {error && (
//             <div className="mb-4 p-4 bg-red-900/30 border border-red-500/30 rounded-xl backdrop-blur-sm animate-fadeIn">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
//                     <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <p className="text-red-300">{error}</p>
//                 </div>
//                 <button 
//                   onClick={handleRetry}
//                   className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
//                 >
//                   Retry
//                 </button>
//               </div>
//             </div>
//           )}
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left column - Form */}
//           <div className="lg:col-span-2">
//             <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
//               <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700/50">
//                 <div>
//                   <h2 className="text-2xl font-bold">
//                     {editingId ? `Edit Video` : 'Add New Video'}
//                   </h2>
//                   <p className="text-gray-400 text-sm mt-1">
//                     {editingId ? 'Update video details' : 'Upload new video for hero section'}
//                   </p>
//                 </div>
//                 {editingId && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
//                       Editing ID: {editingId}
//                     </span>
//                     <button
//                       onClick={resetForm}
//                       className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Title & Gradient Row */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-3">
//                     <label className="block text-sm font-medium text-gray-300">
//                       Video Title *
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
//                       required
//                       placeholder="Enter a descriptive title"
//                     />
//                   </div>

//                   <div className="space-y-3">
//                     <label className="block text-sm font-medium text-gray-300">
//                       Gradient Overlay
//                     </label>
//                     <select
//                       name="gradient_classes"
//                       value={formData.gradient_classes}
//                       onChange={handleInputChange}
//                       className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
//                     >
//                       {gradientOptions.map(option => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-3">
//                   <label className="block text-sm font-medium text-gray-300">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows="3"
//                     className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 resize-none"
//                     placeholder="Describe the video content (optional)"
//                   />
//                 </div>

//                 {/* Display Order & Active Status */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-3">
//                     <label className="block text-sm font-medium text-gray-300">
//                       Display Order
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="number"
//                         name="display_order"
//                         value={formData.display_order}
//                         onChange={handleInputChange}
//                         min="0"
//                         className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
//                       />
//                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                         <span className="text-gray-400 text-sm">#</span>
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-500">Lower numbers appear first in carousel</p>
//                   </div>

//                   <div className="flex items-center space-x-4 p-4 bg-gray-900/30 rounded-xl">
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         name="is_active"
//                         id="is_active"
//                         checked={formData.is_active}
//                         onChange={handleInputChange}
//                         className="sr-only"
//                       />
//                       <label
//                         htmlFor="is_active"
//                         className={`flex items-center cursor-pointer ${formData.is_active ? 'text-green-400' : 'text-gray-400'}`}
//                       >
//                         <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${formData.is_active ? 'bg-green-500/20' : 'bg-gray-700'}`}>
//                           <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${formData.is_active ? 'translate-x-6' : ''}`}></div>
//                         </div>
//                         <span className="ml-3 font-medium">
//                           {formData.is_active ? 'Active' : 'Inactive'}
//                         </span>
//                       </label>
//                     </div>
//                     <span className="text-sm text-gray-400">Show in carousel</span>
//                   </div>
//                 </div>

//                 {/* Video Upload */}
//                 <div className="space-y-3">
//                   <label className="block text-sm font-medium text-gray-300">
//                     {editingId ? 'Video File (Keep current or upload new)' : 'Video File *'}
//                   </label>
//                   <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 transition-all duration-200 hover:border-blue-500/50">
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="video/*"
//                       onChange={handleFileSelect}
//                       className="hidden"
//                       id="video-upload"
//                       required={!editingId}
//                     />
//                     <label
//                       htmlFor="video-upload"
//                       className="flex flex-col items-center justify-center cursor-pointer"
//                     >
//                       <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
//                         <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                       <p className="text-gray-300 font-medium mb-2">
//                         {formData.videoFile ? formData.videoFile.name : 'Click to select video'}
//                       </p>
//                       <p className="text-gray-500 text-sm text-center">
//                         {editingId ? 'Leave empty to keep current video' : 'MP4, WebM, OGG, MOV, AVI, MKV (Max 500MB)'}
//                       </p>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Video Preview */}
//                 {videoPreview && (
//                   <div className="space-y-3">
//                     <label className="block text-sm font-medium text-gray-300">
//                       Preview
//                     </label>
//                     <div className="bg-black/50 rounded-xl overflow-hidden border border-gray-700">
//                       <video
//                         src={videoPreview}
//                         className="w-full h-48 md:h-56 object-cover"
//                         controls
//                         preload="metadata"
//                       >
//                         Your browser does not support the video tag.
//                       </video>
//                     </div>
//                   </div>
//                 )}

//                 {/* Submit Button */}
//                 <div className="pt-6 border-t border-gray-700/50">
//                   <button
//                     type="submit"
//                     disabled={uploading}
//                     className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/20"
//                   >
//                     {uploading ? (
//                       <>
//                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         {editingId ? 'Updating Video...' : 'Uploading Video...'}
//                       </>
//                     ) : (
//                       <>
//                         {editingId ? (
//                           <>
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                             Update Video
//                           </>
//                         ) : (
//                           <>
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                             </svg>
//                             Upload Video
//                           </>
//                         )}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* Right column - Video List */}
//           <div className="lg:col-span-1">
//             <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl h-full">
//               <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700/50">
//                 <div>
//                   <h2 className="text-2xl font-bold">Video Library</h2>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="text-sm text-gray-400">{videos.length} videos</span>
//                     <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
//                       {videos.filter(v => v.is_active).length} active
//                     </span>
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                   <input
//                     type="text"
//                     placeholder="Search videos..."
//                     className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm w-40 focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//               </div>
              
//               {videos.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-20 h-20 mx-auto mb-6 bg-gray-900/50 rounded-full flex items-center justify-center">
//                     <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <p className="text-gray-400 text-lg mb-2">No videos yet</p>
//                   <p className="text-gray-500 text-sm">Upload your first video to get started</p>
//                   <p className="text-gray-500 text-xs mt-2">Videos will appear in the hero section</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
//                   {videos.map((video, index) => (
//                     <div
//                       key={video.id}
//                       className={`group relative bg-gray-900/30 rounded-xl p-4 border transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/30 ${
//                         video.is_active ? 'border-green-500/20' : 'border-red-500/20'
//                       }`}
//                     >
//                       <div className="flex items-start gap-4">
//                         {/* Thumbnail */}
//                         <div className="flex-shrink-0 relative">
//                           <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
//                             <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                           <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
//                             video.is_active ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
//                           }`}>
//                             <div className={`w-2 h-2 rounded-full ${video.is_active ? 'bg-green-400' : 'bg-red-400'}`}></div>
//                           </div>
//                         </div>
                        
//                         {/* Content */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between">
//                             <div>
//                               <h3 className="font-medium text-white truncate" title={video.title}>
//                                 {video.title}
//                               </h3>
//                               <p className="text-sm text-gray-400 mt-1 line-clamp-1">
//                                 {video.description || 'No description'}
//                               </p>
//                             </div>
//                             <span className="text-xs px-2 py-1 bg-gray-800 rounded-lg text-gray-400">
//                               #{video.display_order}
//                             </span>
//                           </div>
                          
//                           <div className="flex items-center gap-2 mt-4">
//                             <button
//                               onClick={() => handleEdit(video)}
//                               className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
//                             >
//                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                               </svg>
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleToggleActive(video.id, video.is_active)}
//                               className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
//                                 video.is_active
//                                   ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300'
//                                   : 'bg-green-500/10 hover:bg-green-500/20 text-green-300'
//                               }`}
//                             >
//                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 {video.is_active ? (
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
//                                 ) : (
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                 )}
//                               </svg>
//                               {video.is_active ? 'Deactivate' : 'Activate'}
//                             </button>
//                             <button
//                               onClick={() => handleDelete(video.id)}
//                               className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
//                             >
//                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                               </svg>
//                               Delete
//                             </button>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* ID Badge */}
//                       <div className="absolute -bottom-2 -right-2">
//                         <span className="text-xs px-2 py-1 bg-gray-900/80 backdrop-blur-sm rounded-lg text-gray-500">
//                           ID: {video.id}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer Stats */}
//         <div className="mt-10 pt-6 border-t border-gray-800/50">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <div className="bg-gray-800/30 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-400 text-sm">Total Videos</p>
//                   <p className="text-2xl font-bold mt-1">{videos.length}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gray-800/30 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-400 text-sm">Active Videos</p>
//                   <p className="text-2xl font-bold mt-1 text-green-400">
//                     {videos.filter(v => v.is_active).length}
//                   </p>
//                 </div>
//                 <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gray-800/30 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-400 text-sm">Inactive Videos</p>
//                   <p className="text-2xl font-bold mt-1 text-red-400">
//                     {videos.filter(v => !v.is_active).length}
//                   </p>
//                 </div>
//                 <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gray-800/30 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-400 text-sm">Carousel Order</p>
//                   <p className="text-2xl font-bold mt-1">
//                     {videos.length > 0 ? `${Math.min(...videos.map(v => v.display_order))} - ${Math.max(...videos.map(v => v.display_order))}` : '0'}
//                   </p>
//                 </div>
//                 <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminVideoManager;




// import React, { useState, useEffect, useRef } from 'react';
// import './AdminVideoManager.css';

// const AdminVideoManager = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const fileInputRef = useRef(null);

//   // Fetch all videos for the admin list
//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await fetch('http://localhost:5000/api/videos/admin');
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setVideos(data);
      
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//       setError(`Failed to load videos: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type.startsWith('video/')) {
//         // Create preview URL
//         const videoUrl = URL.createObjectURL(file);
//         setVideoPreview(videoUrl);
//       } else {
//         alert('Please select a video file (MP4, WebM, etc.)');
//         e.target.value = '';
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const file = fileInputRef.current?.files[0];
//     if (!file && !editingId) {
//       alert('Please select a video file');
//       return;
//     }

//     setUploading(true);
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       const data = new FormData();
      
//       // Auto-generate title from filename
//       const title = file ? file.name.replace(/\.[^/.]+$/, "") : `Video ${videos.length + 1}`;
//       data.append('title', title);
//       data.append('description', '');
//       data.append('gradient_classes', 'from-emerald-500/20 to-cyan-500/20');
//       data.append('display_order', videos.length);
//       data.append('is_active', true);
      
//       if (file) {
//         data.append('videoFile', file);
//       }

//       let url = 'http://localhost:5000/api/videos';
//       let method = 'POST';

//       if (editingId) {
//         url = `http://localhost:5000/api/videos/${editingId}`;
//         method = 'PUT';
//       }
      
//       const response = await fetch(url, {
//         method: method,
//         body: data
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       setSuccessMessage(result.message || 'Video saved successfully!');
//       resetForm();
//       setTimeout(() => fetchVideos(), 500);
      
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (video) => {
//     setEditingId(video.id);
//     setVideoPreview(video.video_url);
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/videos/${id}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || errorData.message || 'Failed to delete video');
//       }

//       const result = await response.json();
//       setSuccessMessage(result.message || 'Video deleted successfully!');
//       fetchVideos();
      
//     } catch (error) {
//       console.error('Error:', error);
//       setError(`Failed to delete video: ${error.message}`);
//     }
//   };

//   const handleToggleActive = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/videos/${id}/toggle`, {
//         method: 'PATCH'
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || errorData.message || 'Failed to update status');
//       }

//       const result = await response.json();
//       setSuccessMessage(result.message || 'Video status updated!');
//       setTimeout(() => fetchVideos(), 300);
      
//     } catch (error) {
//       console.error('Error:', error);
//       setError(`Failed to update video status: ${error.message}`);
//     }
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setVideoPreview(null);
//     setError(null);
//     setSuccessMessage(null);
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleRetry = () => {
//     fetchVideos();
//   };

//   useEffect(() => {
//     if (successMessage || error) {
//       const timer = setTimeout(() => {
//         setSuccessMessage(null);
//         setError(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage, error]);

//   if (loading) {
//     return (
//       <div className="admin-video-manager-loading">
//         <div className="spinner"></div>
//         <p>Loading videos...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-video-manager">
//       <header className="admin-header">
//         <div className="header-content">
//           <div className="header-title">
//             <h1>Video Carousel Manager</h1>
//             <p>Upload and manage videos for the hero section</p>
//           </div>
//           <div className="header-actions">
//             <button onClick={fetchVideos} className="btn btn-secondary">
//               <span className="btn-icon">↻</span>
//               Refresh
//             </button>
//             <button onClick={resetForm} className="btn btn-primary">
//               Upload Video
//             </button>
//           </div>
//         </div>
        
//         {/* Messages */}
//         {successMessage && (
//           <div className="message success">
//             <div className="message-icon">✓</div>
//             <p>{successMessage}</p>
//           </div>
//         )}
        
//         {error && (
//           <div className="message error">
//             <div className="message-content">
//               <div className="message-icon">✗</div>
//               <p>{error}</p>
//             </div>
//             <button onClick={handleRetry} className="btn btn-error">
//               Retry
//             </button>
//           </div>
//         )}
//       </header>

//       <div className="admin-content">
//         <div className="form-section">
//           <div className="form-card">
//             <div className="form-header">
//               <div>
//                 <h2>{editingId ? 'Replace Video' : 'Upload New Video'}</h2>
//                 <p>{editingId ? 'Replace existing video' : 'Upload video for hero section'}</p>
//               </div>
//               {editingId && (
//                 <div className="edit-info">
//                   <span className="edit-badge">Editing ID: {editingId}</span>
//                   <button onClick={resetForm} className="btn btn-cancel">
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>

//             <form onSubmit={handleSubmit} className="video-form">
//               <div className="form-group">
//                 <label>Video File *</label>
//                 <div className="file-upload-area">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="video/*"
//                     onChange={handleFileSelect}
//                     className="file-input"
//                     id="video-upload"
//                     required={!editingId}
//                   />
//                   <label htmlFor="video-upload" className="file-upload-label">
//                     <div className="upload-icon">📁</div>
//                     <p className="file-name">
//                       {fileInputRef.current?.files[0]?.name || 'Click to select video'}
//                     </p>
//                     <p className="file-help">
//                       {editingId ? 'Leave empty to keep current video' : 'MP4, WebM, OGG, MOV, AVI, MKV (Max 500MB)'}
//                     </p>
//                   </label>
//                 </div>
//               </div>

//               {videoPreview && (
//                 <div className="form-group">
//                   <label>Preview</label>
//                   <div className="video-preview">
//                     <video
//                       src={videoPreview}
//                       controls
//                       preload="metadata"
//                       autoPlay
//                       muted
//                     >
//                       Your browser does not support the video tag.
//                     </video>
//                   </div>
//                 </div>
//               )}

//               <div className="form-submit">
//                 <button type="submit" disabled={uploading} className="btn btn-submit">
//                   {uploading ? (
//                     <>
//                       <span className="spinner-small"></span>
//                       {editingId ? 'Replacing Video...' : 'Uploading Video...'}
//                     </>
//                   ) : editingId ? 'Replace Video' : 'Upload Video'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         <div className="list-section">
//           <div className="list-card">
//             <div className="list-header">
//               <div>
//                 <h2>Video Library</h2>
//                 <div className="list-stats">
//                   <span>{videos.length} videos</span>
//                   <span className="active-badge">
//                     {videos.filter(v => v.is_active).length} active
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             {videos.length === 0 ? (
//               <div className="empty-state">
//                 <div className="empty-icon">📹</div>
//                 <p className="empty-title">No videos yet</p>
//                 <p className="empty-text">Upload your first video to get started</p>
//                 <p className="empty-help">Videos will appear in the hero section</p>
//               </div>
//             ) : (
//               <div className="video-list">
//                 {videos.map((video) => (
//                   <div
//                     key={video.id}
//                     className={`video-item ${video.is_active ? 'active' : 'inactive'}`}
//                   >
//                     <div className="video-content">
//                       <div className="video-thumbnail">
//                         <div className="thumbnail-placeholder">🎬</div>
//                         <div className={`status-indicator ${video.is_active ? 'active' : 'inactive'}`}></div>
//                       </div>
                      
//                       <div className="video-details">
//                         <div className="video-header">
//                           <div>
//                             <h3 title={video.title}>{video.title}</h3>
//                             <p className="video-info">
//                               Order: #{video.display_order}
//                             </p>
//                           </div>
//                         </div>
                        
//                         <div className="video-actions">
//                           <button onClick={() => handleEdit(video)} className="btn-action btn-edit">
//                             <span className="action-icon">✏️</span>
//                             Edit
//                           </button>
//                           <button 
//                             onClick={() => handleToggleActive(video.id)}
//                             className={`btn-action ${video.is_active ? 'btn-deactivate' : 'btn-activate'}`}
//                           >
//                             <span className="action-icon">
//                               {video.is_active ? '👁️‍🗨️' : '👁️'}
//                             </span>
//                             {video.is_active ? 'Deactivate' : 'Activate'}
//                           </button>
//                           <button onClick={() => handleDelete(video.id)} className="btn-action btn-delete">
//                             <span className="action-icon">🗑️</span>
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="video-id">ID: {video.id}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminVideoManager;




import React, { useState, useEffect, useRef } from 'react';
import './AdminVideoManager.css';
import AdminLayout from '../../Shared/Navbar/Navbar';

const AdminVideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch all videos for the admin list
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/videos/admin');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setVideos(data);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError(`Failed to load videos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        // Create preview URL
        const videoUrl = URL.createObjectURL(file);
        setVideoPreview(videoUrl);
      } else {
        alert('Please select a video file (MP4, WebM, etc.)');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const file = fileInputRef.current?.files[0];
    if (!file && !editingId) {
      alert('Please select a video file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data = new FormData();
      
      // Auto-generate title from filename
      const title = file ? file.name.replace(/\.[^/.]+$/, "") : `Video ${videos.length + 1}`;
      data.append('title', title);
      data.append('description', '');
      data.append('gradient_classes', 'from-emerald-500/20 to-cyan-500/20');
      data.append('display_order', videos.length);
      data.append('is_active', true);
      
      if (file) {
        data.append('videoFile', file);
      }

      let url = 'http://localhost:5000/api/videos';
      let method = 'POST';

      if (editingId) {
        url = `http://localhost:5000/api/videos/${editingId}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method: method,
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccessMessage(result.message || 'Video saved successfully!');
      resetForm();
      setTimeout(() => fetchVideos(), 500);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (video) => {
    setEditingId(video.id);
    setVideoPreview(video.video_url);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/videos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to delete video');
      }

      const result = await response.json();
      setSuccessMessage(result.message || 'Video deleted successfully!');
      fetchVideos();
      
    } catch (error) {
      console.error('Error:', error);
      setError(`Failed to delete video: ${error.message}`);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${id}/toggle`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to update status');
      }

      const result = await response.json();
      setSuccessMessage(result.message || 'Video status updated!');
      setTimeout(() => fetchVideos(), 300);
      
    } catch (error) {
      console.error('Error:', error);
      setError(`Failed to update video status: ${error.message}`);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setVideoPreview(null);
    setError(null);
    setSuccessMessage(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRetry = () => {
    fetchVideos();
  };

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  if (loading) {
    return (
      <div className="admin-video-manager-loading">
        <div className="spinner"></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
    <div className="admin-video-manager">
      <header className="admin-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Video Carousel Manager</h1>
            <p>Upload and manage videos for the hero section</p>
          </div>
          <div className="header-actions">
            <button onClick={fetchVideos} className="btn btn-secondary">
              <span className="btn-icon">↻</span>
              Refresh
            </button>
            <button onClick={resetForm} className="btn btn-primary">
              Upload Video
            </button>
          </div>
        </div>
        
        {/* Messages */}
        {successMessage && (
          <div className="message success">
            <div className="message-icon">✓</div>
            <p>{successMessage}</p>
          </div>
        )}
        
        {error && (
          <div className="message error">
            <div className="message-content">
              <div className="message-icon">✗</div>
              <p>{error}</p>
            </div>
            <button onClick={handleRetry} className="btn btn-error">
              Retry
            </button>
          </div>
        )}
      </header>

      <div className="admin-content">
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <div>
                <h2>{editingId ? 'Replace Video' : 'Upload New Video'}</h2>
                <p>{editingId ? 'Replace existing video' : 'Upload video for hero section'}</p>
              </div>
              {editingId && (
                <div className="edit-info">
                  <span className="edit-badge">Editing ID: {editingId}</span>
                  <button onClick={resetForm} className="btn btn-cancel">
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="video-form">
              <div className="form-group">
                <label>Video File *</label>
                <div className="file-upload-area">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="file-input"
                    id="video-upload"
                    required={!editingId}
                  />
                  <label htmlFor="video-upload" className="file-upload-label">
                    <div className="upload-icon">📁</div>
                    <p className="file-name">
                      {fileInputRef.current?.files[0]?.name || 'Click to select video'}
                    </p>
                    <p className="file-help">
                      {editingId ? 'Leave empty to keep current video' : 'MP4, WebM, OGG, MOV, AVI, MKV (Max 500MB)'}
                    </p>
                  </label>
                </div>
              </div>

              {videoPreview && (
                <div className="form-group">
                  <label>Preview</label>
                  <div className="video-preview">
                    <video
                      src={videoPreview}
                      controls
                      preload="metadata"
                      autoPlay
                      muted
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              <div className="form-submit">
                <button type="submit" disabled={uploading} className="btn btn-submit">
                  {uploading ? (
                    <>
                      <span className="spinner-small"></span>
                      {editingId ? 'Replacing Video...' : 'Uploading Video...'}
                    </>
                  ) : editingId ? 'Replace Video' : 'Upload Video'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="list-section">
          <div className="list-card">
            <div className="list-header">
              <div>
                <h2>Video Library</h2>
                <div className="list-stats">
                  <span>{videos.length} videos</span>
                  <span className="active-badge">
                    {videos.filter(v => v.is_active).length} active
                  </span>
                </div>
              </div>
            </div>
            
            {videos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📹</div>
                <p className="empty-title">No videos yet</p>
                <p className="empty-text">Upload your first video to get started</p>
                <p className="empty-help">Videos will appear in the hero section</p>
              </div>
            ) : (
              <div className="video-grid">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className={`video-card ${video.is_active ? 'active' : 'inactive'}`}
                  >
                    <div className="card-header">
                      <div className="video-thumbnail">
                        <div className="thumbnail-overlay">
                          <div className="play-icon">▶️</div>
                        </div>
                        <video
                          src={video.video_url}
                          className="thumbnail-video"
                          preload="metadata"
                          muted
                          loop
                        />
                      </div>
                      <div className={`status-badge ${video.is_active ? 'active' : 'inactive'}`}>
                        {video.is_active ? 'Active' : 'Inactive'}
                      </div>
                      <div className="order-badge">#{video.display_order}</div>
                    </div>
                    
                    <div className="card-body">
                      <h3 className="video-title" title={video.title}>
                        {video.title}
                      </h3>
                      <div className="video-meta">
                        <span className="meta-item">ID: {video.id}</span>
                        <span className="meta-item">
                          {new Date(video.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      <div className="card-actions">
                        <button onClick={() => handleEdit(video)} className="card-btn btn-edit">
                          <span className="card-btn-icon">✏️</span>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleToggleActive(video.id)}
                          className={`card-btn ${video.is_active ? 'btn-deactivate' : 'btn-activate'}`}
                        >
                          <span className="card-btn-icon">
                            {video.is_active ? '👁️‍🗨️' : '👁️'}
                          </span>
                          {video.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleDelete(video.id)} className="card-btn btn-delete">
                          <span className="card-btn-icon">🗑️</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminVideoManager;