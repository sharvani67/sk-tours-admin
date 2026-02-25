import React, { useState } from "react";
import axios from "axios";
import { Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Shared/Navbar/Navbar";
import { baseurl } from "../../Api/Baseurl";

const API_URL = `${baseurl}/api`;

const UploadCarouselImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const uploadImage = async () => {
    if (!file) return alert("Select image");
    setLoading(true);

    const fd = new FormData();
    fd.append("image", file);

    await axios.post(`${API_URL}/carousel-images/upload`, fd);
    navigate("/carousel-images");
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-6">Upload Carousel Image</h2>

          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl
              p-10 text-center bg-gray-50 hover:bg-gray-100 
              hover:border-blue-500 transition-colors"
          >
            <input 
              type="file" 
              hidden 
              id="upload" 
              onChange={onSelect}
              accept="image/*"
            />
            <label 
              htmlFor="upload"
              className="cursor-pointer block"
            >
              <Upload size={44} className="mx-auto text-gray-400 mb-3" />
              <p className="font-medium text-gray-600">Click to select image</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>

          {preview && (
            <div className="mt-4 w-full h-56 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          <button
            onClick={uploadImage}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-lg font-semibold
              bg-blue-600 text-black shadow
              hover:bg-blue-700 hover:shadow-md transition
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadCarouselImage;