import React, { useState, useEffect } from "react";
import Navbar from "../../Shared/Navbar/Navbar";
import { useNavigate, useParams } from 'react-router-dom';
import { baseurl } from "../../Api/Baseurl";
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const AddVendors = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [vendorDataLoaded, setVendorDataLoaded] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');
  const [showAddressFields, setShowAddressFields] = useState(true); 
  const [formData, setFormData] = useState({
    category_name: '',
    title: 'Mr.',
    first_name: '',
    last_name: '',
    position: '',
    company_name: '',
    website: '',
    email1: '',
    email2: '',
    mobile1: '',
    mobile2: '',
    mobile3: '',
    mobile4: '',
    landline: '',
    landline_code: '022',
    address1: '',
    address2: '',
    landmark: '',
    area: '',
    country: 'India',
    state: '',
    city: '',
    pin_code: '',
    visiting_card_type: '',
    remark: '',
    is_active: true
  });

  // File upload state
  const [files, setFiles] = useState({
    front: null,
    back: null,
    flip_front: null,
    flip_back: null,
    customer_profile: null
  });

  // Existing file paths (for display purposes)
  const [existingFiles, setExistingFiles] = useState({
    front_image: '',
    back_image: '',
    flip_front_image: '',
    flip_back_image: '',
    customer_profile: ''
  });

  // Static States
  const staticStates = [
    "Maharashtra",
    "Telangana",
    "Karnataka",
    "Tamil Nadu",
    "Gujarat"
  ];

  // Static Cities (State-wise)
  const staticCities = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Telangana: ["Hyderabad", "Warangal", "Karimnagar"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara"]
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch vendor data if id exists
  useEffect(() => {
    if (id) {
      setVendorDataLoaded(false);
      fetchVendorById(id);
    } else {
      // Reset for new vendor
      setFormData({
        category_name: '',
        title: 'Mr.',
        first_name: '',
        last_name: '',
        position: '',
        company_name: '',
        website: '',
        email1: '',
        email2: '',
        mobile1: '',
        mobile2: '',
        mobile3: '',
        mobile4: '',
        landline: '',
        landline_code: '022',
        address1: '',
        address2: '',
        landmark: '',
        area: '',
        country: 'India',
        state: '',
        city: '',
        pin_code: '',
        visiting_card_type: '',
        remark: '',
        is_active: true
      });
      setExistingFiles({
        front_image: '',
        back_image: '',
        flip_front_image: '',
        flip_back_image: '',
        customer_profile: ''
      });
      setVendorDataLoaded(true);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle add category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setCategoryError('Category name is required');
      return;
    }

    setCategoryLoading(true);
    setCategoryError('');
    setCategorySuccess('');

    try {
      const response = await axios.post(`${baseurl}/api/categories/add-category`, {
        name: newCategory.trim()
      });

      setCategorySuccess(response.data.message);
      
      // Refresh categories list
      await fetchCategories();
      
      // Auto-select the newly added category
      setFormData(prev => ({
        ...prev,
        category_name: newCategory.trim()
      }));

      // Close modal after 1 second
      setTimeout(() => {
        handleCloseModal();
        setCategorySuccess('');
        setNewCategory('');
      }, 1000);

    } catch (error) {
      setCategoryError(error.response?.data?.message || 'Failed to add category');
    } finally {
      setCategoryLoading(false);
    }
  };

  // Modal handlers
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewCategory('');
    setCategoryError('');
    setCategorySuccess('');
  };

  const fetchVendorById = async (vendorId) => {
    try {
      setLoading(true);
      console.log('Fetching vendor with ID:', vendorId);
      const response = await axios.get(`${baseurl}/api/vendors/${vendorId}`);
      console.log('Vendor data received:', response.data);
      const vendorData = response.data;
      
      // Set form data with fetched vendor data - using underscore naming
      const newFormData = {
        category_name: vendorData.category_name || '',
        title: vendorData.title || 'Mr.',
        first_name: vendorData.first_name || '',
        last_name: vendorData.last_name || '',
        position: vendorData.position || '',
        company_name: vendorData.company_name || '',
        website: vendorData.website || '',
        email1: vendorData.email1 || '',
        email2: vendorData.email2 || '',
        mobile1: vendorData.mobile1 || '',
        mobile2: vendorData.mobile2 || '',
        mobile3: vendorData.mobile3 || '',
        mobile4: vendorData.mobile4 || '',
        landline: vendorData.landline || '',
        landline_code: vendorData.landline_code || '022',
        address1: vendorData.address1 || '',
        address2: vendorData.address2 || '',
        landmark: vendorData.landmark || '',
        area: vendorData.area || '',
        country: vendorData.country || 'India',
        state: vendorData.state || '',
        city: vendorData.city || '',
        pin_code: vendorData.pin_code || '',
        visiting_card_type: vendorData.visiting_card_type || '',
        remark: vendorData.remark || '',
        is_active: vendorData.is_active === 1 ? true : false
      };
      
      // Set existing file paths
      setExistingFiles({
        front_image: vendorData.front_image || '',
        back_image: vendorData.back_image || '',
        flip_front_image: vendorData.flip_front_image || '',
        flip_back_image: vendorData.flip_back_image || '',
        customer_profile: vendorData.customer_profile || ''
      });
      
      setFormData(newFormData);
      setVendorDataLoaded(true);
      setInitialLoad(false);
    } catch (error) {
      console.error('Error fetching vendor:', error);
      setError('Failed to fetch vendor data');
      setVendorDataLoaded(true);
      setInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  // Handle form submit for Create/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append files with the correct field names expected by backend
      if (files.front) {
        formDataToSend.append('front', files.front);
      }
      if (files.back) {
        formDataToSend.append('back', files.back);
      }
      if (files.flip_front) {
        formDataToSend.append('flip_front', files.flip_front);
      }
      if (files.flip_back) {
        formDataToSend.append('flip_back', files.flip_back);
      }
      if (files.customer_profile) {
        formDataToSend.append('customer_profile', files.customer_profile);
      }

      let response;
      if (id) {
        // Update vendor
        response = await axios.put(`${baseurl}/api/vendors/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Vendor updated successfully!');
      } else {
        // Create vendor
        response = await axios.post(`${baseurl}/api/vendors`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Vendor created successfully!');
      }

      setTimeout(() => {
        navigate('/Vendors');
      }, 2000);

    } catch (error) {
      console.error('Error saving vendor:', error);
      setError(error.response?.data?.error || 'Failed to save vendor');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Navbar>
      <div className="container-fluid ven-container">
        {/* Back Button */}
        <div className="ven-back-btn mb-3 d-flex justify-content-between">
          <button 
            className="btn btn-info ven-btn-back"
            onClick={() => navigate('/Vendors')}
          >
            ← Back
          </button>
     
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
          </div>
        )}

        <div className="card ven-card p-4">
          <h3 className="mb-4">{id ? 'Edit Vendor' : 'Add New Vendor'}</h3>
          
          <form onSubmit={handleSubmit}>
            {/* Row 1 - Category with + button */}
            <div className="row ven-row mb-3">
              <div className="col-md-3 ven-field">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label ven-label">Category Name</label>
                  <button 
                    type="button"
                    className="btn btn-sm btn-primary rounded-circle"
                    onClick={handleShowModal}
                    style={{ width: '30px', height: '30px', padding: '0' }}
                    title="Add New Category"
                  >
                    +
                  </button>
                </div>
                <select 
                  className="form-select ven-input"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2 ven-field">
                <label className="form-label ven-label">Title</label>
                <select 
                  className="form-select ven-input"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                </select>
              </div>

              <div className="col-md-3 ven-field">
                <label className="form-label ven-label">First Name *</label>
                <input 
                  type="text" 
                  className="form-control ven-input"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-4 ven-field">
                <label className="form-label ven-label">Last Name</label>
                <input 
                  type="text" 
                  className="form-control ven-input"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Rest of your form remains exactly the same */}
            {/* Row 2 */}
            <div className="row ven-row mb-3">
              <div className="col-md-4 ven-field">
                <label className="form-label ven-label">Position</label>
                <input 
                  type="text" 
                  className="form-control ven-input"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-4 ven-field">
                <label className="form-label ven-label">Company Name</label>
                <input 
                  type="text" 
                  className="form-control ven-input"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-4 ven-field">
                <label className="form-label ven-label">Website</label>
                <input 
                  type="url" 
                  className="form-control ven-input"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Emails */}
            <div className="row ven-row mb-3">
              <div className="col-md-6 ven-field">
                <label className="form-label ven-label">Email 1</label>
                <input 
                  type="email" 
                  className="form-control ven-input"
                  name="email1"
                  value={formData.email1}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-6 ven-field">
                <label className="form-label ven-label">Email 2</label>
                <input 
                  type="email" 
                  className="form-control ven-input"
                  name="email2"
                  value={formData.email2}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Mobile Numbers */}
            <div className="row ven-row mb-3">
              {[1, 2, 3, 4].map((num) => (
                <div className="col-md-3 ven-field" key={num}>
                  <label className="form-label ven-label">
                    Mobile No {num}
                  </label>
                  <div className="input-group ven-input-group">
                    <span className="input-group-text ven-prefix">+91</span>
                    <input
                      type="tel"
                      className="form-control ven-input"
                      name={`mobile${num}`}
                      value={formData[`mobile${num}`]}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Landline */}
            <div className="row ven-row mb-3">
              <div className="col-md-6 ven-field">
                <label className="form-label ven-label">Landline No</label>
                <div className="input-group ven-input-group">
                  <span className="input-group-text ven-prefix">022</span>
                  <input
                    type="text"
                    className="form-control ven-input"
                    name="landline"
                    value={formData.landline}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

      <div className="row ven-row mb-3">
  <div className="col-md-12">
    <button 
      type="button"
      className="btn btn-info"
      onClick={() => setShowAddressFields(!showAddressFields)}
    >
      {showAddressFields ? 'Hide Property' : 'Show Property'}
    </button>
  </div>
</div>

{/* Address Fields - Toggle visibility with button */}
{showAddressFields && (
  <>
    {/* Address */}
    <div className="row ven-row mb-3">
      <div className="col-md-3 ven-field">
        <label className="form-label ven-label">Address 1</label>
        <input 
          type="text" 
          className="form-control ven-input"
          name="address1"
          value={formData.address1}
          onChange={handleInputChange}
          placeholder="Enter Address 1"
        />
      </div>

      <div className="col-md-3 ven-field">
        <label className="form-label ven-label">Address 2</label>
        <input 
          type="text" 
          className="form-control ven-input"
          name="address2"
          value={formData.address2}
          onChange={handleInputChange}
          placeholder="Enter Address 2"
        />
      </div>
      <div className="col-md-3 ven-field">
        <label className="form-label ven-label">Landmark</label>
        <input 
          type="text" 
          className="form-control ven-input"
          name="landmark"
          value={formData.landmark}
          onChange={handleInputChange}
          placeholder="Enter Landmark"
        />
      </div>
      <div className="col-md-3 ven-field">
        <label className="form-label ven-label">Area</label>
        <input 
          type="text" 
          className="form-control ven-input"
          name="area"
          value={formData.area}
          onChange={handleInputChange}
          placeholder="Enter Area"
        />
      </div>
    </div>

    {/* Location */}
    <div className="row ven-row mb-3">
      <div className="col-md-3 ven-field">
        <label className="form-label ven-label">Country</label>
        <select 
          className="form-select ven-input"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
        >
          <option value="India">India</option>
        </select>
      </div>

      <div className="col-md-3 ven-field">
        <label className="form-label ven-label">State</label>
        <select 
          className="form-select ven-input"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
        >
          <option value="">Select State</option>
          {staticStates.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3 ven-field">
        <label className="form-label ven-label">City</label>
        <select 
          className="form-select ven-input"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
        >
          <option value="">Select City</option>
          {formData.state && staticCities[formData.state] ? (
            staticCities[formData.state].map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))
          ) : (
            formData.city && formData.city !== '' && (
              <option value={formData.city}>{formData.city}</option>
            )
          )}
        </select>
      </div>

      <div className="col-md-3 ven-field">
        <label className="form-label ven-label">Pin Code</label>
        <input 
          type="text" 
          className="form-control ven-input"
          name="pin_code"
          value={formData.pin_code}
          onChange={handleInputChange}
          placeholder="Enter Pin Code"
        />
      </div>
    </div>
  </>
)}

            {/* Remark */}
            <div className="row ven-row mb-3">
              <div className="col-md-12 ven-field">
                <label className="form-label ven-label">Remark</label>
                <textarea
                  rows="3"
                  className="form-control ven-input"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  placeholder={formData.remark || "Enter Remark"}
                ></textarea>
              </div>
            </div>

            {/* Active Checkbox */}
            <div className="form-check ven-check mb-3">
              <input
                type="checkbox"
                className="form-check-input ven-checkbox"
                id="activeCheck"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <label className="form-check-label ven-label" htmlFor="activeCheck">
                Set Customer As Active ?
              </label>
            </div>

            {/* Save Button */}
            <div className="ven-save-btn">
              <button 
                type="submit" 
                className="btn btn-success ven-btn-save"
                disabled={loading}
              >
                {loading ? 'Saving...' : (id ? 'Update' : 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categoryError && (
            <div className="alert alert-danger py-2">{categoryError}</div>
          )}
          {categorySuccess && (
            <div className="alert alert-success py-2">{categorySuccess}</div>
          )}
          <div className="mb-3">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={categoryLoading}
              autoFocus
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={categoryLoading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddCategory}
            disabled={categoryLoading || !newCategory.trim()}
          >
            {categoryLoading ? 'Adding...' : 'Add Category'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default AddVendors;