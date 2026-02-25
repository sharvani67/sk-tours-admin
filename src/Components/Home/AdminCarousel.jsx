import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Image as ImageIcon,
  Plus,
  Save,
  Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";

const API_URL = `${baseurl}/api`;

const AdminCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: ""
  });
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const loadImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/carousel-images/admin`);
      if (res.data?.success) setImages(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const toggleActive = async (id, status) => {
    try {
      await axios.put(`${API_URL}/carousel-images/${id}`, {
        is_active: !status
      });
      loadImages();
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await axios.delete(`${API_URL}/carousel-images/${id}`);
      loadImages();
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image");
    }
  };

  const moveImage = async (index, dir) => {
    if (
      (dir === "up" && index === 0) ||
      (dir === "down" && index === images.length - 1)
    )
      return;

    const updated = [...images];
    const swapIndex = dir === "up" ? index - 1 : index + 1;

    [updated[index], updated[swapIndex]] = [
      updated[swapIndex],
      updated[index]
    ];

    const payload = updated.map((img, i) => ({
      id: img.id,
      display_order: i
    }));

    try {
      await axios.put(`${API_URL}/carousel-images/update-order`, {
        images: payload
      });
      setImages(updated);
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order");
    }
  };

  const handleEditClick = (image) => {
    setEditingId(image.id);
    setEditForm({
      title: image.title || "",
      description: image.description || ""
    });
    setEditFile(null);
    setEditPreview("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "" });
    setEditFile(null);
    setEditPreview("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditFile(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const handleEditSubmit = async (imageId) => {
    try {
      setUpdating(true);
      
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      
      if (editFile) {
        formData.append("image", editFile);
      }

      await axios.put(`${API_URL}/carousel-images/${imageId}/update-with-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setEditingId(null);
      setEditForm({ title: "", description: "" });
      setEditFile(null);
      setEditPreview("");
      loadImages();
    } catch (err) {
      console.error("Error updating image:", err);
      alert("Failed to update image");
    } finally {
      setUpdating(false);
    }
  };

  // Helper function to get image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/400x220?text=No+Image";
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${baseurl}${imageUrl}`;
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold carousel">Carousel Images</h1>
          <button
            onClick={() => navigate("/admin/carousel/upload")}
            className="flex items-center gap-2 px-6 py-3 rounded-lg
              bg-blue-600 text-black font-medium shadow
              hover:bg-blue-700 hover:shadow-md transition"
          >
            <Plus size={18} />
            Upload Image
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border">
            <ImageIcon className="mx-auto mb-4 text-gray-400" size={40} />
            <p>No images found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="bg-white rounded-xl shadow border flex flex-col"
              >
                {/* Image Section with EXPLICIT fixed dimensions */}
                <div 
                  className="bg-gray-100 rounded-t-xl overflow-hidden"
                  style={{ 
                    width: '100%', 
                    height: '220px',
                    position: 'relative'
                  }}
                >
                  {editingId === img.id && editPreview ? (
                    <img
                      src={editPreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <img
                      src={getImageUrl(img.image_url)}
                      alt={img.title || "Carousel image"}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x220?text=Image+Not+Found";
                        e.target.style.objectFit = 'cover';
                      }}
                    />
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 p-4">
                  {editingId === img.id ? (
                    /* Edit Mode */
                    <div className="space-y-4">
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Replace Image (optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                          <input
                            type="file"
                            id={`file-${img.id}`}
                            hidden
                            onChange={handleFileSelect}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`file-${img.id}`}
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Upload size={24} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Click to select new image</span>
                          </label>
                        </div>
                      </div>

                      {/* Title Input */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter title"
                        />
                      </div>

                      {/* Description Input */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                          placeholder="Enter description"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleEditSubmit(img.id)}
                          disabled={updating}
                          className="flex-1 px-3 py-2 bg-green-600 text-black text-sm rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1"
                        >
                          <Save size={14} />
                          {updating ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Order #{img.display_order + 1}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(img.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </p>
                        {img.title && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-1 font-medium">
                            {img.title}
                          </p>
                        )}
                        {img.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {img.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                        {/* Move buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveImage(index, "up")}
                            disabled={index === 0}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            title="Move up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => moveImage(index, "down")}
                            disabled={index === images.length - 1}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            title="Move down"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleActive(img.id, img.is_active)}
                            className={`p-2 rounded-lg transition-all ${
                              img.is_active
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            title={img.is_active ? "Active" : "Inactive"}
                          >
                            {img.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>

                          <button 
                            onClick={() => handleEditClick(img)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(img.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCarousel;