import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Upload,
  Image,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  X,
  Plus,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';

const API_URL = `${baseurl}/api`;

const AdminCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Upload form state
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    display_order: 0,
    is_active: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Load images
  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/carousel-images/admin`);
      
      if (response.data.success) {
        setImages(response.data.data);
      }
    } catch (err) {
      setError('Failed to load images: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }
    
    if (!uploadData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      setUploading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('display_order', uploadData.display_order);
      formData.append('is_active', uploadData.is_active);
      
      const response = await axios.post(
        `${API_URL}/carousel-images/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        setSuccess('Image uploaded successfully!');
        setUploadData({
          title: '',
          description: '',
          display_order: 0,
          is_active: true
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setShowUploadForm(false);
        
        loadImages();
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const response = await axios.delete(`${API_URL}/carousel-images/${id}`);
      
      if (response.data.success) {
        setSuccess('Image deleted successfully!');
        loadImages();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Start editing
  const startEdit = (image) => {
    setEditingId(image.id);
    setEditData({
      title: image.title,
      description: image.description || '',
      display_order: image.display_order,
      is_active: image.is_active
    });
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/carousel-images/${id}`, editData);
      
      if (response.data.success) {
        setSuccess('Image updated successfully!');
        setEditingId(null);
        loadImages();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Move image up/down in order
  const moveImage = async (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === images.length - 1)) {
      return;
    }
    
    const newImages = [...images];
    const newOrder = index + (direction === 'up' ? -1 : 1);
    
    // Swap display orders
    [newImages[index].display_order, newImages[newOrder].display_order] = 
    [newImages[newOrder].display_order, newImages[index].display_order];
    
    // Sort by display order
    newImages.sort((a, b) => a.display_order - b.display_order);
    
    // Prepare bulk update data
    const updateData = newImages.map((img, idx) => ({
      id: img.id,
      display_order: idx
    }));
    
    try {
      const response = await axios.put(`${API_URL}/carousel-images/update-order`, {
        images: updateData
      });
      
      if (response.data.success) {
        setImages(newImages);
        setSuccess('Order updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update order: ' + (err.response?.data?.message || err.message));
    }
  };

  // Toggle active status
  const toggleActive = async (id, currentStatus) => {
    try {
      const response = await axios.put(`${API_URL}/carousel-images/${id}`, {
        is_active: !currentStatus
      });
      
      if (response.data.success) {
        setSuccess('Status updated successfully!');
        loadImages();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <AdminLayout>
      <div className="admin-carousel min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Carousel Images Management</h1>
              <p className="text-gray-600">Upload and manage images for the travel popup carousel</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="btn-primary flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-300"
              >
                <Plus className="h-5 w-5" />
                {showUploadForm ? 'Cancel Upload' : 'Upload Image'}
              </button>
              <button
                onClick={loadImages}
                className="btn-secondary flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium transition-all duration-300 hover:bg-gray-50"
              >
                <RefreshCw className="h-5 w-5" />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="alert-success mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
              <Check className="h-5 w-5" />
              {success}
            </div>
          )}
          
          {error && (
            <div className="alert-error mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <X className="h-5 w-5" />
              {error}
            </div>
          )}
          
          {/* Upload Form */}
          {showUploadForm && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Image</h2>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column: File upload and preview */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image File *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                          required
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <Upload className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              {selectedFile ? selectedFile.name : 'Click to select image'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      {previewUrl && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right column: Form fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={uploadData.title}
                        onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                        placeholder="Enter image title"
                        className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={uploadData.description}
                        onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                        placeholder="Enter image description"
                        rows="3"
                        className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={uploadData.display_order}
                        onChange={(e) => setUploadData({...uploadData, display_order: parseInt(e.target.value) || 0})}
                        className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={uploadData.is_active}
                        onChange={(e) => setUploadData({...uploadData, is_active: e.target.checked})}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                        Set as active (visible in carousel)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-primary flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      setUploadData({
                        title: '',
                        description: '',
                        display_order: 0,
                        is_active: true
                      });
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Images Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            All Images ({images.length})
            <span className="text-sm font-normal text-gray-600 ml-2">
              (Drag to reorder or use arrows)
            </span>
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No images uploaded yet.</p>
              <p className="text-gray-400 text-sm mt-1">Click "Upload Image" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  {/* Image Preview */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={`${baseurl}${image.image_url}`}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Active/Inactive badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${image.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {image.is_active ? 'Active' : 'Inactive'}
                    </div>
                    
                    {/* Order badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                      Order: {image.display_order}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {editingId === image.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="form-input w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Title"
                        />
                        
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          className="form-input w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Description"
                          rows="2"
                        />
                        
                        <input
                          type="number"
                          value={editData.display_order}
                          onChange={(e) => setEditData({...editData, display_order: parseInt(e.target.value) || 0})}
                          className="form-input w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Display Order"
                        />
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`active_${image.id}`}
                            checked={editData.is_active}
                            onChange={(e) => setEditData({...editData, is_active: e.target.checked})}
                            className="h-3 w-3 text-blue-600 rounded"
                          />
                          <label htmlFor={`active_${image.id}`} className="ml-1 text-xs text-gray-700">
                            Active
                          </label>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => saveEdit(image.id)}
                            className="btn-primary flex-1 py-1 text-xs text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                          {image.title}
                        </h3>
                        
                        {image.description && (
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {image.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between pt-3">
                          <div className="flex gap-1">
                            {/* Move buttons */}
                            <button
                              onClick={() => moveImage(index, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => moveImage(index, 'down')}
                              disabled={index === images.length - 1}
                              className={`p-1 rounded ${index === images.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex gap-1">
                            {/* Toggle active */}
                            <button
                              onClick={() => toggleActive(image.id, image.is_active)}
                              className={`p-1 rounded ${image.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-600 hover:bg-gray-100'}`}
                              title={image.is_active ? 'Set inactive' : 'Set active'}
                            >
                              {image.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            
                            {/* Edit */}
                            <button
                              onClick={() => startEdit(image)}
                              className="p-1 text-blue-600 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(image.id)}
                              className="p-1 text-red-600 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCarousel;