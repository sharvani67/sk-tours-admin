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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);

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
    
    try {
      setUploading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('image', selectedFile);
      
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
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      setEditingId(null);
      setSuccess('Image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Carousel Images Management</h1>
              <p className="text-gray-600 text-sm md:text-base">Upload and manage images for the travel popup carousel</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                {showUploadForm ? 'Cancel' : 'Upload Image'}
              </button>
              <button
                onClick={loadImages}
                className="btn-secondary flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium transition-all duration-300 hover:bg-gray-50 shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg flex items-center gap-3 animate-fadeIn">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5" />
              </div>
              <span className="font-medium">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center gap-3 animate-fadeIn">
              <div className="flex-shrink-0">
                <X className="h-5 w-5" />
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}
          
          {/* Upload Form */}
          {showUploadForm && (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-slideDown">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Upload New Image</h2>
                <div className="text-sm text-gray-500">
                  Required fields are marked with *
                </div>
              </div>
              
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left column: File upload and preview */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image File <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-blue-50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                          required
                        />
                        <label htmlFor="file-upload" className="cursor-pointer block">
                          <div className="flex flex-col items-center">
                            <Upload className="w-16 h-16 text-gray-400 mb-4 group-hover:text-blue-500" />
                            <p className="text-base text-gray-700 font-medium mb-1">
                              {selectedFile ? selectedFile.name : 'Choose an image file'}
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                            <button
                              type="button"
                              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors"
                            >
                              Browse Files
                            </button>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {previewUrl && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                        <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-contain p-2"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                            <p className="text-white text-sm font-medium">
                              {selectedFile?.name}
                            </p>
                            <p className="text-white/80 text-xs">
                              {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right column: Upload button */}
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 w-full">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                        <Upload className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Upload</h3>
                      <p className="text-gray-600 mb-6 max-w-md">
                        Click the button below to upload your selected image to the carousel.
                      </p>
                      
                      <button
                        type="submit"
                        disabled={uploading || !selectedFile}
                        className="btn-primary w-full max-w-xs py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {uploading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </span>
                        ) : (
                          'Upload Image'
                        )}
                      </button>
                      
                      {!selectedFile && (
                        <p className="mt-4 text-sm text-red-600">
                          Please select an image first
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Images Grid */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              All Images ({images.length})
            </h2>
            {images.length > 0 && (
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                Drag to reorder or use arrows
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center">
                <div className="loading-spinner mb-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading images...</p>
                <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300 shadow-sm">
              <div className="inline-flex flex-col items-center max-w-md mx-auto px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Image className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No images yet</h3>
                <p className="text-gray-500 mb-6">
                  Upload your first image to get started with the carousel
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Upload First Image
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image Preview */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={`${baseurl}${image.image_url}`}
                      alt="Carousel"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between">
                      <div className="flex gap-2">
                        <div className="px-3 py-1 bg-blue-600/90 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                          #{image.display_order + 1}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${image.is_active ? 'bg-green-600/90 text-white' : 'bg-gray-600/90 text-white'}`}>
                          {image.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-white bg-black/30 px-2 py-1 rounded-full">
                        {new Date(image.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Quick actions overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => toggleActive(image.id, image.is_active)}
                          className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
                          title={image.is_active ? 'Set Inactive' : 'Set Active'}
                        >
                          {image.is_active ? (
                            <EyeOff className="w-4 h-4 text-white" />
                          ) : (
                            <Eye className="w-4 h-4 text-white" />
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(image)}
                          className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="p-2 bg-red-500/80 backdrop-blur-sm hover:bg-red-600/90 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Move buttons */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveImage(index, 'up')}
                            disabled={index === 0}
                            className={`p-1.5 rounded-lg ${index === 0 
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveImage(index, 'down')}
                            disabled={index === images.length - 1}
                            className={`p-1.5 rounded-lg ${index === images.length - 1 
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Image info */}
                        <div className="ml-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Carousel Image #{image.display_order + 1}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded: {new Date(image.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status toggle */}
                      <button
                        onClick={() => toggleActive(image.id, image.is_active)}
                        className={`ml-2 p-2 rounded-lg transition-colors ${image.is_active 
                          ? 'bg-green-100 hover:bg-green-200 text-green-700' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        title={image.is_active ? 'Set Inactive' : 'Set Active'}
                      >
                        {image.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Edit mode */}
                    {editingId === image.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(image.id)}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
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
      
      {/* Add custom styles */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminCarousel;