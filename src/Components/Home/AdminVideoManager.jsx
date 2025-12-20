

import React, { useState, useEffect, useRef } from 'react';
import './AdminVideoManager.css';
import AdminLayout from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';



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
      
      const response = await fetch(`${baseurl}/api/videos/admin`);
      
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

      let url = `${baseurl}/api/videos`;
      let method = 'POST';

      if (editingId) {
        url = `${baseurl}/api/videos/${editingId}`;
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
      const response = await fetch(`${baseurl}/api/videos/${id}`, {
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
      const response = await fetch(`${baseurl}/api/videos/${id}/toggle`, {
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